import { prisma } from "@/lib/prisma";
import { isEmpty } from "../isEmpty";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { sendVerificationCode } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password || isEmpty([email, password]))
      return new Response("Please fill all fields", { status: 400 });

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        files: true,
        speeches: true,
        subscription: true,
        usage: true,
        conferences: true,
      },
    });

    if (!user) return new Response("User not found", { status: 404 });

    const passValid = await compare(password, user.password as string);

    if (!passValid) return new Response("Incorrect Password", { status: 400 });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationCode }
    });
    });

    await sendVerificationCode(email, verificationCode);

    return new Response("Unverified", { status: 403 });
  } catch (error: any) {
    console.error("Login catastrophic error:", error);
    return Response.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
