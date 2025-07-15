import { internalQuery} from "../_generated/server";
import { v } from "convex/values";

export const getById = internalQuery({
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
