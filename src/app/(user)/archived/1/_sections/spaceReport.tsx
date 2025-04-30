import CtaButton from '@/components/cta-button'
import Typography from '@/components/typography'
import React from 'react'
import ReportCard from '../../components/report-card';

const ctaButtonData = {
  text: "Télécharger le bilan de la campagne",
};

const reportCardData = {
  grp: 2285,
  coverage: 90.2,
  contacts: 610,
  repetitions: 25.2,
};

export default function SpaceReport() {
  return (
    <section className="space-y-6 flex flex-col">
      <div className="flex flex-wrap items-center justify-between">
        <Typography variant="h2" className="mb-0">
          Bilan
        </Typography>
        <CtaButton
          props={ctaButtonData}
          className="border transition h-10 hover:border-primary hover:bg-white hover:text-primary bg-primary text-white"
          variant="openModal"
        />
        </div>
        <ReportCard {...reportCardData} />

    </section>
  )
}
