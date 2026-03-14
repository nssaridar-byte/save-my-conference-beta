import { prisma } from "@/lib/prisma";
import { withAuth, AuthUser } from "@/lib/auth";

export const GET = withAuth(async (req: Request, user: AuthUser) => {
  try {
    const conference = await prisma.conference.findFirst({
      where: {
        authorId: user.id,
        status: "Active",
      },
      include: {
        author: true,
      },
    });

    if (!conference)
      return new Response("No active conferences found", { status: 404 });

    return Response.json({ conference });
  } catch (error: any) {
    return new Response(error.message || "An unexpected error occurred", {
      status: 500,
    });
  }
});
