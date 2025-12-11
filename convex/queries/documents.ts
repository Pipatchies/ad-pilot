import { v } from "convex/values";
import { query } from "../_generated/server";

export const getDocumentsByCampaign = query({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, { campaignId }) => {
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
      .collect();
      return documents;
  },
});


