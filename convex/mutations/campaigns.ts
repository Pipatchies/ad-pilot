import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createCampaign = mutation({
  args: {
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

export const archiveCampaign = mutation({
  args: {
    campaignId: v.id("campaigns"),
    archived: v.boolean(),
  },
  handler: async (ctx, { campaignId, archived }) => {
    await ctx.db.patch(campaignId, { archived });
  },
});

export const updateCampaign = mutation({
  args: {
    campaignId: v.id("campaigns"),
    patch: v.object({
    title: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    mediaTypes: v.optional(
      v.array(
        v.union(
          v.literal("ooh"),
          v.literal("tv"),
        v.literal("radio"),
        v.literal("digital"),
        v.literal("cinema"),
        v.literal("press")
      )
    )
  ),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    totalBudget: v.optional(v.number()),
    budgetMedia: v.optional(
      v.array(
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
        periodTo: v.optional(v.string()),
        title: v.optional(v.string()),
        details: v.optional(v.string()),
      })
    )
  ),
    status: v.optional(
      v.array(
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
    )
  ),
    archived: v.optional(v.boolean()),
    organizationId: v.optional(v.id("organizations")),
    }),
  },

  handler: async (ctx, { campaignId, patch }) => {
    await ctx.db.patch(campaignId, patch);
  },
});

export const duplicateCampaign = mutation({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, { campaignId }) => {

    const original = await ctx.db.get(campaignId);
    if (!original) throw new Error("Campaign not found");

    const { _id, _creationTime, archived, ...rest } = original;

    const duplicatedData = {
      ...rest,
      title: `${original.title} (copie)`,
      archived: false,
    };

    const newCampaignId = await ctx.db.insert("campaigns", duplicatedData);

    return { success: true, newCampaignId };
  },
});



export const deleteCampaign = mutation({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    await ctx.db.delete(campaignId);
  },
}); 



