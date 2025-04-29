import CtaButton from '@/components/cta-button';
import SvgUploder from '@/components/icons/Uploder';
import Typography from '@/components/typography'
import React from 'react'

const CtaButtonData = {
  text: "Télécharger le document",
};

export default function Digital() {
  return (
    <section>
      <Typography variant="h1"> Titre de la campagne </Typography>
      <Typography variant="h1" className="font-bold mb-6"> Analyse digitale </Typography>
      <CtaButton props={CtaButtonData}
      variant="openModal"
      icon={<SvgUploder  />}
      />
    </section>
  )
}
