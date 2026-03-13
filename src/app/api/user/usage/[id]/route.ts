import { prisma } from "@/lib/prisma";
import { withAuth, AuthUser } from "@/lib/auth";
import { differenceInHours } from "date-fns";

export const GET = withAuth(
  async (
    req: Request,
    user: AuthUser,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    try {
      const { id } = await params;
      const userData = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          usage: true,
        },
      });

      if (!userData) return new Response("Unauthorized", { status: 401 });

      return Response.json({ usage: userData.usage });
    } catch (error: any) {
      return new Response(error.message || "An unexpected error occurred", {
        status: 500,
      });
    }
  },
);
