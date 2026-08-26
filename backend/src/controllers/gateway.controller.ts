import type {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  import {
    gatewayScanSchema,
  } from "../validators/gateway.validator";
  
  import {
    getOrCreateSecurityPolicy,
  } from "../services/securityPolicy.service";
  
  import {
    generateLLMResponse,
  } from "../services/llm.service";
  
  import {
    createRequestLog,
  } from "../services/requestLog.service";
  
  import {
    scanPrompt,
  } from "../security/promptScanner";
  
  import {
    applySecurityPolicy,
  } from "../security/policyEngine";
  
  import {
    maskSensitiveData,
  } from "../security/maskSensitiveData";
  
  import {
    scanOutput,
  } from "../security/outputScanner";
  
  
  export function gatewayAuthTestController(
    _req: Request,
    res: Response
  ) {
    const auth =
      res.locals.gatewayAuth;
  
    return res.status(200).json({
      success: true,
  
      message:
        "API key authentication successful.",
  
      data: {
        authenticated: true,
  
        apiKeyId:
          auth.apiKeyId,
  
        projectId:
          auth.projectId,
  
        projectName:
          auth.projectName,
      },
    });
  }
  
  
  export async function gatewayScanController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation =
        gatewayScanSchema.safeParse(
          req.body
        );
  
      if (!validation.success) {
        return res.status(400).json({
          success: false,
  
          message:
            "Invalid gateway request.",
  
          errors:
            validation.error.flatten(),
        });
      }
  
      const projectId =
        res.locals.gatewayAuth
          .projectId;
  
      const policy =
        await getOrCreateSecurityPolicy(
          projectId
        );
  
      const findings =
        scanPrompt(
          validation.data.prompt
        );
  
      const result =
        applySecurityPolicy(
          findings,
          policy
        );
  
      if (result.shouldBlock) {
        return res.status(403).json({
          success: false,
  
          message:
            "Request blocked by security policy.",
  
          data: {
            decision:
              "BLOCKED",
  
            findings:
              result.findings,
          },
        });
      }
  
      const processedPrompt =
        maskSensitiveData(
          validation.data.prompt,
          result.findings
        );
  
      return res.status(200).json({
        success: true,
  
        message:
          "Prompt passed security checks.",
  
        data: {
          decision:
            "ALLOWED",
  
          originalPrompt:
            validation.data.prompt,
  
          processedPrompt,
  
          findings:
            result.findings,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  export async function gatewayChatController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation =
        gatewayScanSchema.safeParse(
          req.body
        );
  
      if (!validation.success) {
        return res.status(400).json({
          success: false,
  
          message:
            "Invalid gateway request.",
  
          errors:
            validation.error.flatten(),
        });
      }
  
      const auth =
        res.locals.gatewayAuth;
  
      const projectId =
        auth.projectId;
  
      const apiKeyId =
        auth.apiKeyId;
  
  
      /*
       * Load project security policy.
       */
      const policy =
        await getOrCreateSecurityPolicy(
          projectId
        );
  
  
      /*
       * INPUT SECURITY SCAN
       */
      const inputFindings =
        scanPrompt(
          validation.data.prompt
        );
  
      const inputSecurityResult =
        applySecurityPolicy(
          inputFindings,
          policy
        );
  
  
      /*
       * Create safe version of prompt.
       *
       * Sensitive information configured
       * with MASK will be removed before
       * logging or sending to the LLM.
       */
      const processedPrompt =
        maskSensitiveData(
          validation.data.prompt,
          inputSecurityResult.findings
        );
  
  
      /*
       * INPUT BLOCK
       */
      if (
        inputSecurityResult.shouldBlock
      ) {
        await createRequestLog({
          projectId,
          apiKeyId,
  
          decision:
            "BLOCKED",
  
          stage:
            "INPUT_SECURITY",
  
          processedPrompt,
  
          /*
           * No LLM call happened,
           * therefore cost is zero.
           */
          estimatedCostUsd:
            0,
  
          inputFindings:
            inputSecurityResult.findings,
        });
  
        return res.status(403).json({
          success: false,
  
          message:
            "Request blocked by security policy.",
  
          data: {
            decision:
              "BLOCKED",
  
            stage:
              "INPUT",
  
            findings:
              inputSecurityResult.findings,
          },
        });
      }
  
  
      /*
       * REAL LLM CALL
       */
      const llmResponse =
        await generateLLMResponse(
          processedPrompt
        );
  
  
      /*
       * OUTPUT SECURITY SCAN
       */
      const outputSecurityResult =
        scanOutput(
          llmResponse.content,
  
          policy
            .outputScanningEnabled,
  
          policy
            .outputScanningAction
        );
  
  
      /*
       * OUTPUT BLOCK
       *
       * Important:
       * The LLM was already called,
       * so this request still has a cost.
       */
      if (
        outputSecurityResult.shouldBlock
      ) {
        await createRequestLog({
          projectId,
          apiKeyId,
  
          decision:
            "BLOCKED",
  
          stage:
            "OUTPUT_SECURITY",
  
          model:
            llmResponse.model,
  
          processedPrompt,
  
          inputTokens:
            llmResponse
              .usage
              .inputTokens,
  
          outputTokens:
            llmResponse
              .usage
              .outputTokens,
  
          totalTokens:
            llmResponse
              .usage
              .totalTokens,
  
          latencyMs:
            llmResponse
              .latencyMs,
  
          estimatedCostUsd:
            llmResponse
              .estimatedCostUsd,
  
          inputFindings:
            inputSecurityResult.findings,
  
          outputFindings:
            outputSecurityResult.findings,
        });
  
        return res.status(403).json({
          success: false,
  
          message:
            "LLM response blocked by output security policy.",
  
          data: {
            decision:
              "BLOCKED",
  
            stage:
              "OUTPUT",
  
            model:
              llmResponse.model,
  
            usage:
              llmResponse.usage,
  
            latencyMs:
              llmResponse.latencyMs,
  
            estimatedCostUsd:
              llmResponse
                .estimatedCostUsd,
  
            security: {
              inputFindings:
                inputSecurityResult.findings,
  
              outputFindings:
                outputSecurityResult.findings,
            },
          },
        });
      }
  
  
      /*
       * Mask sensitive LLM output
       * if output policy is MASK.
       */
      const processedResponse =
        maskSensitiveData(
          llmResponse.content,
          outputSecurityResult.findings
        );
  
  
      /*
       * Store only a short preview
       * instead of the entire response.
       */
      const responsePreview =
        processedResponse.slice(
          0,
          500
        );
  
  
      /*
       * SUCCESS REQUEST LOG
       */
      const requestLog =
        await createRequestLog({
          projectId,
          apiKeyId,
  
          decision:
            "ALLOWED",
  
          stage:
            "COMPLETED",
  
          model:
            llmResponse.model,
  
          processedPrompt,
  
          responsePreview,
  
          inputTokens:
            llmResponse
              .usage
              .inputTokens,
  
          outputTokens:
            llmResponse
              .usage
              .outputTokens,
  
          totalTokens:
            llmResponse
              .usage
              .totalTokens,
  
          latencyMs:
            llmResponse
              .latencyMs,
  
          /*
           * Real calculated
           * estimated LLM cost.
           */
          estimatedCostUsd:
            llmResponse
              .estimatedCostUsd,
  
          inputFindings:
            inputSecurityResult.findings,
  
          outputFindings:
            outputSecurityResult.findings,
        });
  
  
      /*
       * FINAL RESPONSE
       */
      return res.status(200).json({
        success: true,
  
        message:
          "LLM response generated successfully.",
  
        data: {
          requestId:
            requestLog.id,
  
          decision:
            "ALLOWED",
  
          processedPrompt,
  
          response:
            processedResponse,
  
          model:
            llmResponse.model,
  
          usage:
            llmResponse.usage,
  
          latencyMs:
            llmResponse.latencyMs,
  
          estimatedCostUsd:
            llmResponse
              .estimatedCostUsd,
  
          security: {
            inputFindings:
              inputSecurityResult.findings,
  
            outputFindings:
              outputSecurityResult.findings,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }