"use client"
import DocumentsTable from "../../../../../../components/documents-table";

const documentsData = [
  {
    title: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13").getTime(),
  },
  {
    title: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13").getTime(),
  },
  {
    title: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13").getTime(),
  },
  {
    title: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13").getTime(),
  },
  {
    title: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13").getTime(),
  },
  {
    title: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13").getTime(),
  },
  {
    title: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13").getTime(),
  },
  {
    title: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13").getTime(),
  },
  {
    title: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13").getTime(),
  },
  {
    title: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13").getTime(),
  },
  {
    title: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13").getTime(),
  },
];

type DocumentsTableProps = {
  globalFilter: string;
  dateSort: "asc" | "desc";
};

export default function SpaceDocumentsTable({
    globalFilter,
    dateSort
}: DocumentsTableProps
) {

  return (
    <section>
        <div className="overflow-x-auto">
            <DocumentsTable documents={documentsData}
            globalFilter={globalFilter}
            dateSort={dateSort}
            />
          </div>
          </section>
  )
}