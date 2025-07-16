import { internalQuery, query} from "../_generated/server";
import { v } from "convex/values";

export const getRoleById = internalQuery({
  args: {
    roleId: v.id("roles"),
  },
  handler: async (ctx, args) => {
    const role = await ctx.db.get(args.roleId);
    if (!role) {
      throw new Error("Role not found");
    }
    return role;
  },
});

export const getAllRoles = query({
  args: {},
  handler: async (ctx) => {
    const roles = await ctx.db.query("roles").collect();
    return roles;
  },
}); 