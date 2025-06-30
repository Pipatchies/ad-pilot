import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(),
    name: v.string(),
    surname: v.string(),
    phone: v.optional(v.string()),
    role: v.array(v.string()),
  }),

  clientBusinesses: defineTable({
    name: v.string(),
    logo: v.string(),
    userId: v.id("users"),
    campaignId: v.id("campaigns"),
  }),

  briefs: defineTable({
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
  }),

  campaigns: defineTable({
    title: v.string(),
    subtitle: v.string(),
    mediaTypes: v.array(
      v.union(
        v.literal("tv"),
        v.literal("radio"),
        v.literal("digital"),
        v.literal("affichage")
      )
    ),
    startDate: v.string(),
    endDate: v.string(),
    totalBudget: v.number(),
    budgetMedia: v.array(
      v.object({
        type: v.union(
          v.literal("Affichage"),
          v.literal("TV"),
          v.literal("Radio"),
          v.literal("Digital")
        ),
        amount: v.number(),
        pourcent: v.union(v.number(), v.string()),
        startDate: v.optional(v.string()),
        title: v.optional(v.string()),
        details: v.optional(v.string()),
        color: v.string(),
      })
    ),
    status: v.array(
      v.object({
        id: v.number(),
        label: v.union(
          v.literal("Brief"),
          v.literal("Création"),
          v.literal("Validation"),
          v.literal("Diffusion en cours"),
          v.literal("Bilan")
        ),
        state: v.union(
          v.literal("completed"),
          v.literal("current"),
          v.literal("upcoming")
        ),
        deadline: v.string(),
      })
    ),
    digitalReportUrl: v.string(),
    report: v.object({
      status: v.union(
        v.literal("Terminé"),
        v.literal("En cours"),
        v.literal("En attente")
      ),
      document: v.optional(v.string()),
      kpi: v.array(
        v.object({
          icon: v.string(),
          title: v.string(),
          info: v.string(),
        })
      ),
    }),
    clientBusinessId: v.id("clientBusinesses"),
  }),

  medias: defineTable({
    title: v.string(),
    type: v.union(
      v.literal("PNG"),
      v.literal("JPG"),
      v.literal("MP3"),
      v.literal("MP4"),
      v.literal("PDF")
    ),
    url: v.string(),
    date: v.string(),
    campaignId: v.id("campaigns"),
  }),

  documents: defineTable({
    name: v.string(),
    type: v.string(),
    date: v.string(),
    url: v.string(),
    campaignId: v.id("campaigns"),
  }),

  invoices: defineTable({
    name: v.string(),
    agencyInvoice: v.optional(v.string()),
    vendorName: v.optional(v.string()),
    htprice: v.number(),
    ttcprice: v.number(),
    date: v.string(),
    dueDate: v.string(),
    url: v.string(),
    campaignId: v.id("campaigns"),
  }),

  vendors: defineTable({
    name: v.string(),
    userId: v.id("users"),
  }),

  targets: defineTable({
    title: v.string(),
    age: v.string(),
    subject: v.string(),
    slug: v.string(),
    survey: v.string(),
    zoom: v.string(),
    filter: v.string(),
    sector: v.string(),
    scale: v.string(),
    size: v.string(),
    card: v.array(
      v.object({
        legend: v.string(),
        percentage: v.number(),
        key: v.number(),
      })
    ),
  }),

  campaignTargets: defineTable({
  campaignId: v.id("campaigns"),
  targetId: v.id("targets"),
  fileUrl: v.optional(v.string()),
}),

});
