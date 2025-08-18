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

    return organizations.map((organization) => ({
      organizationId: organization._id,
      organizationName: organization.name,
      logo: organization.logo ?? "",
      step: organization.step ?? "-",
      createdAt: organization._creationTime,
      lastConnectionTime: lastByOrganization.get(organization._id) ?? 0,
    }));
  },
});
