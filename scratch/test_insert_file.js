
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const connectionString = "postgresql://neondb_owner:npg_vbks0LztD9Vn@ep-cold-dust-ah5qnsx9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // Get the first user
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No users found");
    return;
  }

  // Get the first conference
  const conf = await prisma.conference.findFirst();

  const file = await prisma.file.create({
    data: {
      name: "System Test Document.pdf",
      url: "https://example.com/test.pdf",
      userId: user.id,
      conferenceId: conf ? conf.id : null,
      isSelected: true
    }
  });
  
  console.log(`Created test file: ${file.id}`);
  await prisma.$disconnect();
}

main().catch(console.error);
