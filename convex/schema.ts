import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { start } from "repl";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    lastname: v.optional(v.string()),
    roleId: v.optional(v.id("roles")),
    organizationId: v.optional(v.id("organizations")),
    lastConnectionTime: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("by_organizationId", ["organizationId"]),

  organizations: defineTable({
    name: v.string(),
    logo: v.string(),
    step: v.optional(v.string()),
  }),

  roles: defineTable({
    name: v.string(),
    label: v.string(),
    description: v.optional(v.string()),
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
        v.literal("ooh"),
        v.literal("tv"),
        v.literal("radio"),
        v.literal("digital"),
        v.literal("cinema"),
        v.literal("press")
      )
    ),
    startDate: v.string(),
    endDate: v.string(),
    totalBudget: v.number(),
    budgetMedia: v.array(
      v.object({
        type: v.union(
          v.literal("ooh"),
          v.literal("tv"),
          v.literal("radio"),
          v.literal("digital"),
          v.literal("cinema"),
          v.literal("press")
        ),
        amount: v.number(),
        pourcent: v.union(v.number(), v.string()),
        periodFrom: v.optional(v.string()),
        startDate: v.optional(v.string()),
        periodTo: v.optional(v.string()),
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
    diffusions: v.optional(
  v.array(
    v.object({
      mediaType: v.union(
        v.literal("ooh"),
        v.literal("tv"),
        v.literal("radio"),
        v.literal("digital"),
        v.literal("cinema"),
        v.literal("press")
      ),
      startDate: v.string(),
      endDate: v.string(),
    })
  )
),
    digitalReportUrl: v.optional(v.string()),
    report: v.optional(
      v.object({
        status: v.union(v.literal("completed"), v.literal("archived")),
        document: v.optional(v.string()),
        kpi: v.array(
          v.object({
            icon: v.string(),
            title: v.string(),
            info: v.string(),
          })
        ),
      })
    ),
    archived: v.boolean(),
    organizationId: v.id("organizations"),
  }).index("by_organizationId", ["organizationId"]),

  medias: defineTable({
    title: v.string(),
    mediaTypes: v.array(
      v.union(
        v.literal("ooh"),
        v.literal("tv"),
        v.literal("radio"),
        v.literal("digital"),
        v.literal("cinema"),
        v.literal("press")
      )
    ),
    type: v.union(
      v.literal("png"),
      v.literal("jpg"),
      v.literal("mp3"),
      v.literal("mp4"),
      v.literal("pdf")
    ),
    url: v.string(),
    publicId: v.string(),
    resourceType: v.union(
      v.literal("image"),
      v.literal("video"),
      v.literal("raw")
    ),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    campaignId: v.id("campaigns"),
  }).index("by_campaignId", ["campaignId"]),

  documents: defineTable({
    title: v.string(),
    type: v.union(
      v.literal("png"),
      v.literal("jpg"),
      v.literal("mp3"),
      v.literal("mp4"),
      v.literal("pdf")
    ),
    url: v.string(),
    publicId: v.string(),
    resourceType: v.union(
      v.literal("image"),
      v.literal("video"),
      v.literal("raw")
    ),
    campaignId: v.id("campaigns"),
    organizationId: v.id("organizations"),
  }),

  invoices: defineTable({
    title: v.string(),
    invoiceType: v.union(v.literal("agency"), v.literal("vendor")),
    agencyInvoice: v.optional(v.string()),
    vendorName: v.optional(v.string()),
    htprice: v.number(),
    ttcprice: v.number(),
    startDate: v.string(),
    dueDate: v.string(),
    url: v.string(),
    publicId: v.string(),
    resourceType: v.union(
      v.literal("raw")
    ),
    campaignId: v.id("campaigns"),
    organizationId: v.id("organizations"),
  })
    .index("by_organizationId", ["organizationId"])
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
