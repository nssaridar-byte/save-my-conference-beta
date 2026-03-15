import { prisma } from "@/lib/prisma";
import { isEmpty } from "../isEmpty";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { sendVerificationCode } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || isEmpty([email, password])) {
      return new Response("Please provide email and password", { status: 400 });
    }

    const userCheck = await prisma.user.findFirst({
      where: { email },
    });

    if (userCheck) return new Response("Email taken", { status: 409 });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const user = await prisma.user.create({
      data: {
        email,
        password: await hash(password, 10),
        name: name || "",
        verificationCode,
      },
    });

    await sendVerificationCode(email, verificationCode);

    return Response.json({
      message: "Verification email sent",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    console.error("Signup catastrophic error:", error);
    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
