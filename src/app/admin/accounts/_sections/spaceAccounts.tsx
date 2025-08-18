"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import SpaceAccountsHeader from "./spaceAccountsHeader";
import SpaceAccountsTable from "./spaceAccountsTable";

export default function SpaceAccountsClient() {
  const [globalFilter, setGlobalFilter] = useState("");
  const adminAccounts = useQuery(api.queries.users.getAdmin) ?? [];
  const count = adminAccounts.length;

  return (
    <section className="flex flex-col gap-2">
      <SpaceAccountsHeader
        count={count}
        isLoading={adminAccounts === undefined}
        onQueryChange={setGlobalFilter}
        variant="minimal"
      />
      <SpaceAccountsTable
        adminAccounts={adminAccounts}
        globalFilter={globalFilter}
      />
    </section>
  );
}
