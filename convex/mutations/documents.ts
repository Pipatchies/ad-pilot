import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createDocument = mutation({
  args: {
    title: v.string(),
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
    campaignId: v.id("campaigns"),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    return await ctx.db.insert("documents", { ...args });
  },
});
