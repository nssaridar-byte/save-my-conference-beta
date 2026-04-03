const nodemailer = require('nodemailer');
require('dotenv').config();

async function testMail() {
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
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: "ns.saridar@gmail.com",
      subject: "App Deliverability Test",
      text: "Testing if the FROM address is causing issues."
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("SMTP Test Failed:", error);
  }
}

testMail();
