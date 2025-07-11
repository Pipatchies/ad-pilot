import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const createUser = internalMutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    firstname: v.string(),
    lastname: v.string(),
    phone: v.optional(v.string()),
    roleId: v.id("roles"),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      ...args,
    });

    return userId;
  },
});