"use client";
import React, { useState } from "react";
import SpaceVendorInvoicesHeader from "./spaceVendorInvoicesHeader";
import SpaceVendorInvoicesTable from "./spaceVendorInvoicesTable";

export default function SpaceVendorInvoices() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateSort, setDateSort] = useState<"desc" | "asc">("desc");

  return (
    <section className="flex flex-col gap-2">
      <SpaceVendorInvoicesHeader
        onQueryChange={setGlobalFilter}
        onDateSortChange={setDateSort}
        defaultDateSort="desc"
      />
      <SpaceVendorInvoicesTable
        globalFilter={globalFilter}
        dateSort={dateSort}
      />
    </section>
  );
}