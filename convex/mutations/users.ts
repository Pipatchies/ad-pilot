import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    password: v.string(),
    firstname: v.string(),
    lastname: v.string(),
    phone: v.optional(v.string()),
    roleId: v.id("roles"),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      ...args,
    });

    return userId;
  },
});