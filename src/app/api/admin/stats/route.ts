import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async () => {
  try {
    const totalUsers = await prisma.user.count();
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: "active" },
    });
    
    // Total MRR: Only based on actual active subscriptions
    const mrr = activeSubscriptions * 8;
    
    const conversionRate = totalUsers > 0 ? (activeSubscriptions / totalUsers) * 100 : 0;

    return Response.json({
      stats: [
        { 
          label: "Total MRR", 
          value: `$${mrr.toLocaleString()}`, 
          delta: "Based on $8/pro", 
          icon: "TrendingUp", 
          color: "text-green-500" 
        },
        { 
          label: "Active Delegates", 
          value: totalUsers.toString(), 
          delta: "Total registered", 
          icon: "Users", 
          color: "text-primary" 
        },
        { 
          label: "Pro Subscribers", 
          value: activeSubscriptions.toString(), 
          delta: `${conversionRate.toFixed(1)}% conversion`, 
          icon: "Crown", 
          color: "text-primary" 
        },
        { 
          label: "System Status", 
          value: "Nominal", 
          delta: "All systems operational", 
          icon: "Activity", 
          color: "text-green-500" 
        },
      ]
    });
  } catch (error: any) {
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
});
