import SearchBar from "@/components/search-bar";
import Typography from "@/components/typography";
import React from "react";

export default function Clients() {
  return (
    <section className="flex flex-col gap-2">
      <Typography variant="h1" className="mb-0">Clients</Typography>
      <p className="text-primary/80">18 éléments</p>
      <div className="flex justify-end">
        <SearchBar variant="minimal" />
      </div>
    </section>
  );
}
