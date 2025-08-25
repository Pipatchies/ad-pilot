import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createCampaign = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    mediaTypes: v.array(
      v.union(
        v.literal("Affichage"),
        v.literal("TV"),
        v.literal("Radio"),
        v.literal("Digital"),
        v.literal("Cinema"),
        v.literal("Presse")
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
    diffusions: v.array(
      v.object({
        mediaType: v.union(
          v.literal("Affichage"),
          v.literal("TV"),
          v.literal("Radio"),
          v.literal("Digital"),
          v.literal("Cinema"),
          v.literal("Presse")
        ),
        startDate: v.string(),
        endDate: v.string(),
      })
    ),
    digitalReportUrl: v.string(),
    report: v.object({
      status: v.union(v.literal("completed"), v.literal("archived")),
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
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const campaignId = await ctx.db.insert("campaigns", {
      ...args,
    });

    return campaignId;
  },
});
