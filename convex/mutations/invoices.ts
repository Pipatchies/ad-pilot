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

