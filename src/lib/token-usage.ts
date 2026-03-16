import { prisma } from "./prisma";

// Pricing per 1M tokens for Gemini 1.5 Flash
const PRICING = {
  INPUT: 0.075 / 1000000,
  OUTPUT: 0.30 / 1000000,
};

export async function recordTokenUsage(
  userId: string,
  feature: string,
  usageMetadata: any
) {
  const promptTokens = usageMetadata.promptTokenCount || 0;
  const completionTokens = usageMetadata.candidatesTokenCount || 0;
  const totalTokens = usageMetadata.totalTokenCount || 0;

  // Calculate cost
  const cost = (promptTokens * PRICING.INPUT) + (completionTokens * PRICING.OUTPUT);

  try {
    // @ts-ignore - Prisma might need a moment to sync types
    const usage = await prisma.tokenUsage.create({
      data: {
        userId,
        feature,
        promptTokens,
        completionTokens,
        totalTokens,
        cost,
      },
    });
    return usage;
  } catch (error) {
    console.error("Failed to record token usage:", error);
    // Don't throw, we don't want to break the main feature if logging fails
    return null;
  }
}
