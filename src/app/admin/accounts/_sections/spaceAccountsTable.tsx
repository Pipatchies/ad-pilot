"use client"
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import AdminAccountsTable from "@/components/table/admin-accounts-table";

type Props = {
  globalFilter: string;
};

export default function SpaceAccountsTable({
  globalFilter,
}: Props) {
  const adminAccounts = useQuery(api.queries.users.getAllUsersWithRole);

  if (!adminAccounts) {
    return <p>Chargement...</p>;
  }

  return (
    <section>
      <AdminAccountsTable adminAccounts={adminAccounts}
      globalFilter={globalFilter}
 />
    </section>
  );
}
