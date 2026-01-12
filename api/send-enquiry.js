import nodemailer from "nodemailer";
import "dotenv/config";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, phone, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER, // owner's email
      pass: process.env.MAIL_PASS  // app password
    }
  });

  await transporter.sendMail({
    from: `"Website Enquiry" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_USER,
    subject: "New Enquiry from Website",
    text: `
Name: ${name}
Phone: ${phone}
Email: ${email}
Message: ${message}
`
  });

  res.status(200).json({ success: true });
}
