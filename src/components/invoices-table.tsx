import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SvgEyeIcon from "./icons/EyeIcon";
import SvgUploder from "./icons/Uploder";

type Invoice = {
  name: string;
  agencyInvoice?: string;
  regieName?: string;
  campagne?: string;
  htprice: number;
  ttcprice: number;
  date: Date;
  dueDate: Date;
};

interface InvoiceTableProps {
  invoices: Invoice[];
  variant: "agency" | "regie";
  showCampaign?: boolean;
}

export default function InvoicesTable({
  invoices,
  variant,
  showCampaign,
}: InvoiceTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow className="border-none">
            <TableHead className="w-[100px] text-base font-bold text-primary">
              N°de facture
            </TableHead>
            {variant === "regie" && (
              <TableHead className="text-base font-bold text-primary">
                Facture agence rattachée
              </TableHead>
            )}
            {variant === "regie" && (
              <TableHead className="text-base font-bold text-primary px-10">
                Régie
              </TableHead>
            )}
            {showCampaign && (
              <TableHead className="text-base font-bold text-primary">
                Campagne
              </TableHead>
            )}
            <TableHead className="text-base font-bold text-primary">
              Montant HT
            </TableHead>
            <TableHead className="text-base font-bold text-primary px-5">
              Montant TTC
            </TableHead>
            <TableHead className="text-base font-bold text-primary">
              Date de facturation
            </TableHead>
            <TableHead className="text-base font-bold text-primary">
              Date d'échéance
            </TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, index) => (
            <TableRow className="text-lg h-15 border-[#A5A4BF]" key={index}>
              <TableCell className="pr-20">{invoice.name}</TableCell>
              {variant === "regie" && (
                <TableCell>{invoice.agencyInvoice}</TableCell>
              )}
              {variant === "regie" && (
                <TableCell className="px-10 font-bold underline">
                  {invoice.regieName}
                </TableCell>
              )}
              {showCampaign && (
                <TableCell className="font-bold underline pr-10">
                  {invoice.campagne}
                </TableCell>
              )}
              <TableCell>{invoice.htprice.toLocaleString("fr-FR")} €</TableCell>
              <TableCell className="px-5">
                {invoice.ttcprice.toLocaleString("fr-FR")} €
              </TableCell>
              <TableCell>{invoice.date.toLocaleDateString()}</TableCell>
              <TableCell>{invoice.dueDate.toLocaleDateString()}</TableCell>
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
