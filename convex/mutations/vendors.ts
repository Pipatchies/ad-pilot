import { v } from 'convex/values';
import { mutation } from '../_generated/server';

export const createVendor = mutation({
  args: {
    name: v.string(),
    contactName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    const vendorId = await ctx.db.insert('vendors', {
      name: args.name,
      contactName: args.contactName,
      email: args.email,
      phone: args.phone,
      userId: args.userId,
    });
    return vendorId;
  },
});

export const updateVendor = mutation({
  args: {
    id: v.id('vendors'),
    name: v.string(),
    contactName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});
