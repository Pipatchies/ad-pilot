"use client";
import React, { useState } from "react";
import SpaceAgencyInvoicesHeader from "./spaceAgencyInvoicesHeader";
import SpaceAgencyInvoicesTable from "./spaceAgencyInvoicesTable";

export default function SpaceAgencyInvoices() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateSort, setDateSort] = useState<"desc" | "asc">("desc");

  return (
    <section className="flex flex-col gap-2">
      <SpaceAgencyInvoicesHeader
        onQueryChange={setGlobalFilter}
        onDateSortChange={setDateSort}
        defaultDateSort="desc"
      />
      <SpaceAgencyInvoicesTable
        globalFilter={globalFilter}
        dateSort={dateSort}
      />
    </section>
  );
}