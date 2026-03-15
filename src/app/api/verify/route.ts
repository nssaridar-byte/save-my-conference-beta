import { prisma } from "@/lib/prisma";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, code, rememberMe } = await req.json();

    if (!email || !code) {
      return new Response("Missing email or code", { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { 
        email,
        verificationCode: code 
      },
    });

    if (!user) {
      return new Response("Invalid verification code", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationCode: null,
      },
    });

    const jwtToken = await sign(
      { id: updatedUser.id },
      process.env.JWT_SECRET as string,
    );

    const cookieStore = await cookies();

    const cookieOptions: any = {
      secure: process.env.NODE_ENV === "production",
      path: "/",
    };

    if (rememberMe) {
      cookieOptions.maxAge = 30 * 24 * 60 * 60; // 30 days
    }

    cookieStore.set("token", jwtToken, cookieOptions);

    return Response.json({ user: updatedUser });
  } catch (error: any) {
    console.error("Verification catastrophic error:", error);
    return Response.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
