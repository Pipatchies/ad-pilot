"use client"
import Typography from "@/components/typography";
import React, { useState } from "react";
import AccountModal from "../components/accountModal";
import SearchBar from "@/components/search-bar";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export default function SpaceAccountsHeader() {
  const adminAccounts = useQuery(api.queries.users.getAdmin);
  const count = adminAccounts?.length ?? 0;

  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <section>
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
        <SearchBar variant="minimal" onQueryChange={setGlobalFilter} />
      </div>
    </section>
  );
}
