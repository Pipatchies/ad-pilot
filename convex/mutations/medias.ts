import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createMedia = mutation({
  args: {
    title: v.string(),
    mediaTypes:  v.array(
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
    variant: v.union(
      v.literal("portrait"),
      v.literal("landscape"),
      v.literal("default")
    ),
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("medias", { ...args });
  },
});
