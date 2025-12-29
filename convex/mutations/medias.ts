import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { internal } from "../_generated/api";

export const createMedia = mutation({
  args: {
    title: v.string(),
    mediaTypes: v.array(
      v.union(
        v.literal("ooh"),
        v.literal("tv"),
        v.literal("radio"),
        v.literal("digital"),
        v.literal("cinema"),
        v.literal("press")
      )
    ),
    type: v.union(
      v.literal("png"),
      v.literal("jpg"),
      v.literal("mp3"),
      v.literal("mp4"),
      v.literal("pdf")
    ),
    url: v.string(),
    publicId: v.string(),
    resourceType: v.union(
      v.literal("image"),
      v.literal("video"),
      v.literal("raw")
    ),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    return await ctx.db.insert("medias", { ...args });
  },
});

export const updateMediaMetadata = mutation({
  args: {
    mediaId: v.id("medias"),
    patch: v.object({
      title: v.optional(v.string()),
      mediaTypes: v.optional(
        v.array(
          v.union(
            v.literal("ooh"),
            v.literal("tv"),
            v.literal("radio"),
            v.literal("digital"),
            v.literal("cinema"),
            v.literal("press")
          )
        )
      ),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("UNAUTHENTICATED");

    const user = await ctx.db.get(userId);
    if (!user?.roleId) throw new ConvexError("FORBIDDEN");

    const role = await ctx.db.get(user.roleId);
    if (role?.name !== "admin") throw new ConvexError("FORBIDDEN");

    return await ctx.db.patch(args.mediaId, args.patch);
  },
});

export const deleteMedia = mutation({
  args: {
    mediaId: v.id("medias"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("UNAUTHENTICATED");

    const user = await ctx.db.get(userId);
    if (!user?.roleId) throw new ConvexError("FORBIDDEN");

    const role = await ctx.db.get(user.roleId);
    if (role?.name !== "admin") throw new ConvexError("FORBIDDEN");

    return await ctx.db.patch(args.mediaId, { deleted: true });
  },
});

export const hardDeleteMedia = mutation({
  args: {
    mediaId: v.id("medias"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("UNAUTHENTICATED");

    const user = await ctx.db.get(userId);
    if (!user?.roleId) throw new ConvexError("FORBIDDEN");

    const role = await ctx.db.get(user.roleId);
    if (role?.name !== "admin") throw new ConvexError("FORBIDDEN");

    const media = await ctx.db.get(args.mediaId);
    if (!media) throw new ConvexError("Media not found");

    await ctx.db.delete(args.mediaId);

    if (media.publicId) {
      await ctx.scheduler.runAfter(
        0,
        internal.actions.cloudinary.destroyMedia,
        {
          publicId: media.publicId,
          resourceType: media.resourceType,
        }
      );
    }
  },
});
