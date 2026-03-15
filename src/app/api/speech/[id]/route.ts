import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";

export const GET = withAuth(async (req, user, { params }) => {
  try {
    const { id } = await params;
    const conference = await prisma.conference.findUnique({
      where: {
        authorId: user.id,
        id,
      },
    });
    if (!conference)
      return new Response("Conference not found", { status: 404 });

    const speeches = await prisma.speech.findMany({
      where: {
        userId: user.id,
        conferenceId: id,
      },
    });

    if (speeches.length == 0)
      return new Response("No speeches found", { status: 404 });
    return Response.json({ speeches });
  } catch (error: any) {
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
});

export const POST = withAuth(async (req, user, { params }) => {
  try {
    const { id } = await params;

    const conference = await prisma.conference.findUnique({
      where: { id },
    });
    if (!conference)
      return new Response("Conference not found", { status: 404 });

    const { title, content, topic } = await req.json();

    if (!title || !content || !topic)
      return new Response("Please Fill All Fields", { status: 400 });

    const speech = await prisma.speech.create({
      data: {
        title,
        content,
        conferenceId: id,
        userId: user.id,
        topic,
      },
      include: {
        conference: true,
        user: true,
      },
    });

    return Response.json({ speech });
  } catch (error: any) {
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
});

export const PUT = withAuth(async (req, user, { params }) => {
  try {
    const { id } = await params;

    const speech = await prisma.speech.findUnique({ where: { id } });

    if (!speech) return new Response("Speech not found", { status: 404 });
    if (speech.userId !== user.id) return new Response("Unauthorized", { status: 401 });

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
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
});

export const DELETE = withAuth(async (req, user, { params }) => {
  try {
    const { id } = await params;

    const speech = await prisma.speech.findUnique({ where: { id } });

    if (!speech) return new Response("Speech not found", { status: 404 });
    if (speech.userId !== user.id) return new Response("Unauthorized", { status: 401 });

    await prisma.speech.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error: any) {
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
});
