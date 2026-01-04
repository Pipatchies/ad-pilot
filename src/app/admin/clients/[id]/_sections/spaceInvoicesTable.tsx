import SearchBar from "@/components/search-bar";
import InvoicesTable from "@/components/table/invoices-table";
import Typography from "@/components/typography";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Invoice } from "@/types/invoices";
import React from "react";

interface SpaceInvoicesTableProps {
  invoices: Invoice[];
}

export default function SpaceInvoicesTable({
  invoices,
}: SpaceInvoicesTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const agencyInvoices = invoices.filter((i) => i.invoiceType === "agency");
  const vendorInvoices = invoices.filter((i) => i.invoiceType === "vendor");

  return (
    <Card className="text-primary bg-card/50 shadow-none border-none">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <Typography variant="h2">Factures</Typography>
          <SearchBar
            onQueryChange={setSearchQuery}
            onDateSortChange={(dir) => console.log(dir)}
            variant="minimal"
          />
        </div>
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
              globalFilter={searchQuery}
              showCampaign={true}
              isAdmin={true}
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
              globalFilter={searchQuery}
              showCampaign={true}
              isAdmin={true}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
