"use client";

import React from "react";
import FolderCard from "../../../components/card/folder-card";
import Typography from "@/components/typography";
import SvgVerywell from "@/components/icons/Verywell";
import InvoicesModal from "@/components/modal/invoices-modal";

const folderCardData = [
  {
    title: "Facture agence",
    icon: <SvgVerywell />,
    url: "/admin/invoices/agency",
  },
  {
    title: "Facture régie",
    url: "/admin/invoices/regie",
  },
];

export default function Invoices() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <Typography variant="h1" className="lg:mb-20">
          {" "}
          Les factures
        </Typography>
        <InvoicesModal />
      </div>
      <div className="flex flex-wrap sm:items-center sm:justify-between gap-6 mb-6">
        {folderCardData.map((data, index) => (
          <FolderCard
            key={index}
            title={data.title}
            icon={data.icon}
            url={data.url}
          />
        ))}
      </div>
    </section>
  );
}
