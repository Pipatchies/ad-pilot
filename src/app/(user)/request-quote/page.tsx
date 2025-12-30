import React from "react";
import Typography from "@/components/typography";
import QuoteForm from "./components/quote-form";

export default function RequestQuotePage() {
  return (
    <section className="space-y-6">
      <Typography variant="h1">Demander un devis</Typography>
      <QuoteForm />
    </section>
  );
}
