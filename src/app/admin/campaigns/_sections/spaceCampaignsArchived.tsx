'use client';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import CampaignTable from '@/components/table/campaign-table';
import Typography from '@/components/typography';
import { Campaign } from '@/types/campaigns';

type Props = {
  globalFilter: string;
};

export default function SpaceCampaignsArchived({ globalFilter }: Props) {
  const campaignsArchived = useQuery(api.queries.campaigns.getArchivedCampaigns) as Campaign[];

  if (!campaignsArchived) {
    return <p>Chargement...</p>;
  }

  return (
    <section>
      <Typography variant='h2'>Campagnes archivées</Typography>
      <CampaignTable campaigns={campaignsArchived} globalFilter={globalFilter} />
    </section>
  );
}
