"use client";
import React, { useState } from "react";
import SpaceCampaignsHeader from "./spaceCampaignsHeader";
import SpaceCampaignsActive from "./spaceCampaignsActive";
import SpaceCampaignsFinished from "./spaceCampaignsFinished";

export default function SpaceCampaigns() {
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <section className="flex flex-col gap-15">
      <SpaceCampaignsHeader
        onQueryChange={setGlobalFilter}
      />
      <SpaceCampaignsActive
        globalFilter={globalFilter}
      />
      <SpaceCampaignsFinished
        globalFilter={globalFilter}
      />
    </section>
  );
}
