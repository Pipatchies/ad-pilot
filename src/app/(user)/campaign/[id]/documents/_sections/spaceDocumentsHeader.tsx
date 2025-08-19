"use client";

import SearchBar from "@/components/search-bar";
import Typography from "@/components/typography";

type DocumentsHeaderProps = {
  onQueryChange: (q: string) => void;
  onDateSortChange: (dir: "desc" | "asc") => void;
  defaultDateSort?: "desc" | "asc";
};

export default function SpaceDocumentsHeader({
  onQueryChange,
  onDateSortChange,
  defaultDateSort = "desc",
}: DocumentsHeaderProps) {
  return (
    <section>
      <Typography variant="h1">Titre de la campagne</Typography>
      <Typography variant="h1" className="font-bold">
        Les documents
      </Typography>
      <div className="flex flex-col justify-end sm:flex-row sm:items-center gap-4 mb-6">
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