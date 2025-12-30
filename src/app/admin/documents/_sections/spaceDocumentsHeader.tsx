"use client";

import DocsModal from "@/components/modal/docs-modal";
import SearchBar from "@/components/search-bar";
import Typography from "@/components/typography";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

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
  const documents = useQuery(api.queries.documents.getAllDocuments);
  const count = documents?.length ?? 0;
  return (
    <section>
      <div className="flex flex-wrap items-center justify-between">
      <Typography variant="h1" className="font-bold">
        Documents
      </Typography>
      <DocsModal/>
      </div>
      <p className="text-primary/80">
        {`${count} documents`}
      </p>
      <div className="flex justify-end mb-6">
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