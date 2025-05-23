const nodemailer = require('nodemailer');
const cron = require('node-cron');

let cronTask = null;
let isCronRunning = false;
const logs = [];

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection
transporter.verify((error) => {
  if (error) {
    const logMessage = `[${new Date().toISOString()}] SMTP connection error: ${error.message}`;
    logs.push(logMessage);
    console.error(logMessage);
  } else {
    const logMessage = `[${new Date().toISOString()}] SMTP server ready`;
    logs.push(logMessage);
    console.log(logMessage);
  }
});

// Function to send email
async function sendEmail() {
  try {
    const mailOptions = {
      from: `"Cron Test" <${process.env.EMAIL_USER}>`,
      to: 'receivermail@gmail.com',
      subject: 'Cron Test',
      text: 'Cron Test , this is automatic mail.',
      html: '',
    };

    const info = await transporter.sendMail(mailOptions);
    const logMessage = `[${new Date().toISOString()}] Email sent successfully: ${info.messageId}`;
    logs.push(logMessage);
    console.log(logMessage);
  } catch (error) {
    const logMessage = `[${new Date().toISOString()}] Error sending email: ${error.message}`;
    logs.push(logMessage);
    console.error(logMessage);
  }
}

// Start cron job
function startCron() {
  if (!isCronRunning) {
    setTimeout(() => {
      cronTask = cron.schedule('* * * * *', async () => {
        await sendEmail();
      });
      isCronRunning = true;
      const logMessage = `[${new Date().toISOString()}] Cron job started`;
      logs.push(logMessage);
      console.log(logMessage);
    }, 5000); 
  }
}


// Stop cron job
function stopCron() {
  if (isCronRunning && cronTask) {
    cronTask.stop();
    isCronRunning = false;
    const logMessage = `[${new Date().toISOString()}] Cron job stopped`;
    logs.push(logMessage);
    console.log(logMessage);
  }
}

module.exports = {
  startCron,
  stopCron,
  getStatus: () => isCronRunning,
  getLogs: () => logs,
};