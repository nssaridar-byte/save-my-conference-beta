import { prisma } from "@/lib/prisma";
import { withAuth, AuthUser } from "@/lib/auth";

export const POST = withAuth(
  async (req: Request, user: AuthUser, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const conference = await prisma.conference.findUnique({
        where: {
          id: id as string,
        },
      });

      if (!conference)
        return new Response("Conference not found", { status: 404 });

      if (conference.authorId !== user.id)
        return new Response("Forbidden", { status: 403 });

      await prisma.conference.update({
        where: {
          id: id as string,
        },
        data: {
          status: "Active",
        },
      });

      await prisma.conference.updateMany({
        where: {
          authorId: user.id,
          NOT: [
            {
              id: id as string,
            },
          ],
        },
        data: {
          status: "Inactive",
        },
      });

      return Response.json({ conference });
    } catch (error: any) {
      return new Response(error.message || "An unexpected error occurred", {
        status: 500,
      });
    }
  }
);
