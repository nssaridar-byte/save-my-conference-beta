import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

export const uploadRouter = {
  docUploader: f({
    pdf: {
      maxFileSize: "4MB",
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "4MB",
    },
    "application/msword": { maxFileSize: "4MB" },
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
      console.log("Upload complete for userId:", metadata.userId);
      try {
        const uploadedFile = await prisma.file.create({
          data: {
            userId: metadata.userId,
            name: file.name,
            url: file.ufsUrl,
            conferenceId: metadata.conferenceId as string,
          },
        });
        console.log(uploadedFile.id);
      } catch (error) {
        console.log(error);
        throw new Error("There was an new error");
      }
    }),
} satisfies FileRouter;
