import { AuthUser, withAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const GET = withAuth(
  async (
    req: Request,
    user: AuthUser,
    context: { params: Promise<{ id: string }> },
  ) => {
    try {
      const { id } = await context.params;
      const conferenceId = String(id);

      const history = await prisma.crisis.findMany({
        where: {
          userId: user.id,
          conferenceId: conferenceId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return Response.json({ history });
    } catch (error: any) {
      console.error("[CRISIS_HISTORY] Error:", error);
      return new Response("Failed to fetch crisis history", { status: 500 });
    }
  }
);
