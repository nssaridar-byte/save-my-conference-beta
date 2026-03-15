import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth";

export const PATCH = withAdmin(async (req, user, { params }) => {
  try {
    const { id } = await params;
    const { role, status } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role,
        // status is not currently in the schema, but we could add it or handle it separately
        // For now we just update the role as per plan
      }
    });

    return Response.json({ user: updatedUser });
  } catch (error: any) {
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
});
