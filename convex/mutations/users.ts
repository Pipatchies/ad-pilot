import { getAuthUserId } from "@convex-dev/auth/server";
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
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) throw new Error("Unauthorized");

    if (patch.email) {
      const newEmail = patch.email;

      const accounts = await ctx.db
        .query("authAccounts")
        .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
        .collect();

      for (const acc of accounts) {
        if (acc.provider === "password" || acc.provider === "email") {
          if (acc.providerAccountId !== newEmail) {
            await ctx.db.patch(acc._id, { providerAccountId: newEmail });
          }
        }
      }
    }
    await ctx.db.patch(userId, patch);
    return { ok: true };
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) throw new Error("Unauthorized");

    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    for (const s of sessions) await ctx.db.delete(s._id);

    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect();
    for (const a of accounts) await ctx.db.delete(a._id);

    await ctx.db.delete(userId);
    return { ok: true };
  },
});

export const markLastConnection = mutation({
  args: {},
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return;

    const user = await ctx.db.get(authUserId);
    if (!user) return;

    await ctx.db.patch(user._id, { lastConnectionTime: Date.now() });
  },
});
