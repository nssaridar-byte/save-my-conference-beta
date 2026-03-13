import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { isEmpty } from "../../isEmpty";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token) return new Response("Unauthorized", { status: 401 });

    const decoded: { id: string; user: User; name: string } = verify(
      token.value,
      process.env.JWT_SECRET as string,
    ) as { id: string; user: User; name: string };
    if (!decoded) return new Response("Unauthorized", { status: 401 });

    const { id } = await params;
    const conference = await prisma.conference.findMany({
      where: {
        authorId: decoded.id,
        id,
      },
    });
    if (!conference)
      return new Response("Conference not found", { status: 404 });

    const speeches = await prisma.speech.findMany({
      where: {
        userId: decoded.id,
        conferenceId: id,
      },
    });

    if (speeches.length == 0)
      return new Response("No speeches found", { status: 404 });
    return Response.json({ speeches });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get("token");

    if (!token) return new Response("Unauthorized", { status: 401 });
    const decoded: { id: string; user: User; name: string } = verify(
      token.value,
      process.env.JWT_SECRET as string,
    ) as { id: string; user: User; name: string };

    if (!decoded) return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const conference = await prisma.conference.findUnique({
      where: { id },
    });
    if (!conference)
      return new Response("Conferencen not found", { status: 404 });

    const { title, content, topic } = await req.json();

    if (!title || !content || !topic || isEmpty([title, content, topic]))
      return new Response("Please Fill All Fields", { status: 400 });

    const speech = await prisma.speech.create({
      data: {
        title,
        content,
        conferenceId: id,
        userId: decoded.id,
        topic,
      },
      include: {
        conference: true,
        user: true,
      },
    });

    return Response.json({ speech });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return new Response("Unauthorized", { status: 401 });
    const decoded: { id: string; user: User; name: string } = verify(
      token.value,
      process.env.JWT_SECRET as string,
    ) as { id: string; user: User; name: string };

    if (!decoded) return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const speech = await prisma.speech.findUnique({ where: { id } });

    if (!speech) return new Response("Speech not found", { status: 404 });

    const { title, content } = await req.json();

    const newSpeech = await prisma.speech.update({
      where: {
        id,
      },
      data: {
        title:
          title && title !== "" && title !== speech.title
            ? title
            : speech.title,
        content:
          content && content !== "" && content !== speech.content
            ? content
            : speech.content,
      },
    });

    return Response.json({ speech: newSpeech });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
