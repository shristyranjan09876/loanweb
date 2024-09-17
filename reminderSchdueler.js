const cron = require('node-cron');
const Loan = require('../models/Loan');
const Employee = require('../models/Employee');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Function to send email notification
const sendReminderEmail = async (email, loanId, dueDate) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Upcoming Loan Payment Reminder',
        text: `This is a reminder that your loan with ID: ${loanId} is due on ${dueDate.toDateString()}. Please make sure to make the payment on time.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reminder email sent successfully to:', email);
    } catch (error) {
        console.error('Error sending reminder email:', error);
    }
};

// Schedule job to run daily at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled task for loan reminders');

    try {
        // Find loans with due dates in the next 2 days
        const now = new Date();
        const twoDaysLater = new Date();
        twoDaysLater.setDate(now.getDate() + 2);

        const loansDueSoon = await Loan.find({
            'repaymentSchedule.dueDate': {
                $gte: now,
                $lt: twoDaysLater
            },
            status: 'approved'
        }).populate('employee');

        for (const loan of loansDueSoon) {
            const employee = loan.employee;
            if (employee) {
                const user = await User.findById(employee.user);
                if (user && user.email) {
                    await sendReminderEmail(user.email, loan._id, loan.repaymentSchedule.find(entry => new Date(entry.dueDate).toDateString() === twoDaysLater.toDateString()).dueDate);
                }
            }
        }

    } catch (error) {
        console.error('Error running reminder scheduler:', error);
    }
});
