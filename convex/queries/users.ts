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

export const readDetailsCampaign = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    const campaign = await ctx.db.get(campaignId);
    return campaign;
  },
});

export const readInvoices = query({
  args: {
    clientBusinessId: v.id("clientBusinesses"),
  },
  handler: async (ctx, { clientBusinessId }) => {
    return await ctx.db
      .query("invoices")
      .withIndex("by_clientBusinessId", (q) =>
        q.eq("clientBusinessId", clientBusinessId)
      )
      .collect();
  },
});

export const readInvoicesByCampaign = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    return await ctx.db
      .query("invoices")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
      .collect();
  },
});
