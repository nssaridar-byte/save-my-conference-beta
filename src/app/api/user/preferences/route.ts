import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";

export const POST = withAuth(async (req, user) => {
  try {
    const { theme, layoutMode } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        theme,
        layoutMode,
      },
    }) as any;

    return Response.json({ success: true, theme: updatedUser.theme, layoutMode: updatedUser.layoutMode });
  } catch (error: any) {
    console.error("Preferences API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
