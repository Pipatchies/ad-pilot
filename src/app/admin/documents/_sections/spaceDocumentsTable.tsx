"use client";
import React from "react";
import DocumentsTable from "@/components/table/documents-table";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

type DocumentsTableProps = {
  globalFilter: string;
  dateSort: "asc" | "desc";
};

export default function SpaceDocumentsTable({
  globalFilter,
  dateSort,
}: DocumentsTableProps) {
  
  const documents = useQuery(api.queries.documents.getAllDocuments);

  const documentsData = documents?.map((doc) => ({
    ...doc,
  })) ?? [];

  return (
    <section>
      <div className="overflow-x-auto">
        <DocumentsTable
          documents={documentsData}
          globalFilter={globalFilter}
          showCampaign={true}
          showClient={true}
          readOnly={false}
        />
      </div>
    </section>
  );
}
