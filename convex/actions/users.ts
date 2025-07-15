"use node";
import { action } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

export const createUserWithClerk = action({
  args: {
    email: v.string(),
    password: v.string(),
    firstname: v.string(),
    lastname: v.string(),
    phone: v.optional(v.string()),
    roleId: v.id("roles"),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const role = await ctx.runQuery(internal.queries.roles.getRoleById, {
      roleId: args.roleId,
    });

    const response = await fetch("https://api.clerk.com/v1/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: [args.email],
        password: args.password,
        first_name: args.firstname,
        last_name: args.lastname,
        phone_number: args.phone,
        public_metadata: {
          role: role.name, //
        },
      }),
    });

    const clerkUser = await response.json();

    if (!response.ok) {
      throw new Error(`Clerk error: ${clerkUser.errors?.[0]?.message}`);
    }

    const userId: Id<"users"> = await ctx.runMutation(
      internal.mutations.users.createUser,
      {
        clerkUserId: clerkUser.id,
        email: args.email,
        firstname: args.firstname,
        lastname: args.lastname,
        phone: args.phone,
        roleId: args.roleId,
        organizationId: args.organizationId,
      }
    );

    return userId;
  },
});

export const updateUserInClerk = action({
  args: {
    userId: v.id("users"), // Convex ID
    firstname: v.optional(v.string()),
    lastname: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.queries.users.getById, {
      userId: args.userId,
    });

    if (!user || !user.clerkUserId) {
      throw new Error("User not found or missing Clerk ID");
    }

    const updatePayload: Record<string, any> = {};
    if (args.firstname) updatePayload.first_name = args.firstname;
    if (args.lastname) updatePayload.last_name = args.lastname;
    if (args.email) updatePayload.email_address = [args.email];
    if (args.phone) updatePayload.phone_number = args.phone;

    const response = await fetch(
      `https://api.clerk.com/v1/users/${user.clerkUserId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Clerk update error: ${error.errors?.[0]?.message}`);
    }

    return { success: true };
  },
});

