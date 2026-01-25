import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
    }
}