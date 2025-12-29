import { v } from "convex/values";
import { query } from "../_generated/server";

export const getMediaFilesByCampaign = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    const medias = await ctx.db
      .query("medias")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
      .filter((q) => q.neq(q.field("deleted"), true))
      .order("desc")
      .collect();

    return medias;
  },
});
