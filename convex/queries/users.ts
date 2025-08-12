import { getAuthUserId } from "@convex-dev/auth/server";
import { internalQuery } from "../_generated/server";
import { query } from "../_generated/server";
import { v } from "convex/values";

export const getUserById = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
});

export const getUserWithRole = query({
  args: {},
  handler: async (ctx, _args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;    

    const user = await ctx.db.get(userId);
    if (!user) return null;

    const role = user.roleId ? await ctx.db.get(user.roleId) : null;

    return {
      ...user,
      role: role?.name ?? "unknown",
    };
  },
});
