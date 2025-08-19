import Typography from "@/components/typography";
import React from "react";
import SearchBar from "@/components/search-bar";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import ClientModal from "../components/client-modal";

type clientsHeaderProps = {
  onQueryChange: (q: string) => void;
};

export default function SpaceClientsHeader({
  onQueryChange,
}: clientsHeaderProps) {
      const adminAccounts = useQuery(api.queries.users.getAdmin) ?? [];
      const count = adminAccounts.length;
  return (
    <section><div className="flex flex-wrap items-center justify-between">
        <Typography variant="h1" className="mb-0">
          Clients
        </Typography>
        <ClientModal />
      </div>
      <p className="text-primary/80">{`${count} comptes`}</p>
      <div className="flex justify-end">
        <SearchBar variant="minimal" onQueryChange={onQueryChange} />
      </div>
      </section>
  )
}