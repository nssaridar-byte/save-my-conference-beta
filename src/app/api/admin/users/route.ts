import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        speeches: {
          select: { id: true }
        }
      }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: "Active", // Assuming all are active for now, can be expanded
      usage: `${user.speeches.length} speeches`
    }));

    return Response.json({ users: formattedUsers });
  } catch (error: any) {
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
});
