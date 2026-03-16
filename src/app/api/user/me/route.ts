import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";

export const GET = withAuth(async (req, user) => {
  try {
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        subscription: true,
        usage: true,
        conferences: true,
        files: true,
        quizes: true,
        speeches: true,
      },
    });

    if (!fullUser) {
      return new Response("User not found", { status: 404 });
    }

    // Remove sensitive data
    const { password, verificationCode, ...safeUser } = fullUser;

    return Response.json({ user: safeUser });
  } catch (error: any) {
    console.error("Me API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
