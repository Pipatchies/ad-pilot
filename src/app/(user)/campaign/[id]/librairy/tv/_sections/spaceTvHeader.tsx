import SearchBar from "@/components/search-bar";
import Typography from "@/components/typography";
import React from "react";

type SpaceTvHeaderProps = {
  onQueryChange: (q: string) => void;
  onDateSortChange: (dir: "asc" | "desc") => void;
  defaultDateSort?: "asc" | "desc";
};

export default function SpaceTvHeader({
  onQueryChange,
  onDateSortChange,
  defaultDateSort = "desc",
}: SpaceTvHeaderProps) {
  return (
    <section>
      <Typography variant="h1">Titre de la campagne</Typography>
      <Typography variant="h1" className="font-bold">
        La bibliothèque de médias
      </Typography>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Typography variant="h2" className="mb-0 font-[800] text-[28px]">
          Visuels Affiches
        </Typography>
        <SearchBar
          variant="full"
          onQueryChange={onQueryChange}
          onDateSortChange={onDateSortChange}
          defaultDateSort={defaultDateSort}
        />
      </div>
    </section>
  );
}
