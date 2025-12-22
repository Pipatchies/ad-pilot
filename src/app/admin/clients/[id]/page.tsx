"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { useParams } from "next/navigation";

export default function ClientDetailsPage() {
  const { id } = useParams();
  const data = useQuery(api.queries.organizations.getOrganizationDetails, {
    organizationId: id as Id<"organizations">,
  });

  if (!data) return <p className="p-10">Chargement...</p>;

  const { organization, user, campaigns } = data;

  const activeCampaigns = campaigns.filter((c) => {
    const endDate = new Date(c.endDate);
    const now = new Date();
    return endDate >= now;
  });

  const archivedCampaigns = campaigns.filter((c) => {
    const endDate = new Date(c.endDate);
    const now = new Date();
    return endDate < now;
  });

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-4xl font-bold">{organization.name}</h1>

      {/* Card Info User */}
      <section className="border p-4 rounded-md">
        <h2 className="text-xl font-bold mb-2">Info User</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </section>

      {/* Table Campagnes en cours */}
      <section className="border p-4 rounded-md">
        <h2 className="text-xl font-bold mb-2">Campagnes en cours</h2>
        <p>Table ici ({activeCampaigns.length})</p>
      </section>

      {/* Table Campagnes archivées */}
      <section className="border p-4 rounded-md">
        <h2 className="text-xl font-bold mb-2">Campagnes archivées</h2>
        <p>Table ici ({archivedCampaigns.length})</p>
      </section>
    </div>
  );
}
