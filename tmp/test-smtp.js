const nodemailer = require('nodemailer');
require('dotenv').config();

async function testMail() {
  console.log("Starting SMTP Test...");
  console.log("User:", process.env.SMTP_USER);
  // Don't log full password, just presence
  console.log("Pass present:", !!process.env.SMTP_PASS);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    debug: true,
    logger: true
  });

  try {
    await transporter.verify();
    console.log("SMTP Connection Verified [Step 1 Success]");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: "ns.saridar@gmail.com",
      subject: "SMTP Diagnostic Test",
      text: "If you receive this, SMTP is working correctly."
    });

    console.log("Message sent: %s", info.messageId);
    console.log("SMTP Test Completed [Step 2 Success]");
  } catch (error) {
    console.error("SMTP Test Failed:", error);
  }
}

testMail();
