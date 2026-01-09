'use client';
import React from 'react';
import SpaceRecap from './_sections/spaceRecap';
import Typography from '@/components/typography';
import SpaceReport from './_sections/spaceReport';
import SpaceInvoices from './_sections/spaceInvoices';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useParams } from 'next/navigation';

export default function ArchivedCampaign() {
  const params = useParams();
  const campaignId = params?.id as Id<'campaigns'>;

  const campaign = useQuery(
    api.queries.campaigns.getCampaignById,
    campaignId ? { campaignId } : 'skip',
  );

  if (!campaign) {
    return <div className='h-full w-full flex items-center justify-center'>Chargement...</div>;
  }

  return (
    <section className='space-y-10'>
      <div>
        <Typography variant='h1'>{campaign.title}</Typography>
        <Typography className='m-0' variant='h4'>
          {campaign.subtitle}
        </Typography>
      </div>
      <div className='space-y-20'>
        <SpaceReport />
        <SpaceRecap />
        <SpaceInvoices />
      </div>
    </section>
  );
}
