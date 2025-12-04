"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Typography from "@/components/typography";
import InvoiceModal from "@/components/invoices-modal";
import InvoicesTable from "@/components/invoices-table";
import { Invoice } from "@/types/invoices";

interface Props {
  formInvoices: Invoice[];
  setFormInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
}

export default function SpaceInvoices({
  formInvoices,
  setFormInvoices,
}: Props) {
  // Séparation agence / régie
  const agencyInvoices = formInvoices.filter(
    (i) => i.invoiceType === "agency"
  );

  const vendorInvoices = formInvoices.filter(
    (i) => i.invoiceType === "vendor"
  );

  return (
    <Card className="w-full rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
      
      {/* HEADER */}
      <CardHeader className="flex justify-between items-center">
        <Typography variant="h2" className="mb-0">
          Les factures
        </Typography>

        <InvoiceModal
          onAddInvoice={(invoice) =>
            setFormInvoices((prev) => [...prev, invoice])
          }
        />
      </CardHeader>

      <CardContent className="space-y-12">

        {/* ---------------- AGENCY INVOICES ---------------- */}
        <div>
          <Typography variant="h3" className="font-semibold mb-4">
            Factures agence
          </Typography>

          {agencyInvoices.length === 0 ? (
            <p className="text-primary/60 italic">
              Aucune facture agence pour le moment.
            </p>
          ) : (
            <InvoicesTable
              invoices={agencyInvoices}
              variant="agency"
              headerClassName="border-b border-solid border-[#A5A4BF]"
            />
          )}
        </div>

        {/* ---------------- VENDOR INVOICES ---------------- */}
        <div>
          <Typography variant="h3" className="font-semibold mb-4">
            Factures régie
          </Typography>

          {vendorInvoices.length === 0 ? (
            <p className="text-primary/60 italic">
              Aucune facture régie pour le moment.
            </p>
          ) : (
            <InvoicesTable
              invoices={vendorInvoices}
              variant="vendor"
              headerClassName="border-b border-solid border-[#A5A4BF]"
            />
          )}
        </div>

      </CardContent>
    </Card>
  );
}
