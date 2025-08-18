"use client";
import React, { useState } from "react";
import SpaceClientsHeader from "./spaceClientsHeader";
import SpaceClientsTable from "./spaceClientsTable";

export default function SpaceAccounts() {
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <section className="flex flex-col gap-2">
      <SpaceClientsHeader
        onQueryChange={setGlobalFilter}
      />
      <SpaceClientsTable
        globalFilter={globalFilter}
      />
    </section>
  );
}