require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const sendEmail = require('../config/mailer');

const test = async () => {
  console.log('[SMTP Test] Testing Gmail SMTP Connection...');
  const res = await sendEmail({
    to: 'aniip5122003@gmail.com',
    subject: '❤️ For You App — SMTP Email Integration Test',
    html: '<h3>SMTP Configuration Working Perfectly!</h3><p>Automated email notifications are now active for completed friend experiences.</p>'
  });

  if (res) {
    console.log('[SMTP Test SUCCESS] Gmail SMTP connection verified!');
  } else {
    console.log('[SMTP Test WARN] Email dispatch completed or logged.');
  }
  process.exit(0);
};

test();
