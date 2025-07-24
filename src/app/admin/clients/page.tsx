import SearchBar from "@/components/search-bar";
import Typography from "@/components/typography";
import React from "react";
import ClientModal from "./_sections/clientModal";

export default function Clients() {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between">
        <Typography variant="h1" className="mb-0">
          Clients
        </Typography>
        <ClientModal />
      </div>
      <p className="text-primary/80">18 éléments</p>
      <div className="flex justify-end">
        <SearchBar variant="minimal" />
      </div>
    </section>
  );
}
