import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SvgEyeIcon from "@/components/icons/EyeIcon";
import SvgUploder from "@/components/icons/Uploder";

type Documents = {
  title: string;
  type: string;
  date: Date;
};

interface DocumentsTableProps {
  documents: Documents[];
}

export default function DocumentsTable({ documents }: DocumentsTableProps) {
    return (
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="text-base font-bold text-primary">Titre du document</TableHead>
              <TableHead className="text-base font-bold text-primary">Type de fichier</TableHead>
              <TableHead className="text-base font-bold text-primary">Date d'import</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((documents, index) => (
              <TableRow className="text-lg h-15 border-[#A5A4BF]" key={index}>
                <TableCell className="pr-10">{documents.title}</TableCell>
                <TableCell>{documents.type}</TableCell>
                <TableCell>{documents.date.toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-4">
                    <SvgEyeIcon />
                    <SvgUploder />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  

