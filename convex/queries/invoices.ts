import { v } from "convex/values";
import { query } from "../_generated/server";

export const getAllInvoices = query({
  handler: async (ctx) => {
    const invoices = await ctx.db
      .query("invoices")
      .filter((q) => q.neq(q.field("deleted"), true))
      .collect();
    return invoices;
  },
});

export const getAllAgencyInvoices = query({
  handler: async (ctx) => {
    const invoices = await ctx.db
      .query("invoices")
      .filter((q) => q.neq(q.field("deleted"), true))
      .collect();

    const agencyInvoices = invoices.filter((invoice) => !invoice.vendorName);

    const enriched = await Promise.all(
      agencyInvoices.map(async (invoice) => {
        const campaign = await ctx.db.get(invoice.campaignId);
        const organization = await ctx.db.get(invoice.organizationId);
        return {
          ...invoice,
          campaignTitle: campaign?.title ?? "Campagne inconnue",
          organizationName: organization?.name ?? "Organisation inconnue",
        };
      })
    );

    return enriched;
  },
});

export const getAllVendorInvoices = query({
  handler: async (ctx) => {
    const invoices = await ctx.db
      .query("invoices")
      .filter((q) => q.neq(q.field("deleted"), true))
      .collect();
    
    const vendorInvoices = invoices.filter((invoice) => invoice.vendorName);

    const enriched = await Promise.all(
      vendorInvoices.map(async (invoice) => {
        const campaign = await ctx.db.get(invoice.campaignId);
        const organization = await ctx.db.get(invoice.organizationId);
        return {
          ...invoice,
          campaignTitle: campaign?.title ?? "Campagne inconnue",
          organizationName: organization?.name ?? "Organisation inconnue",
        };
      })
    );

    return enriched;
  },
});

export const getInvoicesByOrganization = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, { organizationId }) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organizationId)
      )
      .filter((q) => q.neq(q.field("deleted"), true))
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

export const getAgencyInvoicesByOrganization = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, { organizationId }) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organizationId)
      )
      .filter((q) => q.neq(q.field("deleted"), true))
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

export const getVendorInvoicesByOrganization = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, { organizationId }) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organizationId)
      )
      .filter((q) => q.neq(q.field("deleted"), true))
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

export const getInvoicesByCampaign = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
      .filter((q) => q.neq(q.field("deleted"), true))
      .order("desc")
      .collect();
    return invoices;
  },
});

export const getAgencyInvoicesByCampaign = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
      .filter((q) => q.neq(q.field("deleted"), true))
      .order("desc")
      .collect();

    const agencyInvoices = invoices.filter((invoice) => !invoice.vendorName);

    return agencyInvoices;
  },
});

export const getVendorInvoicesByCampaign = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
      .filter((q) => q.neq(q.field("deleted"), true))
      .order("desc")
      .collect();

    const vendorInvoices = invoices.filter((invoice) => invoice.vendorName);

    return vendorInvoices;
  },
});
