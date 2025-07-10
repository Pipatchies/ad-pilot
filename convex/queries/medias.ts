import { v } from "convex/values";
import { query } from "../_generated/server";

export const readMediaFiles = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    const medias = await ctx.db
      .query("medias")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
      .collect();

      return medias;
  },
});

