import { v } from "convex/values";
import { query } from "../_generated/server";

export const getAllCampaigns = query({
  handler: async (ctx) => {
    return await ctx.db.query("campaigns").collect();
  },
});

export const getCampaignsByOrganization = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, { organizationId }) => {
    return await ctx.db
      .query("campaigns")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organizationId)
      )
      .collect();
  },
});

export const getCampaignById = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    const campaign = await ctx.db.get(campaignId);
    return campaign;
  },
});


export const getActiveCampaigns = query({
  handler: async (ctx) => {
    const now = new Date().toISOString();

    const campaigns = await ctx.db
      .query("campaigns")
      .filter((q) =>
        q.and(
          q.eq(q.field("archived"), false),
          q.gte(q.field("endDate"), now)
        )
      )
      .collect();

    // Enrichissement avec le nom du client
    return Promise.all(
      campaigns.map(async (c) => {
        const org = await ctx.db.get(c.organizationId);

        return {
          ...c,
          organizationName: org?.name ?? "—",
        };
      })
    );
  },
});

// export const getFinishedCampaigns = query({
//   handler: async (ctx) => {
//     const now = new Date().toISOString();

//     const campaigns = await ctx.db
//       .query("campaigns")
//       .filter((q) =>
//         q.and(
//           q.eq(q.field("archived"), false),
//           q.lt(q.field("endDate"), now)
//         )
//       )
//       .collect();

//     // Enrichissement avec le nom du client
//     return Promise.all(
//       campaigns.map(async (c) => {
//         const org = await ctx.db.get(c.organizationId);

//         return {
//           ...c,
//           organizationName: org?.name ?? "—",
//         };
//       })
//     );
//   },
// });


export const getArchivedCampaigns = query({
  handler: async (ctx) => {
    const campaigns = await ctx.db
      .query("campaigns")
      .filter((q) => q.eq(q.field("archived"), true))
      .collect();

    return Promise.all(
      campaigns.map(async (c) => {
        const org = await ctx.db.get(c.organizationId);

        return {
          ...c,
          organizationName: org?.name ?? "—",
        };
      })
    );
  },
});

