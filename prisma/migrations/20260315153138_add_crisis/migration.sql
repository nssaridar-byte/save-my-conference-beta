-- CreateTable
CREATE TABLE "Crisis" (
    "id" TEXT NOT NULL,
    "conferenceId" TEXT NOT NULL,
    "events" JSONB,
    "response" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Crisis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Crisis" ADD CONSTRAINT "Crisis_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE CASCADE ON UPDATE CASCADE;
