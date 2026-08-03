const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER || 'aniip5122003@gmail.com',
      pass: process.env.SMTP_PASS || 'jprycrvndimtmspf'
    }
  });
};

/**
 * Send email helper function
 * @param {Object} options - { to, subject, text, html }
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || 'For You <aniip5122003@gmail.com>',
      to: to || process.env.SMTP_USER || 'aniip5122003@gmail.com',
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Mailer] Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[Mailer Error] Failed to send email: ${error.message}`);
    // Non-blocking error handling
    return null;
  }
};

module.exports = sendEmail;
