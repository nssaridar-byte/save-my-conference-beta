import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(
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
    const conference = await prisma.conference.findUnique({
      where: {
        id: id as string,
      },
    });

    if (!conference)
      return new Response("Conference not found", { status: 404 });

    await prisma.conference.update({
      where: {
        id: id as string,
      },
      data: {
        status: "Active",
      },
    });

    await prisma.conference.updateMany({
      where: {
        authorId: decoded.id,
        NOT: [
          {
            id: id as string,
          },
        ],
      },
      data: {
        status: "Inactive",
      },
    });

    return Response.json({ conference });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
