"use client";
import React from "react";
import LatestFiles from "@/components/latest-files";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";

const ctaData = [
  { text: "Voir la bibliothèque", url: "librairy", target: "self" },
  { text: "Voir tous les documents", url: "documents", target: "self" },
  { text: "Voir toutes les factures", url: "invoices", target: "self" },
];

export default function SpaceFiles() {
  const params = useParams();
  const campaignId = params?.id as Id<"campaigns">;

  // Fetch Medias
  const medias = useQuery(api.queries.medias.getMediaFilesByCampaign, {
    campaignId,
  });

  const mediaData =
    medias?.slice(0, 3).map((media) => ({
      title: media.title,
      description: media.type,
      startDate: new Date(media._creationTime),
      media: {
        publicId: media.publicId,
        type: media.type,
        url: media.url,
        _id: media._id,
        alt: media.title,
      },
    })) ?? [];

  // Fetch Documents
  const documents = useQuery(api.queries.documents.getDocumentsByCampaign, {
    campaignId,
  });

  const docData =
    documents?.slice(0, 3).map((doc) => ({
      title: doc.title,
      description: doc.type,
      startDate: new Date(doc._creationTime),
    })) ?? [];

  // Fetch Invoices
  const invoices = useQuery(api.queries.invoices.getInvoicesByCampaign, {
    campaignId,
  });

  const invoiceData =
    invoices?.slice(0, 3).map((invoice) => ({
      title: invoice.title,
      description:
        invoice.invoiceType === "agency" ? "Facture Agence" : "Facture Régie",
      startDate: new Date(invoice.startDate),
    })) ?? [];

  return (
    <section className="flex flex-col gap-10">
      <LatestFiles
        title="Les dernières ressources médias"
        cta={{
          ...ctaData[0],
          url: `/campaign/${campaignId}/${ctaData[0].url}`,
        }}
        data={mediaData}
        variant="media"
        hideEditIcon={true}
        emptyMessage={medias ? "Aucun média n'a été importé." : undefined}
      />
      <LatestFiles
        title="Les derniers documents"
        cta={{
          ...ctaData[1],
          url: `/campaign/${campaignId}/${ctaData[1].url}`,
        }}
        data={docData}
        variant="default"
        emptyMessage={documents ? "Aucun document n'a été importé." : undefined}
      />
      <LatestFiles
        title="Les dernières factures"
        cta={{
          ...ctaData[2],
          url: `/campaign/${campaignId}/${ctaData[2].url}`,
        }}
        data={invoiceData}
        variant="default"
        className="mb-10"
        emptyMessage={invoices ? "Aucune facture n'a été importée." : undefined}
      />
    </section>
  );
}
