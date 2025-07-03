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
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_clientBusinessId", (q) =>
        q.eq("clientBusinessId", clientBusinessId)
      )
      .collect();
    
      const enriched = await Promise.all(
        invoices.map(async (invoice) => {
          const campaign = await ctx.db.get(invoice.campaignId);
          return {
            ...invoice,
            campaignTitle: campaign?.title ?? "Campagne inconnue",
          };
        })
      );

    return enriched;

  },
});

export const readAgencyInvoices = query({
  args: {
    clientBusinessId: v.id("clientBusinesses"),
  },
  handler: async (ctx, { clientBusinessId }) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_clientBusinessId", (q) =>
        q.eq("clientBusinessId", clientBusinessId)
      )
      .collect();

    const agencyInvoices = invoices.filter((invoice) => !invoice.vendorName);

    const enriched = await Promise.all(
      agencyInvoices.map(async (invoice) => {
        const campaign = await ctx.db.get(invoice.campaignId);
        return {
          ...invoice,
          campaignTitle: campaign?.title ?? "Campagne inconnue",
        };
      })
    );

    return enriched;
  },
});

export const readVendorInvoices = query({
  args: {
    clientBusinessId: v.id("clientBusinesses"),
  },
  handler: async (ctx, { clientBusinessId }) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_clientBusinessId", (q) =>
        q.eq("clientBusinessId", clientBusinessId)
      )
      .collect();

    const vendorInvoices = invoices.filter((invoice) => invoice.vendorName);

    const enriched = await Promise.all(
      vendorInvoices.map(async (invoice) => {
        const campaign = await ctx.db.get(invoice.campaignId);
        return {
          ...invoice,
          campaignTitle: campaign?.title ?? "Campagne inconnue",
        };
      })
    );

    return enriched;
  },
});

export const readAgencyInvoicesByCampaign = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
      .collect();

      const agencyInvoices = invoices.filter((invoice) => !invoice.vendorName);

      return agencyInvoices;
  },
});

export const readVendorInvoicesByCampaign = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
      .collect();

      const vendorInvoices = invoices.filter((invoice) => invoice.vendorName);

      return vendorInvoices;
  },
});


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