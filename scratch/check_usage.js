
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const usage = await prisma.usage.findMany();
    console.log("--- USAGE DATA ---");
    console.log(JSON.stringify(usage, null, 2));
    
    const users = await prisma.user.findMany({
      include: { subscription: true }
    });
    console.log("\n--- USER ROLES ---");
    users.forEach(u => {
      console.log(`User: ${u.email} | Role: ${u.role} | Sub: ${u.subscription ? "ACTIVE" : "NONE"}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
