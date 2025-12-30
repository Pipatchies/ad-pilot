import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

export const createQuote = mutation({
  args: {
    medias: v.array(
      v.object({
        type: v.string(),
        regie: v.string(),
        format: v.string(),
        quantity: v.string(),
        period: v.object({
          from: v.optional(v.string()),
          to: v.optional(v.string()),
        }),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const organization = user.organizationId
      ? await ctx.db.get(user.organizationId)
      : null;

    const quoteId = await ctx.db.insert("quote", {
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

    await ctx.scheduler.runAfter(
      0,
      internal.actions.sendEmail.sendQuoteEmail,
      {
        medias: args.medias,
        clientName: organization?.name,
        recipients,
      }
    );

    return quoteId;
  },
});
