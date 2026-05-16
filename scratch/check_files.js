
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const files = await prisma.file.findMany({
    where: {
      conferenceId: "GLOBAL"
    }
  });
  console.log('Files with conferenceId GLOBAL:', files);
  
  const allFiles = await prisma.file.findMany({
    take: 5
  });
  console.log('Sample files:', allFiles);
}

main().catch(console.error).finally(() => prisma.$disconnect());
