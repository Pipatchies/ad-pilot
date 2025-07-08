"use node";
import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import nodemailer from "nodemailer";

export const sendEmail = internalAction({
  args: {
    periodFrom: v.string(),
    periodTo: v.string(),
    target: v.string(),
    territory: v.string(),
    cities: v.string(),
    budget: v.number(),
    objectives: v.array(v.string()),
    mediaTypes: v.array(v.string()),
    tvTypes: v.optional(v.array(v.string())),
    displayTypes: v.optional(v.string()),
    radioTypes: v.optional(v.array(v.string())),
    brief: v.string(),
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

    const text = `
Un nouveau brief a été soumis :

Période : ${args.periodFrom} au ${args.periodTo}
Cible : ${args.target}
Territoire : ${args.territory}
Villes : ${args.cities}
Budget : ${args.budget}€
Objectifs : ${args.objectives.join(", ")}
Médias : ${args.mediaTypes.join(", ")}
TV types: ${args.tvTypes?.join(", ") || "N/A"}
Display types: ${args.displayTypes || "N/A"}
Radio types: ${args.radioTypes?.join(", ") || "N/A"}
Brief :
${args.brief}
      `;

    const mailOptions = {
      from: "no-reply@agenceverywell.fr",
      to: "arianeb@verywell.fr",
      subject: "Nouveau brief client",
      text
    };

      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
  },
});
