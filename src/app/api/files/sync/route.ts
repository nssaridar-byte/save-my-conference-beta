
import { withAuth, AuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const POST = withAuth(async (req: Request, user: AuthUser) => {
  try {
    const { name, url, conferenceId } = await req.json();

    if (!name || !url) {
      return new Response("Missing name or url", { status: 400 });
    }

    // Deduplicate: check if this URL already exists for this user
    const existing = await prisma.file.findFirst({
      where: { url, userId: user.id }
    });

    if (existing) {
      return Response.json({ file: existing, message: "File already synced" });
    }

    const file = await prisma.file.create({
      data: {
        name,
        url,
        userId: user.id,
        conferenceId: conferenceId || null,
        isSelected: true,
      }
    });

    return Response.json({ file });
  } catch (error: any) {
    console.error("[FILES_SYNC_API] ERROR:", error.message);
    return new Response(error.message, { status: 500 });
  }
});
