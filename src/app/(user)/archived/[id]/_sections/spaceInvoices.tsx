"use client";
import React from "react";
import InvoiceCarousel from "../../components/invoice-carousel";
import Typography from "@/components/typography";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

export default function SpaceInvoices() {
  const params = useParams();
  const campaignId = params?.id as Id<"campaigns">;

  const invoices = useQuery(
    api.queries.invoices.getInvoicesByCampaign,
    campaignId ? { campaignId } : "skip"
  );

  const invoiceData =
    invoices?.map((invoice) => ({
      title: invoice.title,
      description:
        invoice.invoiceType === "agency" ? "Facture Agence" : "Facture Régie",
      startDate: new Date(invoice.startDate),
      sendBy: invoice.invoiceType === "agency" ? "Verywell" : "Régie",
      slug: invoice._id,
    })) ?? [];

  if (!invoices || invoices.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <Typography variant="h2" className="mb-0">
          Les factures
        </Typography>
      </div>
      <InvoiceCarousel invoices={invoiceData} />
    </section>
  );
}
