import {
    groq,
  } from "../config/groq";
  
  import {
    env,
  } from "../config/env";
  
  import {
    calculateLLMCost,
  } from "../utils/costCalculator";
  
  
  export async function generateLLMResponse(
    prompt: string
  ) {
    const startedAt =
      Date.now();
  
    const completion =
      await groq.chat.completions.create({
        model:
          env.GROQ_MODEL,
  
        messages: [
          {
            role: "system",
  
            content:
              "You are a helpful AI assistant. Answer the user's request clearly, accurately, and concisely. Always provide a final user-facing answer.",
          },
  
          {
            role: "user",
  
            content:
              prompt,
          },
        ],
  
        /*
         * GPT-OSS is a reasoning model.
         *
         * We do not need its internal
         * reasoning trace inside our
         * Security Gateway response.
         *
         * This helps ensure the available
         * output budget is used for the
         * actual final answer.
         */
        include_reasoning:
          false,
  
        /*
         * LOW is enough for normal
         * Playground questions and keeps
         * latency/token usage lower.
         */
        reasoning_effort:
          "low",
  
        temperature:
          0.2,
  
        /*
         * 500 was too restrictive for a
         * reasoning model and could result
         * in an empty final answer.
         */
        max_completion_tokens:
          1500,
  
        stream:
          false,
      });
  
  
    const latencyMs =
      Date.now() -
      startedAt;
  
  
    const rawContent =
      completion
        .choices[0]
        ?.message
        ?.content;
  
  
    const content =
      typeof rawContent ===
        "string"
        ? rawContent.trim()
        : "";
  
  
    /*
     * Never silently return an empty
     * successful LLM response.
     *
     * If Groq returns no final text,
     * treat it as an actual provider
     * failure instead of letting the UI
     * display a successful blank request.
     */
    if (!content) {
      throw new Error(
        "LLM provider returned an empty response."
      );
    }
  
  
    const inputTokens =
      completion.usage
        ?.prompt_tokens ?? 0;
  
  
    const outputTokens =
      completion.usage
        ?.completion_tokens ?? 0;
  
  
    const totalTokens =
      completion.usage
        ?.total_tokens ?? 0;
  
  
    const estimatedCostUsd =
      calculateLLMCost(
        env.GROQ_MODEL,
        inputTokens,
        outputTokens
      );
  
  
    return {
      content,
  
      model:
        env.GROQ_MODEL,
  
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
      },
  
      latencyMs,
  
      estimatedCostUsd,
    };
  }