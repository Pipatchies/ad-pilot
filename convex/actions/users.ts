'use node';
import { action } from '../_generated/server';
import { v, ConvexError } from 'convex/values';
import { getAuthUserId, createAccount } from '@convex-dev/auth/server';
import { api, internal } from '../_generated/api';
import { Id } from '../_generated/dataModel';
import crypto from 'node:crypto';

export const adminCreateAdmin = action({
  args: {
    email: v.string(),
    firstname: v.string(),
    lastname: v.string(),
    password: v.string(),
    roleId: v.id('roles'),
    organizationId: v.optional(v.id('organizations')),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.runQuery(internal.queries.users.getUserByEmail, {
      email: args.email,
    });
    if (existingUser) {
      throw new ConvexError({
        message: 'EMAIL_EXISTS',
        payload: 'Cet email est déjà utilisé par un autre utilisateur.',
      });
    }

    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new ConvexError('UNAUTHENTICATED');

    const me = await ctx.runQuery(api.queries.users.me, {});
    if (!me || me.role !== 'admin') throw new ConvexError('FORBIDDEN');

    const { user } = await createAccount(ctx, {
      provider: 'password',
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
    roleId: v.id('roles'),
    sendEmail: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.runQuery(internal.queries.users.getUserByEmail, {
      email: args.email,
    });
    if (existingUser) {
      throw new ConvexError({
        message: 'EMAIL_EXISTS',
        payload: 'Cet email est déjà utilisé par un autre utilisateur.',
      });
    }

    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new ConvexError('UNAUTHENTICATED');

    const me = await ctx.runQuery(api.queries.users.me, {});
    if (!me || me.role !== 'admin') throw new ConvexError('FORBIDDEN');

    const organizationId: Id<'organizations'> = await ctx.runMutation(
      internal.mutations.organizations.createOrganization,
      { name: args.organizationName, logo: args.logo },
    );

    const { user } = await createAccount(ctx, {
      provider: 'password',
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
        organizationName: args.organizationName,
        logo: args.logo,
      } as any,
    });
    const userId = user._id;

    if (args.sendEmail) {
      await ctx.runAction(internal.actions.sendEmail.sendAccountCreatedEmail, {
        to: args.email,
        clientName: args.organizationName,
      });
    }

    return { userId, organizationId };
  },
});

export const updateUserPassword = action({
  args: {
    userId: v.id('users'),
    password: v.string(),
  },
  handler: async (ctx, { userId, password }) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) throw new ConvexError('UNAUTHENTICATED');
    const salt = crypto.randomBytes(32).toString('hex');
    const key = crypto.scryptSync(password, salt, 64, {
      N: 16384,
      r: 16,
      p: 1,
      maxmem: 64 * 1024 * 1024, // 64 MB
    });
    const hashedPassword = `${salt}:${key.toString('hex')}`;

    await ctx.runMutation(internal.mutations.users.updateUserPasswordInternal, {
      userId,
      hashedPassword,
    });
  },
});
