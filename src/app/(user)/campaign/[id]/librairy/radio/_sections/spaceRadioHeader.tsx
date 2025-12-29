import React from "react";
import Typography from "@/components/typography";
import SearchBar from "@/components/search-bar";

interface SpaceRadioHeaderProps {
  onQueryChange: (query: string) => void;
  onDateSortChange: (sort: "asc" | "desc") => void;
  defaultDateSort?: "asc" | "desc";
}

export default function SpaceRadioHeader({
  onQueryChange,
  onDateSortChange,
  defaultDateSort = "desc",
}: SpaceRadioHeaderProps) {
  return (
    <div className="flex flex-col gap-6 mb-10">
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h1" className="mb-0">
            Visuels Radio
          </Typography>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            variant="full"
            onQueryChange={onQueryChange}
            onDateSortChange={onDateSortChange}
            defaultDateSort={defaultDateSort}
          />
        </div>
      </div>
    </div>
  );
}
