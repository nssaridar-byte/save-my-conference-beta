import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async () => {
  try {
    const users = await (prisma.user as any).findMany({
      orderBy: { createdAt: "desc" },
    });

    const allTokenUsages = await (prisma as any).tokenUsage.findMany({
      select: {
        userId: true,
        totalTokens: true,
        cost: true
      }
    });

    const formattedUsers = users.map((user: any) => {
      const userTokenUsages = allTokenUsages.filter((tu: any) => tu.userId === user.id);
      const totalTokens = userTokenUsages.reduce((sum: number, tu: any) => sum + tu.totalTokens, 0);
      const totalCost = userTokenUsages.reduce((sum: number, tu: any) => sum + tu.cost, 0);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: "Active",
        usage: "0 speeches", // Placeholder or fetch separately if needed
        totalTokens,
        totalCost: totalCost.toFixed(2)
      };
    });

    return Response.json({ users: formattedUsers });
  } catch (error: any) {
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
});
