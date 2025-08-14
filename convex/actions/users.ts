"use node";
import { action } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import {
  getAuthUserId,
  createAccount,
  retrieveAccount,
} from "@convex-dev/auth/server";
import { api } from "../_generated/api";

export const adminCreateUser = action({
  args: {
    email: v.string(),
    firstname: v.string(),
    lastname: v.string(),
    password: v.string(),
    roleId: v.id("roles"),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new ConvexError("UNAUTHENTICATED");

    const me = await ctx.runQuery(api.queries.users.getUserWithRole, {});
    if (!me || me.role !== "admin") throw new ConvexError("FORBIDDEN");


    const { user } = await createAccount(ctx, {
      provider: "password",
      account: {
        id: args.email,
        secret: args.password,
      },
      profile: {
        email: args.email,
        name: args.firstname,
        lastname: args.lastname,
        roleId: args.roleId,
      } as any,
    });

    return { userId: user._id };
  },
});
