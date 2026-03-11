import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token");

    if (!token) return new Response("Unauthorized", { status: 401 });

    const decoded: { id: string } = verify(
      token.value,
      process.env.JWT_SECRET as string,
    ) as { id: string };

    if (!decoded) return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const conference = await prisma.conference.findUnique({ where: { id } });

    if (!conference) return new Response("Not Found", { status: 404 });

    if (conference.authorId !== decoded.id)
      return new Response("Forbidden", { status: 403 });

    await prisma.conference.delete({ where: { id } });

    return new Response("Deleted", { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
