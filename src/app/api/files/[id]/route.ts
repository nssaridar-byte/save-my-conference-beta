import { AuthUser, withAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { utapi } from "@/lib/uploadThing";

export const GET = withAuth(
  async (
    req: Request,
    user: AuthUser,
    context: { params: Promise<{ id: string }> },
  ) => {
    try {
      const { id } = await context.params;

      if (!id || id === "undefined" || id === "null") {
        return Response.json({ files: [] });
      }

      console.log(`[FILES_API] Fetching files for: ${id} (User: ${user.id})`);
      
      const whereClause: any = { userId: user.id };
      if (id !== "all") {
        whereClause.conferenceId = id;
      }

      const files = await prisma.file.findMany({
        where: whereClause,
        orderBy: {
          createdAt: "desc"
        }
      });
      
      console.log(`[FILES_API] Found ${files.length} files`);
      
      return Response.json({ files });
    } catch (error: any) {
      console.error("[FILES_API] ERROR:", error.message);
      return new Response(error.message, { status: 500 });
    }

  },
);
export const DELETE = withAuth(
  async (
    req: Request,
    user: AuthUser,
    context: { params: Promise<{ id: string }> },
  ) => {
    try {
      const { id } = await context.params;

      const file = await prisma.file.findFirst({ 
        where: { id, userId: user.id } 
      });

      if (!file) return new Response("File not found or unauthorized", { status: 404 });

      try {
        await utapi.deleteFiles(file.id);
      } catch (utError) {
        console.warn("Failed to delete file from UploadThing:", utError);
      }

      await prisma.file.delete({
        where: {
          id,
        },
      });
      return new Response("File deleted successfully", { status: 200 });
    } catch (error: any) {
      console.error("Delete Error:", error);
      return new Response("Failed to delete", { status: 500 });
    }
  },
);
export const PATCH = withAuth(
  async (
    req: Request,
    user: AuthUser,
    context: { params: Promise<{ id: string }> },
  ) => {
    try {
      const { id } = await context.params;
      const { isSelected } = await req.json();

      const file = await prisma.file.findFirst({ 
        where: { id, userId: user.id } 
      });
      if (!file) return new Response("File not found or unauthorized", { status: 404 });

      const updated = await prisma.file.update({
        where: { id },
        data: { isSelected },
      });

      return Response.json({ file: updated });
    } catch (error) {
      return new Response("Error updating file", { status: 500 });
    }
  },
);
