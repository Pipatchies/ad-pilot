import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createInvoice = mutation({
  args: {
    title: v.string(),
    invoiceType: v.union(v.literal("agency"), v.literal("vendor")),
    agencyInvoice: v.optional(v.string()),
    vendorName: v.optional(v.string()),
    htprice: v.number(),
    ttcprice: v.number(),
    startDate: v.string(),
    dueDate: v.string(),
    url: v.string(),
    publicId: v.string(),
    resourceType: v.union(
      v.literal("raw")
    ),
    campaignId: v.id("campaigns"),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("invoices", { ...args });
  },
});

export const updateInvoice = mutation({
  args: {
    invoiceId: v.id("invoices"),
    patch: v.object({
      title: v.optional(v.string()),
      htprice: v.optional(v.number()),
      ttcprice: v.optional(v.number()),
      startDate: v.optional(v.string()),
      dueDate: v.optional(v.string()),
      invoiceType: v.optional(v.union(v.literal("agency"), v.literal("vendor"))),
      agencyInvoice: v.optional(v.string()),
      vendorName: v.optional(v.string()),
      url: v.optional(v.string()),
      publicId: v.optional(v.string()),
      resourceType: v.optional(v.literal("raw")),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.invoiceId, args.patch);
  },
});

export const deleteInvoice = mutation({
  args: {
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.invoiceId);
  },
});
