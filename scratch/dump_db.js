
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const files = await prisma.file.findMany({
    include: {
      conference: true,
      user: { select: { name: true, email: true } }
    }
  });
  console.log('--- ALL FILES IN DB ---');
  files.forEach(f => {
    console.log(`ID: ${f.id} | Name: ${f.name} | Conf: ${f.conference?.title} (${f.conferenceId}) | User: ${f.user?.email}`);
  });
  
  const conferences = await prisma.conference.findMany();
  console.log('--- ALL CONFERENCES IN DB ---');
  conferences.forEach(c => {
    console.log(`ID: ${c.id} | Title: ${c.title}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
