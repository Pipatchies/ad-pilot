import { internalMutation } from "./_generated/server";

export const main = internalMutation({
  args: {},
  handler: async (ctx) => {

    const orgId = await ctx.db.insert("organizations", {
      name: "VeryWell Digital",
      logo: "https://placehold.co/400",
      step: "onboarding",
    });

    console.log(`✅ Organization created: ${orgId}`);

      const campaignId = await ctx.db.insert("campaigns", {
      title: "Campagne Été 2026",
      subtitle: "Lancement nouvelle gamme",
      status: [
        { id: 1, label: "Brief", state: "completed", deadline: "2026-06-01" },
        {
          id: 2,
          label: "Production",
          state: "current",
          deadline: "2026-06-15",
        },
        {
          id: 3,
          label: "Diffusion",
          state: "upcoming",
          deadline: "2026-07-01",
        },
      ],
      startDate: "2026-07-01",
      endDate: "2026-08-31",
      totalBudget: 50000,
      budgetMedia: [
        {
          type: "digital",
          amount: 30000,
          pourcent: 60,
          details: "Social Ads + Google",
        },
        { type: "tv", amount: 20000, pourcent: 40, details: "Spot 30s TF1" },
      ],
      mediaTypes: ["digital", "tv"],
      organizationId: orgId,
      archived: false,
    });

    console.log(`✅ Campaign created: ${campaignId}`);

    const vendorId = await ctx.db.insert("vendors", {
      name: "Agence Média Corp",
      email: "contact@mediacorp.com",
      contactName: "Jean Dupont",
    });

    await ctx.db.insert("invoices", {
      title: "Facture Acompte TV",
      invoiceType: "vendor",
      vendorId: vendorId,
      htprice: 10000,
      ttcprice: 12000,
      startDate: "2026-06-01",
      dueDate: "2026-07-01",
      url: "https://placehold.co/600x400/EEE/31343C.png?text=FACTURE+PDF",
      publicId: "invoice_123",
      resourceType: "raw",
      campaignId: campaignId,
      organizationId: orgId,
      status: "pending",
    });

    console.log("✅ Seeding completed!");
  },
});
