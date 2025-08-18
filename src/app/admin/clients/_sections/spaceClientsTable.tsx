"use client"
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import ClientAccountsTable from "../components/client-accounts-table";


type Props = {
  globalFilter: string;
};

export default function SpaceAccountsTable({
  globalFilter,
}: Props) {
  const clientAccounts = useQuery(api.queries.organizations.getAllOrganizationsWithLastConnection);

  if (!clientAccounts) {
    return <p>Chargement...</p>;
  }

  return (
    <section>
      <ClientAccountsTable clientAccounts={clientAccounts}
      globalFilter={globalFilter}
 />
    </section>
  );
}