import { v } from "convex/values";
import { query } from "../_generated/server";

export const readInvoices = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, { organizationId }) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organizationId)
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
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, { organizationId }) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organizationId)
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
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, { organizationId }) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organizationId)
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