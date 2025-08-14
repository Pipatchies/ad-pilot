"use client"
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import AdminAccountsTable from "../components/admin-accounts-table";

export default function SpaceAccountsTable() {
  const adminAccounts = useQuery(api.queries.users.getAdmin);

  if (!adminAccounts) {
    return <p>Chargement...</p>;
  }

  return (
    <section>
      <AdminAccountsTable adminAccounts={adminAccounts} />
    </section>
  );
}
