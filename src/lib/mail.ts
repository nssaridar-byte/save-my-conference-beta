import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationCode = async (email: string, code: string) => {
  // Fallback for development if no API key is present
  if (!process.env.RESEND_API_KEY) {
    console.log("\n" + "=".repeat(50));
    console.log(`[VERIFICATION CODE FOR ${email.toUpperCase()}]`);
    console.log(`CODE: ${code}`);
    console.log("=".repeat(50) + "\n");
    return;
  }

  try {
    await resend.emails.send({
      from: 'Save My Conference <onboarding@resend.dev>',
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Verify Your Account</h2>
          <p style="color: #666; font-size: 16px;">Welcome to Save My Conference. Please use the following code to verify your mission access:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 20px; background: #f9f9f9; border-radius: 8px; text-align: center; color: #000; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #999; text-align: center;">This code will expire shortly. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    // Silent fallback to console in case of API error during development
    console.log(`[FALLBACK] Verification code for ${email}: ${code}`);
  }
};
