import { prisma } from "./src/lib/prisma";

async function main() {
  try {
    const tableInfo = await (prisma as any).$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User';
    `;
    console.log(JSON.stringify(tableInfo, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await (prisma as any).$disconnect();
  }
}

main();
