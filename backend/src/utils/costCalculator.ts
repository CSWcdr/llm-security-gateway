type ModelPricing = {
    inputPerMillion: number;
    outputPerMillion: number;
  };
  
  const MODEL_PRICING: Record<
    string,
    ModelPricing
  > = {
    "openai/gpt-oss-20b": {
      inputPerMillion: 0.075,
      outputPerMillion: 0.30,
    },
  };
  
  export function calculateLLMCost(
    model: string,
    inputTokens: number,
    outputTokens: number
  ) {
    const pricing =
      MODEL_PRICING[model];
  
    if (!pricing) {
      return 0;
    }
  
    const inputCost =
      (inputTokens / 1_000_000) *
      pricing.inputPerMillion;
  
    const outputCost =
      (outputTokens / 1_000_000) *
      pricing.outputPerMillion;
  
    return inputCost + outputCost;
  }