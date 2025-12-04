"use client";

import { DataTable, sortableHeader } from "@/components/table/data-table";
import SvgEyeIcon from "@/components/icons/EyeIcon";
import SvgUploder from "@/components/icons/Uploder";
import { ColumnDef } from "@tanstack/react-table";
import { Document } from "@/types/docs"; 

interface DocumentsTableProps {
  documents: Document[];
  globalFilter?: string;
  headerClassName?: string;
}

export default function DocumentsTable({
  documents,
  globalFilter,
  headerClassName,
}: DocumentsTableProps) {

  const columns: ColumnDef<Document>[] = [
    {
      accessorKey: "title",
      header: sortableHeader("Titre du document"),
      cell: ({ row }) => row.getValue("title"),
    },
    {
      accessorKey: "type",
      header: sortableHeader("Type de fichier"),
      cell: ({ row }) => row.getValue("type"),
    },
    {
      accessorKey: "_creationTime",
      header: sortableHeader("Date d'import"),
      cell: ({ row }) => {
        const ts = row.getValue("_creationTime") as number | undefined;
        return ts ? new Date(ts).toLocaleDateString("fr-FR") : "-";
      },
    },
    {
      id: "actions",
      header: "",
      cell: () => (
        <div className="flex justify-end gap-4">
          <SvgEyeIcon />
          <SvgUploder />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={documents}
      columns={columns}
      globalFilter={globalFilter}
      emptyMessage="Aucun document pour le moment."
      headerClassName={headerClassName}
      defaultSort={{ id: "_creationTime", desc: true }}
    />
  );
}
