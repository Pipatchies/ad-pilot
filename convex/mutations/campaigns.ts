import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, internalMutation } from "../_generated/server";
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
    tvTypes: v.optional(v.array(v.string())),
    radioTypes: v.optional(v.array(v.string())),
    displayTypes: v.optional(v.string()),
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
    digitalAnalysis: v.optional(
      v.object({
        url: v.string(),
        publicId: v.optional(v.string()),
        resourceType: v.optional(v.string()),
        name: v.string(),
      })
    ),
    archived: v.boolean(),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

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
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

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
      tvTypes: v.optional(v.array(v.string())),
      radioTypes: v.optional(v.array(v.string())),
      displayTypes: v.optional(v.string()),

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

      report: v.optional(
        v.object({
          status: v.optional(
            v.union(v.literal("current"), v.literal("archived"))
          ),
          document: v.optional(v.string()),
          kpi: v.optional(
            v.array(
              v.object({
                icon: v.string(),
                title: v.string(),
                info: v.string(),
              })
            )
          ),
        })
      ),

      archived: v.optional(v.boolean()),
      organizationId: v.optional(v.id("organizations")),
      digitalAnalysis: v.optional(
        v.object({
          url: v.string(),
          publicId: v.optional(v.string()),
          resourceType: v.optional(v.string()),
          name: v.string(),
        })
      ),
    }),
  },

  handler: async (ctx, { campaignId, patch }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.patch(campaignId, patch);
  },
});

export const duplicateCampaign = mutation({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, { campaignId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const original = await ctx.db.get(campaignId);
    if (!original) throw new Error("Campaign not found");

    const { _id, _creationTime, archived: _archived, ...rest } = original;

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
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.patch(campaignId, { deleted: true });
  },
});

export const autoArchiveCampaigns = internalMutation({
  handler: async (ctx) => {
    const now = new Date().toISOString();

    const campaignsToArchive = await ctx.db
      .query("campaigns")
      .filter((q) =>
        q.and(q.eq(q.field("archived"), false), q.lt(q.field("endDate"), now))
      )
      .collect();

    for (const campaign of campaignsToArchive) {
      await ctx.db.patch(campaign._id, { archived: true });
    }

    console.log(`Archived ${campaignsToArchive.length} campaigns.`);
  },
});
