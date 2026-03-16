const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    // Try to include speeches first as it was working before
    const user = await prisma.user.findFirst({
      include: {
        conferences: true,
        files: true,
        quizes: true,
        subscription: true,
        usage: true
      }
    });
    console.log("Basic fields work.");
    
    try {
      await prisma.user.findFirst({ include: { speeches: true } });
      console.log("Speeches field is recognized.");
    } catch (e) {
      console.log("Speeches field is NOT recognized.");
    }

    try {
      await prisma.user.findFirst({ include: { tokenUsages: true } });
      console.log("tokenUsages field is recognized.");
    } catch (e) {
      console.log("tokenUsages field is NOT recognized.");
    }

  } catch (err) {
    console.error("Critical failure during test:");
    console.error(err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
