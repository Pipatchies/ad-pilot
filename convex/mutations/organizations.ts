// convex/organizations.ts
import { getAuthUserId } from "@convex-dev/auth/server";
import { internalMutation, mutation } from "../_generated/server";
import { v } from "convex/values";

export const createOrganization = internalMutation({
  args: {
    name: v.string(),
    logo: v.string(),
  },
  handler: async (ctx, args) => {
    const organizationId = await ctx.db.insert("organizations", {
      ...args,
    });
    return organizationId;
  },
});

export const updateOrganization = mutation({
  args: {
    organizationId: v.id("organizations"),
    patch: v.object({
      name: v.string(),
      logo: v.string(),
    }),
  },
  handler: async (ctx, { organizationId, patch }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.patch(organizationId, patch);
    return { ok: true };
  },
});

export const deleteOrganization = mutation({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.patch(organizationId, { deleted: true });
    return { ok: true };
  },
});
