// convex/organizations.ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createOrganization = mutation({
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

