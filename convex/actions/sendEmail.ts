"use node";
import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import nodemailer from "nodemailer";
import { formatDateFR } from "../../src/lib/utils";

export const sendEmail = internalAction({
  args: {
    title: v.optional(v.string()),
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
    url: v.optional(v.string()),
    brief: v.string(),
    clientName: v.optional(v.string()),
    recipients: v.array(v.string()),
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

Client : ${args.clientName || "Non spécifié"}
Titre : ${args.title || "Sans titre"}
Période : ${formatDateFR(args.periodFrom)} au ${formatDateFR(args.periodTo)}
Cible : ${args.target}
Territoire : ${args.territory}
Villes : ${args.cities}
Budget : ${args.budget}€
Objectifs : ${args.objectives.join(", ")}
Médias : ${args.mediaTypes.join(", ")}
TV types: ${args.tvTypes?.join(", ") || "N/A"}
Display types: ${args.displayTypes || "N/A"}
Radio types: ${args.radioTypes?.join(", ") || "N/A"}
URL : ${args.url || "N/A"}
Brief :
${args.brief}
      `;

    const mailOptions = {
      from: "no-reply@agenceverywell.fr",
      to: args.recipients,
      subject: "Nouveau brief client",
      text,
      attachments: args.url ? [{ path: args.url }] : [],
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  },
});

export const sendAccountCreatedEmail = internalAction({
  args: {
    to: v.string(),
    clientName: v.string(),
    appUrl: v.optional(v.string()),
  },
  handler: async (_, { to, clientName, appUrl }) => {
    const APP_URL = appUrl ?? process.env.APP_URL ?? "http://localhost:3000";
    const link = `${APP_URL}/resetPassword`;

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
      to,
      subject: `Votre compte ${clientName} est prêt – définissez votre mot de passe`,
      text: [
        "Bonjour,",
        "",
        `Votre compte pour ${clientName} a bien été créé.`,
        "Cliquez sur ce lien pour recevoir un code et définir votre mot de passe :",
        link,
        "",
        "Si vous n’êtes pas à l’origine de cette action, ignorez cet e-mail.",
      ].join("\n"),
      html: `
        <p>Bonjour,</p>
        <p>Votre compte pour <strong>${clientName}</strong> a bien été créé.</p>
        <p>Cliquez ici pour recevoir un code et définir votre mot de passe :</p>
      <p><a href="${link}">${link}</a></p>
        <p style="color:#666;font-size:12px;margin-top:16px">
          Si vous n’êtes pas à l’origine de cette action, ignorez cet e-mail.
        </p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId, link };
  },
});
