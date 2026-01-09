import { v } from 'convex/values';
import { query } from '../_generated/server';

export const getDocumentsByCampaign = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, { campaignId }) => {
    const documents = await ctx.db
      .query('documents')
      .withIndex('by_campaignId', (q) => q.eq('campaignId', campaignId))
      .filter((q) => q.neq(q.field('deleted'), true))
      .order('desc')
      .collect();
    return documents;
  },
});

export const getAllDocuments = query({
  handler: async (ctx) => {
    const documents = await ctx.db
      .query('documents')
      .filter((q) => q.neq(q.field('deleted'), true))
      .collect();

    const enriched = await Promise.all(
      documents.map(async (doc) => {
        const campaign = doc.campaignId ? await ctx.db.get(doc.campaignId) : null;
        const organization = doc.organizationId ? await ctx.db.get(doc.organizationId) : null;
        return {
          ...doc,
          campaignTitle: campaign?.title ?? 'Campagne inconnue',
          organizationName: organization?.name ?? 'Organisation inconnue',
        };
      }),
    );
    return enriched;
  },
});

export const getDocumentsByOrganization = query({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, { organizationId }) => {
    const documents = await ctx.db
      .query('documents')
      .withIndex('by_organizationId', (q) => q.eq('organizationId', organizationId))
      .filter((q) => q.neq(q.field('deleted'), true))
      .order('desc')
      .collect();

    const enriched = await Promise.all(
      documents.map(async (doc) => {
        const campaign = doc.campaignId ? await ctx.db.get(doc.campaignId) : null;
        return {
          ...doc,
          campaignTitle: campaign?.title ?? 'Campagne inconnue',
        };
      }),
    );
    return enriched;
  },
});
