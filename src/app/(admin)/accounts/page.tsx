import CtaButton from "@/components/cta-button";
import SvgPlus from "@/components/icons/Plus";
import SearchBar from "@/components/search-bar";
import Typography from "@/components/typography";
import React from "react";

const ctaProps = { text: "Ajouter un compte", url: "#", target: "self" };

export default function Accounts() {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between">
        <Typography variant="h1" className="mb-0">Comptes</Typography>
        <CtaButton
          props={ctaProps}
          icon={<SvgPlus />}
          className="mr-0"
          variant="openModal"
        />
      </div>
      <p>6 comptes</p>
      <div className="flex justify-end">
      <SearchBar variant="minimal" />
      </div>
    </section>
  );
}
