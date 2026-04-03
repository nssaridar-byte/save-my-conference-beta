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
    console.log(`[SUCCESS] Verification code (${code}) sent to ${email}`);
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
export const sendWelcomeEmail = async (email: string, name: string) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Save My Conference <onboarding@savemyconference.com>',
      to: email,
      subject: 'Welcome to Save My Conference! 🎓',
      html: `
        <div style="font-family: 'Playfair Display', serif; padding: 40px; background-color: #050505; color: #ffffff; border-radius: 24px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255, 255, 255, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 32px; font-weight: 800; letter-spacing: -0.05em; margin: 0; color: #ffffff;">Save My Conference</h1>
            <p style="color: #888888; font-size: 14px; margin-top: 5px; text-transform: uppercase; letter-spacing: 0.2em;">The Intelligence Layer for MUN</p>
          </div>
          
          <h2 style="font-size: 24px; margin-bottom: 20px;">Welcome aboard, ${name}!</h2>
          <p style="color: #cccccc; line-height: 1.6; font-size: 16px;">
            Your mission access is now fully verified. You've just unlocked the most powerful toolset in Model UN history. 
          </p>
          
          <div style="margin: 30px 0; padding: 25px; background: rgba(255, 255, 255, 0.03); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05);">
            <h3 style="color: #ffffff; margin-top: 0; font-size: 18px;">What's Next?</h3>
            <ul style="color: #888888; padding-left: 20px; line-height: 1.8;">
              <li>Analyze speeches with real-time AI feedback</li>
              <li>Generate crisis simulations on the fly</li>
              <li>Manage your research in the central library</li>
              <li>Compete in the Quiz and Debate Arenas</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; padding: 16px 32px; background-color: #ffffff; color: #000000; text-decoration: none; border-radius: 100px; font-weight: 700; font-size: 16px;">Enter Command Center</a>
          </div>

          <p style="text-align: center; color: #555555; font-size: 12px; margin-top: 40px;">
            &copy; ${new Date().getFullYear()} Save My Conference. All rights reserved.
          </p>
        </div>
      `,
    });
    console.log(`[SUCCESS] Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send Welcome email:", error);
  }
};

export const sendNewDeviceLoginEmail = async (email: string, details: { ip: string, userAgent: string, time: string }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Save My Conference <security@savemyconference.com>',
      to: email,
      subject: 'Security Alert: New Login Detected',
      html: `
        <div style="font-family: sans-serif; padding: 30px; border: 1px solid #ffcc00; border-radius: 16px; max-width: 500px; margin: 0 auto; background-color: #fffdf0;">
          <h2 style="color: #856404; margin-top: 0;">New Device Login</h2>
          <p style="color: #333; font-size: 16px;">We detected a login to your Save My Conference account from an unrecognized device or browser.</p>
          
          <div style="margin: 20px 0; padding: 20px; background: #ffffff; border-radius: 12px; border: 1px solid #ffeeba; font-size: 14px; color: #666;">
            <p style="margin: 5px 0;"><strong>Time:</strong> ${details.time}</p>
            <p style="margin: 5px 0;"><strong>IP Address:</strong> ${details.ip}</p>
            <p style="margin: 5px 0;"><strong>Browser/Device:</strong> ${details.userAgent}</p>
          </div>

          <p style="font-size: 14px; color: #666; line-height: 1.5;">
            If this was you, you can safely ignore this email. We've added this device to your known list.
          </p>
          <p style="font-size: 14px; color: #c53030; font-weight: bold; margin-top: 20px;">
            If this was NOT you, please secure your account immediately by changing your password.
          </p>
        </div>
      `,
    });
    console.log(`[SECURITY] New device alert sent to ${email}`);
  } catch (error) {
    console.error("Failed to send Security Login email:", error);
  }
};
