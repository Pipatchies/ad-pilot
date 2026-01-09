'use client';

import CtaButton from '@/components/cta-button';
import SvgUploder from '@/components/icons/Uploder';
import Typography from '@/components/typography';
import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';

const CtaButtonData = {
  text: 'Télécharger le document',
};

export default function Digital({ params }: { params: { id: string } }) {
  const campaign = useQuery(api.queries.campaigns.getCampaignById, {
    campaignId: params.id as Id<'campaigns'>,
  });

  if (!campaign) return <div>Chargement...</div>;

  return (
    <section>
      <Typography variant='h1'> {campaign.title} </Typography>
      <Typography variant='h1' className='font-bold mb-6'>
        {' '}
        Analyse digitale{' '}
      </Typography>
      {campaign.digitalAnalysis?.url ? (
        <CtaButton
          props={{
            text: 'Télécharger le document',
            url: campaign.digitalAnalysis.url.replace('/upload/', '/upload/fl_attachment/'),
            target: '_self',
            download: true,
          }}
          icon={<SvgUploder />}
        />
      ) : (
        <Typography variant='h6'>Aucune analyse digitale disponible pour le moment.</Typography>
      )}
    </section>
  );
}
