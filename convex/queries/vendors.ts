import { query } from '../_generated/server';

export const getVendors = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('vendors').collect();
  },
});
