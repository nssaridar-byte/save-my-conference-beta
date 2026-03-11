import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { isEmpty } from "../isEmpty";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token");

    if (!token) return new Response("Please sign in", { status: 401 });
    const decoded: { id: string } = verify(
      token.value,
      process.env.JWT_SECRET as string,
    ) as { id: string };
    if (!decoded) return new Response("Unauthorized", { status: 401 });

    const conference = await prisma.conference.findFirst({
      where: {
        authorId: decoded.id,
        status: "Active",
      },
      include: {
        author: true,
      },
    });

    if (!conference)
      return new Response("No active conferences found", { status: 404 });

    return Response.json({ conference });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token");

    if (!token) return new Response("Unauthorized", { status: 401 });
    const decoded: { id: string } = verify(
      token.value,
      process.env.JWT_SECRET as string,
    ) as { id: string };
    if (!decoded) return new Response("Unauthorized", { status: 401 });

    await prisma.conference.updateMany({
      where: {
        authorId: decoded.id,
        status: "Active",
      },
      data: {
        status: "Inactive",
      },
    });
    const { title, date, location, committee, country } = await req.json();

    if (
      !title ||
      !date ||
      !location ||
      !committee ||
      !country ||
      isEmpty([title, date, location, committee, country])
    )
      return new Response("Please fill all fields", { status: 400 });

    const conference = await prisma.conference.create({
      data: {
        title,
        date: new Date(date),
        location,
        committee,
        country,
        status: "Active",
        authorId: decoded.id,
      },
    });

    return Response.json({ conference });
  } catch (error: any) {
    console.log(error);
    return new Response(error, { status: 500 });
  }
}
