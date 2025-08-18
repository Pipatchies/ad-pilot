import { getAuthSessionId, getAuthUserId } from "@convex-dev/auth/server";
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

export const getAdmin = query({
  args:{},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    const adminAccounts = [];


    for (const user of users) {
      if (!user.roleId) continue;

      const role = await ctx.db.get(user.roleId);
      if (!role) continue;

      if (role.name === "admin") {
        const name = user.name ?? "";
        const lastname = user.lastname ?? "";
        const id =
          name.trim().toLowerCase() + (lastname.trim()[0]?.toLowerCase() ?? "");

        adminAccounts.push({
          userId: user._id,
          name,
          lastname,
          email: user.email ?? "",
          role: role.label,
          id
        });
      }
    }

    return adminAccounts;
  },
});


export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    const sessionId = await getAuthSessionId(ctx);
    return { user, sessionId };
  },
});

