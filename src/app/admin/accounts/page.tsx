"use client";
import React, { useState } from "react";
import SpaceAccountsTable from "./_sections/spaceAccountsTable";
import SpaceAccountsHeader from "./_sections/spaceAccountsHeader";

export default function Accounts() {

  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <section className="flex flex-col gap-2">
      <SpaceAccountsHeader />
      <div>
        <SpaceAccountsTable
          globalFilter={globalFilter}
        />
      </div>
    </section>
  );
}
