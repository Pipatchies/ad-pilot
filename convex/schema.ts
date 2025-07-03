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
    clientBusinessId: v.id("clientBusinesses"),
  }),

  clientBusinesses: defineTable({
    name: v.string(),
    logo: v.string(),
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
        v.literal("affichage"),
        v.literal("cinema"),
        v.literal("presse")
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
          v.literal("Digital"),
          v.literal("Cinema"),
          v.literal("Presse")
        ),
        amount: v.number(),
        pourcent: v.union(v.number(), v.string()),
        startDate: v.optional(v.string()),
        title: v.optional(v.string()),
        details: v.optional(v.string()),
      })
    ),
    status: v.array(
      v.object({
        id: v.number(),
        label: v.string(),
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
    archived: v.boolean(),
    clientBusinessId: v.id("clientBusinesses"),
  }).index("by_clientBusinessId", ["clientBusinessId"]),

  medias: defineTable({
    title: v.string(),
    mediaTypes: v.array(
      v.union(
        v.literal("tv"),
        v.literal("web"),
        v.literal("affiches"),
        v.literal("panneaux"),
      )
    ),
    type: v.union(
      v.literal("PNG"),
      v.literal("JPG"),
      v.literal("MP3"),
      v.literal("MP4"),
      v.literal("PDF")
    ),
    url: v.string(),
    variant: v.union(
      v.literal("portrait"),
      v.literal("landscape"),
      v.literal("default")
    ),
    campaignId: v.id("campaigns"),
  }).index("by_campaignId", ["campaignId"]),

  documents: defineTable({
    title: v.string(),
    type: v.string(),
    date: v.string(),
    url: v.string(),
    campaignId: v.id("campaigns"),
  }),

  invoices: defineTable({
    title: v.string(),
    type: v.string(),
    agencyInvoice: v.optional(v.string()),
    vendorName: v.optional(v.string()),
    htprice: v.number(),
    ttcprice: v.number(),
    date: v.string(),
    dueDate: v.string(),
    url: v.optional(v.string()),
    campaignId: v.id("campaigns"),
    clientBusinessId: v.id("clientBusinesses"),
  })
    .index("by_clientBusinessId", ["clientBusinessId"])
    .index("by_campaignId", ["campaignId"]),

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
