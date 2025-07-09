import CtaButton from "@/components/cta-button";
import SvgPlus from "@/components/icons/Plus";
import Typography from "@/components/typography";
import React from "react";

const ctaProps = { text: "Ajouter un compte", url: "#", target: "self" };

export default function page() {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between">
        <Typography variant="h1">Comptes</Typography>
        <CtaButton
          props={ctaProps}
          icon={<SvgPlus />}
          className="mr-0"
          variant="openModal"
        />
      </div>
    </section>
  );
}
