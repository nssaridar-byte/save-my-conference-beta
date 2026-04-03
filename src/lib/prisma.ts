import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      console.warn("[PRISMA] DATABASE_URL is missing during build. Skipping client initialization.");
      return null as any;
    }
    throw new Error("DATABASE_URL is not defined");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Force client reload after schema update
