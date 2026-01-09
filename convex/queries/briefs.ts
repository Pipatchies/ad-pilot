import { getAuthUserId } from '@convex-dev/auth/server';
import { query } from '../_generated/server';

export const getBriefs = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    if (user.organizationId) {
      const briefs = await ctx.db
        .query('briefs')
        .withIndex('by_organizationId', (q) => q.eq('organizationId', user.organizationId))
        .filter((q) => q.neq(q.field('deleted'), true))
        .collect();
      return briefs;
    }

    return [];
  },
});

export const getMyBriefs = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db.get(userId);
    if (!user || !user.organizationId) return [];

    return await ctx.db
      .query('briefs')
      .withIndex('by_organizationId', (q) => q.eq('organizationId', user.organizationId))
      .filter((q) => q.neq(q.field('deleted'), true))
      .order('desc')
      .collect();
  },
});
