"use client";
import React, { useState } from "react";
import SpaceDocumentsTable from "./spaceDocumentsTable";
import SpaceDocumentsHeader from "./spaceDocumentsHeader";

export default function SpaceDocuments() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateSort, setDateSort] = useState<"desc" | "asc">("desc");

  return (
    <section className="flex flex-col gap-2">
      <SpaceDocumentsHeader
        onQueryChange={setGlobalFilter}
        onDateSortChange={setDateSort}
        defaultDateSort="desc"
      />
      <SpaceDocumentsTable globalFilter={globalFilter} dateSort={dateSort} />
    </section>
  );
}
