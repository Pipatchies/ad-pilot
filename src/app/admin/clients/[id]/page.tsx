"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { useParams } from "next/navigation";
import UserCard from "./components/user-card";
import SpaceCampaignsActiveTable from "./_sections/spaceCampaignsActiveTable";
import SpaceCampaignsArchivedTable from "./_sections/spaceCampaignsArchivedTable";
import SpaceOrgnizationDetailsHeader from "./_sections/spaceOrgnizationDetailsHeader";


export default function ClientDetailsPage() {
  const { id } = useParams();
  const data = useQuery(api.queries.organizations.getOrganizationDetails, {
    organizationId: id as Id<"organizations">,
  });

  if (!data) return <p className="p-10">Chargement...</p>;

  const { organization, user, campaigns } = data;

  return (
   <section className="p-10">
      <SpaceOrgnizationDetailsHeader organization={organization} />
      {/* Card Info User */}
      <div className="space-y-8">
        <UserCard user={user} />
      

      {/* Table Campagnes en cours */}
      <SpaceCampaignsActiveTable campaigns={campaigns} />

      {/* Table Campagnes archivées */}
      <SpaceCampaignsArchivedTable campaigns={campaigns} />
      </div>
    </section>
  );
}
