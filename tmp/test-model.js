const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const usageCount = await prisma.tokenUsage.count();
    console.log(`SUCCESS: TokenUsage model recognized. Count: ${usageCount}`);
  } catch (err) {
    console.error("FAILURE: TokenUsage model NOT recognized.");
    console.error(err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
