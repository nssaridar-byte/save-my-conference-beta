const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.user.findFirst({
      include: {
        tokenUsages: true
      }
    });
    console.log("SUCCESS: tokenUsages field is recognized.");
    if (user) {
      console.log(`Found user: ${user.id}`);
    }
  } catch (err) {
    console.error("FAILURE: tokenUsages field is NOT recognized.");
    console.error(err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
