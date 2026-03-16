import { recordTokenUsage } from "./src/lib/token-usage";
import { prisma } from "./src/lib/prisma";

async function test() {
  console.log("Testing token usage recording...");
  
  // Find a test user
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found to test with.");
    return;
  }

  console.log(`Using user: ${user.email} (${user.id})`);

  const mockMetadata = {
    promptTokenCount: 1000,
    candidatesTokenCount: 500,
    totalTokenCount: 1500
  };

  const usage = await recordTokenUsage(user.id, "test-feature", mockMetadata);
  
  if (usage) {
    console.log("Usage recorded successfully:");
    console.log(usage);
    
    // Check if it shows up in aggregated API logic (simulated)
    const totalCost = (await (prisma.tokenUsage as any).aggregate({
      where: { userId: user.id },
      _sum: { cost: true }
    }))._sum.cost;
    
    console.log(`Total cost for user: $${totalCost.toFixed(4)}`);
  } else {
    console.error("Failed to record usage.");
  }
}

test().catch(console.error);
