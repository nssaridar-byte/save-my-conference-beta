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

      const conference = await prisma.conference.findUnique({
        where: {
          id,
        },
      });
      if (!conference)
        return new Response("Conference not found", { status: 404 });

      const files = await prisma.file.findMany({
        where: {
          conferenceId: conference.id,
        },
      });
      if (files.length == 0)
        return new Response("No files found", { status: 404 });

      return Response.json({ files });
    } catch (error) {
      return new Response("");
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

      const file = await prisma.file.findUnique({ where: { id } });

      if (!file) return new Response("File not found", { status: 404 });

      await utapi.deleteFiles(file.id);

      await prisma.file.delete({
        where: {
          id,
        },
      });
      return new Response("File deleted successfully");
    } catch (error) {
      return new Response("");
    }
  },
);
