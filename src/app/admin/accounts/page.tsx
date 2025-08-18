"use client";
import SearchBar from "@/components/search-bar";
import Typography from "@/components/typography";
import React, { useState } from "react";
import AccountModal from "./_sections/accountModal";
import SpaceAccountsTable from "./_sections/spaceAccountsTable";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function Accounts() {
  const adminAccounts = useQuery(api.queries.users.getAdmin);
  const count = adminAccounts?.length ?? 0;

  const [globalFilter, setGlobalFilter] = useState("");
  const [dateSort, setDateSort] = useState<"desc" | "asc">("desc");

  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between">
        <Typography variant="h1" className="mb-0">
          Comptes
        </Typography>
        <AccountModal />
      </div>
      <p className="text-primary/80">
        {adminAccounts ? `${count} comptes` : "Chargement..."}
      </p>
      <div className="flex justify-end">
        <SearchBar
          variant="minimal"
          onQueryChange={setGlobalFilter}
        />
      </div>
      <div>
        <SpaceAccountsTable
          globalFilter={globalFilter}
        />
      </div>
    </section>
  );
}
