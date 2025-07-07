"use node";
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
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });


    const mailOptions = {
      from: "no-reply@agenceverywell.fr",
      to: args.to,
      subject: args.subject,
      text: args.text,
    };

      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
  },
});
