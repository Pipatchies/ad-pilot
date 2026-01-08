import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation } from '../_generated/server';
import { v, ConvexError } from 'convex/values';
import { internal } from '../_generated/api';

export const createDocument = mutation({
  args: {
    title: v.string(),
    type: v.union(
      v.literal('png'),
      v.literal('jpg'),
      v.literal('mp3'),
      v.literal('mp4'),
      v.literal('pdf'),
    ),
    url: v.string(),
    publicId: v.string(),
    resourceType: v.union(v.literal('image'), v.literal('video'), v.literal('raw')),
    campaignId: v.id('campaigns'),
    organizationId: v.id('organizations'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    return await ctx.db.insert('documents', { ...args });
  },
});

export const updateDocumentMetadata = mutation({
  args: {
    documentId: v.id('documents'),
    patch: v.object({
      title: v.optional(v.string()),
      type: v.optional(
        v.union(
          v.literal('png'),
          v.literal('jpg'),
          v.literal('mp3'),
          v.literal('mp4'),
          v.literal('pdf'),
        ),
      ),
      url: v.optional(v.string()),
      publicId: v.optional(v.string()),
      resourceType: v.optional(v.union(v.literal('image'), v.literal('video'), v.literal('raw'))),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError('UNAUTHENTICATED');

    const user = await ctx.db.get(userId);
    if (!user?.roleId) throw new ConvexError('FORBIDDEN');

    const role = await ctx.db.get(user.roleId);
    if (role?.name !== 'admin') throw new ConvexError('FORBIDDEN');

    return await ctx.db.patch(args.documentId, args.patch);
  },
});

export const deleteDocument = mutation({
  args: {
    documentId: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError('UNAUTHENTICATED');

    const user = await ctx.db.get(userId);
    if (!user?.roleId) throw new ConvexError('FORBIDDEN');

    const role = await ctx.db.get(user.roleId);
    if (role?.name !== 'admin') throw new ConvexError('FORBIDDEN');

    return await ctx.db.patch(args.documentId, { deleted: true });
  },
});

export const hardDeleteDocument = mutation({
  args: {
    documentId: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError('UNAUTHENTICATED');

    const user = await ctx.db.get(userId);
    if (!user?.roleId) throw new ConvexError('FORBIDDEN');

    const role = await ctx.db.get(user.roleId);
    if (role?.name !== 'admin') throw new ConvexError('FORBIDDEN');

    const document = await ctx.db.get(args.documentId);
    if (!document) throw new ConvexError('Document not found');

    await ctx.db.delete(args.documentId);

    if (document.publicId) {
      await ctx.scheduler.runAfter(0, internal.actions.cloudinary.destroyMedia, {
        publicId: document.publicId,
        resourceType: document.resourceType,
      });
    }
  },
});
