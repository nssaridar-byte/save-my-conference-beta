import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

export const uploadRouter = {
  docUploader: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 20 },
    image: { maxFileSize: "8MB", maxFileCount: 20 },
    text: { maxFileSize: "4MB", maxFileCount: 20 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "8MB",
      maxFileCount: 20,
    },
    "application/msword": {
      maxFileSize: "8MB",
      maxFileCount: 20,
    },
  })
    .input(z.object({ conferenceId: z.string().optional() }))
    .middleware(async ({ req, input }) => {
      const cookieStore = await cookies();
      const token = cookieStore.get("token");
      if (!token) throw new Error("Unauthorized");
      const decoded = verify(token.value, process.env.JWT_SECRET as string) as {
        id: string;
      };
      return { userId: decoded.id, conferenceId: input.conferenceId };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      console.log(`[UPLOADTHING] Processing file: ${file.name}`);
      
      try {
        const fileUrl = file.ufsUrl || file.url;
        
        let targetConferenceId: string | null = metadata.conferenceId as string;
        
        // If no conferenceId provided, try to find the user's most recent conference
        if (!targetConferenceId || targetConferenceId === "GLOBAL" || targetConferenceId === "undefined") {
          const latestConf = await prisma.conference.findFirst({
            where: { authorId: metadata.userId },
            orderBy: { date: 'desc' }
          });
          
          if (latestConf) {
            targetConferenceId = latestConf.id;
            console.log(`[UPLOADTHING] No conferenceId provided, falling back to: ${targetConferenceId}`);
          } else {
            console.warn(`[UPLOADTHING] No conference found for user: ${metadata.userId}. Saving as GLOBAL (null).`);
            targetConferenceId = null;
          }
        }

        const uploadedFile = await prisma.file.create({
          data: {
            userId: metadata.userId,
            name: file.name,
            url: fileUrl,
            conferenceId: targetConferenceId,
            isSelected: true,
          },
        });
        
        console.log(`[UPLOADTHING] Created record: ${uploadedFile.id} for conf: ${metadata.conferenceId}`);
      } catch (error: any) {
        console.error("[UPLOADTHING] DB ERROR:", error.message);
        throw error;
      }
    }),
} satisfies FileRouter;


