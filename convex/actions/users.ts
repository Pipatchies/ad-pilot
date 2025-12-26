"use node";
import { action } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId, createAccount } from "@convex-dev/auth/server";
import { api, internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

export const adminCreateAdmin = action({
  args: {
    email: v.string(),
    firstname: v.string(),
    lastname: v.string(),
    password: v.string(),
    roleId: v.id("roles"),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.runQuery(
      internal.queries.users.getUserByEmail,
      {
        email: args.email,
      }
    );
    if (existingUser) {
      throw new ConvexError({
        message: "EMAIL_EXISTS",
        payload: "Cet email est déjà utilisé par un autre utilisateur.",
      });
    }
    
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new ConvexError("UNAUTHENTICATED");

    const me = await ctx.runQuery(api.queries.users.me, {});
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

export const adminCreateClient = action({
  args: {
    organizationName: v.string(),
    logo: v.string(),
    firstname: v.string(),
    lastname: v.string(),
    email: v.string(),
    password: v.string(),
    roleId: v.id("roles"),
    sendEmail: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.runQuery(
      internal.queries.users.getUserByEmail,
      {
        email: args.email,
      }
    );
    if (existingUser) {
      throw new ConvexError({
        message: "EMAIL_EXISTS",
        payload: "Cet email est déjà utilisé par un autre utilisateur.",
      });
    }

    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new ConvexError("UNAUTHENTICATED");

    const me = await ctx.runQuery(api.queries.users.me, {});
    if (!me || me.role !== "admin") throw new ConvexError("FORBIDDEN");

    const organizationId: Id<"organizations"> = await ctx.runMutation(
      internal.mutations.organizations.createOrganization,
      { name: args.organizationName, logo: args.logo }
    );

    let userId: string;
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
        organizationId,
      } as any,
    });
    userId = user._id;

    if (args.sendEmail) {
      await ctx.runAction(internal.actions.sendEmail.sendAccountCreatedEmail, {
        to: args.email,
        clientName: args.organizationName,
      });
    }

    return { userId, organizationId };
  },
});
