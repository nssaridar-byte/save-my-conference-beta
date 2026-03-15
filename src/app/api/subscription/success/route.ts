import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";

export const POST = withAuth(async (req, user) => {
  try {
    const { billing } = await req.json();

    const subscription = await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Mock 30 days
      },
      create: {
        userId: user.id,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (currentUser?.role !== "ADMIN") {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "PRO" },
      });
    }

    return Response.json({ subscription });
  } catch (error: any) {
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
});
