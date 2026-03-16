const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSMTP() {
  console.log('--- SMTP Diagnostic Tool ---');
  
  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  console.log('Configuration Check:');
  console.log('- User:', config.auth.user);
  console.log('- Host:', config.host);
  console.log('- Port:', config.port);
  console.log('- Password set:', !!config.auth.pass);

  if (!config.auth.user || config.auth.user === 'your-email@gmail.com') {
    console.error('\nERROR: You are still using placeholders. Please update your .env file with real credentials.');
    return;
  }

  const transporter = nodemailer.createTransport(config);

  console.log('\nTesting connection...');
  try {
    await transporter.verify();
    console.log('✅ Connection successful!');

    const mailOptions = {
      from: process.env.EMAIL_FROM || config.auth.user,
      to: 'savemyconference@gmail.com',
      subject: 'SMTP Test: Save My Conference',
      text: 'If you receive this, your internal mail system is working perfectly!',
    };

    console.log('Sending test email to savemyconference@gmail.com...');
    await transporter.sendMail(mailOptions);
    console.log('✅ Test email SENT! Please check your inbox (and SPAM folder).');
  } catch (error) {
    console.error('\n❌ SMTP FAILURE:');
    console.log(error.message);
    if (error.message.includes('Invalid login')) {
      console.log('\nTIP: If using Gmail, make sure you use an "App Password" and NOT your regular login password.');
    }
  }
}

testSMTP();
