
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const connectionString = "postgresql://neondb_owner:npg_vbks0LztD9Vn@ep-cold-dust-ah5qnsx9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const files = await prisma.file.findMany({
    include: {
      conference: true,
    }
  });
  console.log('--- ALL FILES IN DB ---');
  files.forEach(f => {
    console.log(`ID: ${f.id} | Name: ${f.name} | Conf: ${f.conference?.title} (${f.conferenceId}) | User: ${f.userId}`);
  });
  
  const conferences = await prisma.conference.findMany();
  console.log('--- ALL CONFERENCES IN DB ---');
  conferences.forEach(c => {
    console.log(`ID: ${c.id} | Title: ${c.title}`);
  });
  
  await prisma.$disconnect();
}

main().catch(console.error);
