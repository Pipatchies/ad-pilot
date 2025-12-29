import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

export const createBrief = mutation({
  args: {
    title: v.optional(v.string()),
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
    url: v.optional(v.string()),
    brief: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const organization = user.organizationId
      ? await ctx.db.get(user.organizationId)
      : null;

    const briefId = await ctx.db.insert("briefs", {
      ...args,
      organizationId: user.organizationId,
    });

    const adminRole = await ctx.db
      .query("roles")
      .filter((q) => q.eq(q.field("name"), "admin"))
      .first();

    const admins = adminRole
      ? await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("roleId"), adminRole._id))
          .collect()
      : [];

    const recipients = Array.from(
      new Set(
        [user.email, ...admins.map((a) => a.email)].filter(
          (email): email is string => !!email
        )
      )
    );

    await ctx.scheduler.runAfter(0, internal.actions.sendEmail.sendEmail, {
      ...args,
      clientName: organization?.name,
      recipients,
    });

    return briefId;
  },
});
