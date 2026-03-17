import { prisma } from "./src/lib/prisma";

async function main() {
  try {
    console.log("Checking user with email 'test@example.com'...");
    const user = await prisma.user.findUnique({
      where: { email: "test@example.com" },
    });
    console.log("User found:", user);
  } catch (error) {
    console.error("Error in findUnique:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
