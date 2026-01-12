import "dotenv/config";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).send("API is working");
    }

    const { name, phone, email, message } = req.body;

    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error("Missing email environment variables");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
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
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
