import { query } from "../_generated/server";
import { v } from "convex/values";

export const getAllOrganizationsWithLastConnection = query({
  args: {},
  handler: async (ctx) => {
    const organizations = await ctx.db
      .query("organizations")
      .filter((q) => q.neq(q.field("deleted"), true))
      .collect();

    const users = await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("deleted"), true))
      .collect();

    const lastByOrganization = new Map<string, number | undefined>();
    for (const user of users) {
      const organizationId = user.organizationId;
      if (!organizationId) continue;
      const t = user.lastConnectionTime ?? 0;
      const prev = lastByOrganization.get(organizationId) ?? 0;
      if (t > prev) lastByOrganization.set(organizationId, t);
    }

    const organizationsWithStatus = await Promise.all(
      organizations.map(async (organization) => {
        const campaigns = await ctx.db
          .query("campaigns")
          .withIndex("by_organizationId", (q) =>
            q.eq("organizationId", organization._id)
          )
          .filter((q) => q.neq(q.field("deleted"), true))
          .collect();

        const hasActiveCampaign = campaigns.some((campaign) => {
          const endDate = new Date(campaign.endDate);
          const now = new Date();
          return endDate >= now;
        });

        return {
          organizationId: organization._id,
          organizationName: organization.name,
          logo: organization.logo ?? "",
          step: hasActiveCampaign ? "Campagne en cours" : "En veille",
          createdAt: organization._creationTime,
          lastConnectionTime: lastByOrganization.get(organization._id) ?? 0,
        };
      })
    );

    return organizationsWithStatus;
  },
});

export const getOrganizationDetails = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const organization = await ctx.db.get(args.organizationId);
    if (!organization) throw new Error("Organization not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => q.neq(q.field("deleted"), true))
      .first();

    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => q.neq(q.field("deleted"), true))
      .collect();

    const invoicesData = await ctx.db
      .query("invoices")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => q.neq(q.field("deleted"), true))
      .collect();

    const invoices = await Promise.all(
      invoicesData.map(async (invoice) => {
        let campaignName = "—";
        if (invoice.campaignId) {
          const campaign = await ctx.db.get(invoice.campaignId);
          if (campaign) {
            campaignName = campaign.title;
          }
        }
        return {
          ...invoice,
          campaign: campaignName,
        };
      })
    );

    return {
      organization,
      user,
      campaigns,
      invoices,
    };
  },
});
