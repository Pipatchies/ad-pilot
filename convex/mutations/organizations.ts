// convex/organizations.ts
import { internalMutation, mutation } from "../_generated/server";
import { v } from "convex/values";

export const createOrganization = internalMutation({
  args: { 
    name: v.string(), 
    logo: v.string() },
  handler: async (ctx, args) => {
    const organizationId = await ctx.db.insert("organizations", { 
        ...args, 
    });
    return organizationId
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
    await ctx.db.patch(organizationId, patch);
    return { ok: true };
  },
});


export const deleteOrganization = mutation({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    await ctx.db.delete(organizationId);
    return { ok: true };
  },
});



