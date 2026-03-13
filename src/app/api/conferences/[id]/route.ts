import { prisma } from "@/lib/prisma";
import { withAuth, AuthUser } from "@/lib/auth";

export const DELETE = withAuth(
  async (req: Request, user: AuthUser, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;

      const conference = await prisma.conference.findUnique({ where: { id } });

      if (!conference) return new Response("Not Found", { status: 404 });

      if (conference.authorId !== user.id)
        return new Response("Forbidden", { status: 403 });

      await prisma.conference.delete({ where: { id } });

      return new Response("Deleted", { status: 200 });
    } catch (error: any) {
      return new Response(error.message || "An unexpected error occurred", {
        status: 500,
      });
    }
  }
);

export const PUT = withAuth(
  async (req: Request, user: AuthUser, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const conference = await prisma.conference.findUnique({
        where: {
          id,
        },
      });

      if (!conference)
        return new Response("Conference not found", { status: 404 });

      if (conference.authorId !== user.id)
        return new Response("Forbidden", { status: 403 });

      const { title, date, location, committee, country, topic } =
        await req.json();

      const newConference = await prisma.conference.update({
        where: {
          id,
        },
        data: {
          title: title ? title : conference.title,
          date: date ? new Date(date) : conference.date,
          location: location ? location : conference.location,
          committee: committee ? committee : conference.committee,
          country: country ? country : conference.country,
          topic: topic ? topic : conference.topic,
        },
      });

      return Response.json({ conference: newConference });
    } catch (error: any) {
      return new Response(error.message || "An unexpected error occurred", {
        status: 500,
      });
    }
  }
);
