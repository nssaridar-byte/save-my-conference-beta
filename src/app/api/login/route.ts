import { prisma } from "@/lib/prisma";
import { isEmpty } from "../isEmpty";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { sendVerificationCode, sendNewDeviceLoginEmail } from "@/lib/mail";
import { format } from "date-fns";

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

    const { rememberMe } = await req.json();

    if (!user.emailVerified) {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      await prisma.user.update({
        where: { id: user.id },
        data: { verificationCode }
      });

      await sendVerificationCode(email, verificationCode);

      return new Response("Unverified", { status: 403 });
    }

    const token = sign(
      { id: user.id },
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

    cookieStore.set("token", token, cookieOptions);

    // --- Device Recognition Logic ---
    try {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "Unknown IP";
      const userAgent = req.headers.get("user-agent") || "Unknown Browser";

      const existingDevice = await prisma.knownDevice.findFirst({
        where: {
          userId: user.id,
          ip,
          userAgent
        }
      });

      if (!existingDevice) {
        console.log(`[SECURITY] New device detected for ${email}: ${ip} | ${userAgent}`);
        
        // Send alert
        await sendNewDeviceLoginEmail(email, {
          ip,
          userAgent,
          time: format(new Date(), "PPpp")
        });

        // Save as known
        await prisma.knownDevice.create({
          data: {
            userId: user.id,
            ip,
            userAgent
          }
        });
      }
    } catch (deviceError) {
      console.error("Device recognition failed (silent):", deviceError);
      // We don't block login if security check fails
    }
    // ---------------------------------

    return new Response("Unverified", { status: 403 });
  } catch (error: any) {
    console.error("Login catastrophic error:", error);
    return Response.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
