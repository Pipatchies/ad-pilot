import SearchBar from "@/components/search-bar";
import Typography from "@/components/typography";
import React from "react";

export default function Clients() {
  return (
    <section className="flex flex-col gap-10">
      <Typography variant="h1">Clients</Typography>
      <p>6 comptes</p>
      <div className="flex justify-end">
        <SearchBar variant="minimal" />
      </div>
    </section>
  );
}
