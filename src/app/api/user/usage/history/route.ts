import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";

export const GET = withAuth(async (req, user) => {
  try {
    const usageData = await (prisma as any).tokenUsage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    // Group by feature
    const featureBreakdown = usageData.reduce((acc: any, curr: any) => {
      if (!acc[curr.feature]) {
        acc[curr.feature] = {
          tokens: 0,
          cost: 0,
          count: 0
        };
      }
      acc[curr.feature].tokens += curr.totalTokens;
      acc[curr.feature].cost += curr.cost;
      acc[curr.feature].count += 1;
      return acc;
    }, {});

    return Response.json({ 
      usage: usageData,
      breakdown: featureBreakdown,
      totalCost: usageData.reduce((sum: number, curr: any) => sum + curr.cost, 0),
      totalTokens: usageData.reduce((sum: number, curr: any) => sum + curr.totalTokens, 0)
    });
  } catch (error: any) {
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
});
