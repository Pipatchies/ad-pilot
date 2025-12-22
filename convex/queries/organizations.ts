import { query } from "../_generated/server";

export const getAllOrganizationsWithLastConnection = query({
  args: {},
  handler: async (ctx) => {
    const organizations = await ctx.db.query("organizations").collect();

    const users = await ctx.db.query("users").collect();

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
