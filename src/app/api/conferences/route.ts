import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { isEmpty } from "../isEmpty";

export const GET = withAuth(async (req, user) => {
  try {
    const conferences = await prisma.conference.findMany({
      where: {
        authorId: user.id,
      },
      include: {
        author: true,
      },
    });

    return Response.json({ conferences });
  } catch (error: any) {
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
});

export const POST = withAuth(async (req, user) => {
  try {
    await prisma.conference.updateMany({
      where: {
        authorId: user.id,
        status: "Active",
      },
      data: {
        status: "Inactive",
      },
    });

    const { title, date, location, committee, country, topic } =
      await req.json();

    if (
      !title ||
      !date ||
      !location ||
      !committee ||
      !country ||
      !topic ||
      isEmpty([title, date, location, committee, country, topic])
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
        authorId: user.id,
        topic,
      },
    });

    return Response.json({ conference });
  } catch (error: any) {
    console.log(error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
});
