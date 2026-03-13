import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return new Response("Unauthorized", { status: 401 });
    const decoded: { id: string; user: User; name: string } = verify(
      token.value,
      process.env.JWT_SECRET as string,
    ) as { id: string; user: User; name: string };

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        usage: true,
      },
    });

    if (!user) return new Response("Unauthorized", { status: 401 });

    return Response.json(user.usage);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
