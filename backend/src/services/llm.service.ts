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
              "You are a helpful AI assistant. Follow the user's request clearly and concisely.",
          },
  
          {
            role: "user",
            content: prompt,
          },
        ],
  
        temperature: 0.2,
  
        max_completion_tokens:
          500,
      });
  
    const latencyMs =
      Date.now() -
      startedAt;
  
    const content =
      completion
        .choices[0]
        ?.message
        ?.content ?? "";
  
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