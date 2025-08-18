"use client";

import SearchBar from "@/components/search-bar";
import Typography from "@/components/typography";

type AccountsHeaderProps = {
  onQueryChange: (q: string) => void;
  onDateSortChange: (dir: "desc" | "asc") => void;
  defaultDateSort?: "desc" | "asc";
};

export default function SpaceVendorInvoicesHeader({
  onQueryChange,
  onDateSortChange,
  defaultDateSort = "desc",
}: AccountsHeaderProps) {
  return (
    <section>
      <Typography variant="h1" className="mb-6">
        Les factures
      </Typography>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Typography variant="h2" className="mb-0">
          Factures agence
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
