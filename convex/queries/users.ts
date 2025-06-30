import { query } from "../_generated/server";
import { v } from "convex/values";

export const readCampaigns = query({
  args: {
    clientBusinessId: v.id("clientBusinesses"),
  },
  handler: async (ctx, { clientBusinessId }) => {
    return await ctx.db
      .query("campaigns")
      .withIndex("by_clientBusinessId", (q) =>
        q.eq("clientBusinessId", clientBusinessId)
      )
      .collect();
  },
});
