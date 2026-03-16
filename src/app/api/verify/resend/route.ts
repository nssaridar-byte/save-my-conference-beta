import { prisma } from "@/lib/prisma";
import { sendVerificationCode, sendAdminSpamAlert } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email, isSpamAlert } = await req.json();

    if (!email) {
      return new Response("Missing email", { status: 400 });
    }

    console.log(`[API-RESEND] Request received for: ${email}. isSpamAlert: ${isSpamAlert}`);

    const user = await prisma.user.findFirst({
      where: { 
        email: {
          equals: email,
          mode: 'insensitive'
        }
      },
    });

    if (!user) {
      console.warn(`[API-RESEND] User with email ${email} not found in database.`);
      return new Response("User not found", { status: 404 });
    }

    if (isSpamAlert) {
      console.log(`[API-RESEND] Triggering admin spam alert for ${user.email}`);
      await sendAdminSpamAlert(user.email || email);
      return Response.json({ message: "New verification code sent" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationCode },
    });

    await sendVerificationCode(email, verificationCode);

    return Response.json({ message: "New verification code sent" });
  } catch (error: any) {
    console.error("Resend API Error:", error);
    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
