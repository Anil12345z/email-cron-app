# email-cron-app

A Next.js application that allows users to schedule and send emails every minute using NodeMailer and node-cron. The app features a responsive UI where users can toggle the cron job (start/stop) and view real-time logs of email-sending attempts, with a modern design styled using plain CSS.
Features

Schedule Emails: Sends emails every minute to a specified recipient using a cron job.
Toggle Cron Job: Start or stop the cron job with a single click via a user-friendly interface.
Real-Time Logs: Displays logs of email-sending attempts (success in green, errors in red) in a scrollable list.
Responsive Design: Optimized for mobile, tablet, and desktop devices with a clean, modern UI.
Error Handling: Displays API errors in the UI for easier debugging (e.g., failed API calls or SMTP issues).

Tech Stack

Next.js: React framework for building the frontend and API routes.
NodeMailer: Sends emails via Gmail SMTP.
node-cron: Schedules email sending every minute.
Plain CSS: Custom styles for a responsive and modern UI.
Environment Variables: Uses dotenv for managing sensitive SMTP credentials.

Prerequisites
Before setting up the project, ensure you have the following:

Node.js: Version 16 or higher (tested with Node.js 18).
Gmail Account: Required for sending emails via Gmail SMTP.
If 2FA is enabled, generate an App Password (Google Account > Security > 2-Step Verification > App Passwords).


Git: To clone the repository.

Setup
Follow these steps to set up the project locally:

Clone the Repository:
git clone https://github.com/your-username/email-cron-app.git
cd email-cron-app


Install Dependencies:
npm install


Set Up Environment Variables:

Create a .env.local file in the project root:touch .env.local


Add your Gmail SMTP credentials:EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password


Replace your-email@gmail.com with your Gmail address.
Replace your-app-password with your Gmail App Password (or regular password if 2FA is disabled, though App Password is recommended).


Update Recipient Email (Optional):

Open utils/emailCron.js and update the to field in the mailOptions object:to: 'your-recipient@example.com',


The default recipient is example@gmail.com.com, which you can keep if it’s your test email.



Running the App

Start the Development Server:
npm run dev

This starts the app on http://localhost:3000.

Open the App:

Open your browser and navigate to http://localhost:3000.



Usage

Start the Cron Job:
Click the "Start Cron" button to begin sending emails every minute.
The status will change to "Running" (green), and logs will show "Cron job started".


Stop the Cron Job:
Click the "Stop Cron" button to stop sending emails.
The status will change to "Stopped" (red), and logs will show "Cron job stopped".


View Logs:
Logs are displayed in a scrollable list below the button.
Success messages (e.g., "Email sent successfully") are in green.
Error messages (e.g., "Error sending email") are in red.


Error Handling:
If an API call fails (e.g., 404 error), the error will appear in a red box above the status.



UI Overview
The UI is designed to be clean, modern, and responsive:

Desktop View:
Centered container (800px wide) with a white background and subtle shadow.
Blue heading ("Email Cron Scheduler").
Status text (e.g., "Status: Running" in green).
Blue button with hover animation.
Scrollable logs with success (green) and error (red) messages.


Mobile View:
Full-width container with adjusted padding.
Vertically stacked layout for better readability.
Full-width button for easier interaction.



File Structure
email-cron-app/
├── pages/
│   ├── api/
│   │   ├── logs.js            # API route to fetch logs
│   │   └── cron/
│   │       └── [action].js    # API route to start/stop/status the cron job
│   ├── _app.js                # Custom App component to load global CSS
│   └── index.js               # Main page with the UI
├── styles/
│   └── global.css             # Plain CSS for responsive styling
├── utils/
│   └── emailCron.js           # Logic for cron job and email sending
├── .env.local                 # Environment variables (SMTP credentials)
├── .gitignore                 # Ignore files for Git
├── jsconfig.json              # JavaScript configuration for absolute imports
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies and scripts
├── README.md                  # Project documentation

Troubleshooting

UI Looks Unstyled:
Ensure styles/global.css exists and is correctly imported in pages/_app.js.
Clear the Next.js cache:rm -rf .next
npm run dev


Open the app in an incognito window to avoid browser caching issues.


"Start Cron" Not Working (404 Error):
Check the file structure: Ensure pages/api/cron/[action].js exists (lowercase cron, [action].js with brackets).
Verify the terminal for errors (e.g., Cannot find module '../../../utils/emailCron').
Clear the Next.js cache (see above).
Test the API endpoint directly:curl -X POST http://localhost:3000/api/cron/start

Expected response: {"message":"Cron job started","isRunning":true}.


Emails Not Sending:
Check the logs in the UI for errors (e.g., "Error sending email: Invalid login").
Verify your Gmail credentials in .env.local.
Ensure you’re using an App Password if 2FA is enabled.
Check Gmail’s sending limits (~100–500 emails/day). If exceeded, you’ll see errors like "Daily sending limit exceeded".


Logs Not Updating:
Ensure /api/logs is working:curl http://localhost:3000/api/logs

Expected: {"logs":["[2025-05-23T11:53:00.000Z] SMTP server ready", ...]}.
Verify the polling interval in pages/index.js (logs update every 5 seconds when the cron job is running).



Notes for Developers

Logs Storage: Logs are stored in memory (utils/emailCron.js). For production, consider using a database (e.g., MongoDB) to persist logs.
Email Service: Gmail has sending limits (~100–500 emails/day). For production, use a transactional email service like SendGrid or AWS SES.
Time Zone: The app uses the server’s time zone (default IST in this case, as developed in India). Set process.env.TZ for a specific time zone:export TZ='UTC'
npm run dev


Scalability: The app sends emails every minute (* * * * *). Adjust the cron schedule in utils/emailCron.js for different intervals (e.g., every hour: 0 * * * *).
Security: Ensure .env.local is not committed to Git (already included in .gitignore).

Contributing
Contributions are welcome! To contribute:



