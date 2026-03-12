import { prisma } from "@/lib/prisma";
import { isEmpty } from "../isEmpty";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || isEmpty([email, password])) {
      return new Response("Please provide email and password", { status: 400 });
    }

    const userCheck = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userCheck) return new Response("Email taken", { status: 409 });

    const user = await prisma.user.create({
      data: {
        email,
        password: await hash(password, 10),
        name,
      },
    });

    const token = await sign(
      { id: user.id, user, name },
      process.env.JWT_SECRET as string,
    );

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      secure: true,
      path: "/",
    });
    return Response.json({ user });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
