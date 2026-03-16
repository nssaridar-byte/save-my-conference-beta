import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async (req, user, { params }) => {
  try {
    const { id } = await params;
    
    const usage = await (prisma as any).tokenUsage.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
    });

    // Group by feature
    const featureBreakdown = usage.reduce((acc: any, curr: any) => {
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
      usage,
      breakdown: featureBreakdown,
      totalCost: usage.reduce((sum: number, curr: any) => sum + curr.cost, 0),
      totalTokens: usage.reduce((sum: number, curr: any) => sum + curr.totalTokens, 0)
    });
  } catch (error: any) {
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
});
