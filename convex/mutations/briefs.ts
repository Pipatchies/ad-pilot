import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createBrief = mutation({
  args: {
    periodFrom: v.string(),
    periodTo: v.string(),
    target: v.string(),
    territory: v.string(),
    cities: v.string(),
    budget: v.number(),
    objectives: v.array(v.string()),
    mediaTypes: v.array(v.string()),
    tvTypes: v.optional(v.array(v.string())),
    displayTypes: v.optional(v.string()),
    radioTypes: v.optional(v.array(v.string())),
    brief: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("briefs", {
      ...args,
    });
  },
});

