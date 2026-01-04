import { mutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "../_generated/api";

export const createInvoice = mutation({
  args: {
    title: v.string(),
    invoiceType: v.union(v.literal("agency"), v.literal("vendor")),
    agencyInvoice: v.optional(v.string()),
    vendorName: v.optional(v.string()), // Deprecated
    vendorId: v.optional(v.id("vendors")),
    htprice: v.number(),
    ttcprice: v.number(),
    startDate: v.string(),
    dueDate: v.string(),
    url: v.string(),
    publicId: v.string(),
    resourceType: v.union(v.literal("raw")),
    campaignId: v.id("campaigns"),
    organizationId: v.id("organizations"),
    status: v.optional(v.union(v.literal("paid"), v.literal("pending"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("UNAUTHENTICATED");

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
      invoiceType: v.optional(
        v.union(v.literal("agency"), v.literal("vendor"))
      ),
      agencyInvoice: v.optional(v.string()),
      vendorName: v.optional(v.string()), // Deprecated
      vendorId: v.optional(v.id("vendors")),
      url: v.optional(v.string()),
      publicId: v.optional(v.string()),
      resourceType: v.optional(v.literal("raw")),
      status: v.optional(v.union(v.literal("paid"), v.literal("pending"))),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("UNAUTHENTICATED");

    const user = await ctx.db.get(userId);
    if (!user?.roleId) throw new ConvexError("FORBIDDEN");

    const role = await ctx.db.get(user.roleId);
    if (role?.name !== "admin") throw new ConvexError("FORBIDDEN");

    return await ctx.db.patch(args.invoiceId, args.patch);
  },
});

export const deleteInvoice = mutation({
  args: {
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("UNAUTHENTICATED");

    const user = await ctx.db.get(userId);
    if (!user?.roleId) throw new ConvexError("FORBIDDEN");

    const role = await ctx.db.get(user.roleId);
    if (role?.name !== "admin") throw new ConvexError("FORBIDDEN");

    return await ctx.db.patch(args.invoiceId, { deleted: true });
  },
});

export const hardDeleteInvoice = mutation({
  args: {
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("UNAUTHENTICATED");

    const user = await ctx.db.get(userId);
    if (!user?.roleId) throw new ConvexError("FORBIDDEN");

    const role = await ctx.db.get(user.roleId);
    if (role?.name !== "admin") throw new ConvexError("FORBIDDEN");

    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) throw new ConvexError("Invoice not found");

    await ctx.db.delete(args.invoiceId);

    if (invoice.publicId) {
      await ctx.scheduler.runAfter(
        0,
        internal.actions.cloudinary.destroyMedia,
        {
          publicId: invoice.publicId,
          resourceType: invoice.resourceType,
        }
      );
    }
  },
});
