import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    patch: v.object({
      name: v.optional(v.string()),
      lastname: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      image: v.optional(v.string()),
      roleId: v.optional(v.id("roles")),
      organizationId: v.optional(v.id("organizations")),
    }),
  },
  handler: async (ctx, { userId, patch }) => {
    await ctx.db.patch(userId, patch);
    return { ok: true };
  },
});


export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await ctx.db.delete(userId);
    return { ok: true };
  },
});

