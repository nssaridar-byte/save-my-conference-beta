import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationCode = async (email: string, code: string) => {
  // Fallback for development if no SMTP credentials are set
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("\n" + "=".repeat(50));
    console.log(`[VERIFICATION CODE FOR ${email.toUpperCase()}]`);
    console.log(`CODE: ${code}`);
    console.log("=".repeat(50) + "\n");
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Save My Conference <onboarding@savemyconference.com>',
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
    console.log(`[SUCCESS] Verification code sent to ${email}`);
  } catch (error) {
    console.error("Failed to send email via SMTP:", error);
    // Silent fallback to console
    console.log(`[FALLBACK] Verification code for ${email}: ${code}`);
  }
};

export const sendAdminSpamAlert = async (userEmail: string) => {
  const adminEmail = "savemyconference@gmail.com";
  
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass || user === "your-email@gmail.com") {
    console.log(`[DIAGNOSTIC] Admin alert blocked: SMTP credentials are placeholders or missing.`);
    console.log(`[DIAGNOSTIC] User: ${user}, Pass set: ${!!pass}`);
    return;
  }

  // Use the SMTP user as the from address directly if EMAIL_FROM is restricted
  const from = process.env.EMAIL_FROM || user;
  
  console.log(`[API-MAIL] Alerting admin ${adminEmail} about user ${userEmail}...`);

  try {
    await transporter.sendMail({
      from,
      to: adminEmail,
      subject: 'SECURITY ALERT: Potential Spam Activity',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ff0000; border-radius: 10px; max-width: 500px; margin: 0 auto; color: #000;">
          <h2 style="color: #ff0000; margin-top: 0;">Security Alert</h2>
          <p style="font-size: 16px;">The following delegate has requested verification resends 3 times in a single session:</p>
          <div style="font-size: 18px; font-weight: bold; padding: 15px; background: #fff5f5; border-radius: 8px; text-align: center; color: #c53030; margin: 20px 0; border: 1px solid #feb2b2;">
            ${userEmail}
          </div>
          <p style="font-size: 14px; color: #666; line-height: 1.5;">
            The system has enforced a 30s cooldown and will now show "Please try again later." <br/>
            <strong>No automatic account suspension</strong> has been applied. 
            Please review this account for suspicious behavior.
          </p>
        </div>
      `,
    });
    console.log(`[SUCCESS] Admin security email delivered to ${adminEmail}`);
  } catch (error: any) {
    console.error(`[SMTP CRITICAL FAILURE]`, error.message || error);
  }
};
