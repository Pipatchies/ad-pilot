import { v } from "convex/values";
import { action } from "../_generated/server";
import nodemailer from "nodemailer";



export const sendEmail = action({
  args: {
    to: v.string(), 
    subject: v.string(),
    text: v.string(),
  },
  handler: async (_, args) => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true si port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Formulaire" <${process.env.SMTP_USER}>`,
      to: args.to,
      subject: args.subject,
      text: args.text,
    });

    return { success: true, messageId: info.messageId };
  },
});
