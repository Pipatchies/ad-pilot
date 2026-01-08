import Typography from '@/components/typography';
import React from 'react';
import SearchBar from '@/components/search-bar';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import CtaButton from '@/components/cta-button';
import SvgCrayon from '@/components/icons/Crayon';

const CtaProps = {
  text: 'Ajouter une campagne',
  url: '/admin/new-campaign',
  target: 'self',
};

type campaignsHeaderProps = {
  onQueryChange: (q: string) => void;
};

export default function SpaceCampaignsHeader({ onQueryChange }: campaignsHeaderProps) {
  const campaigns = useQuery(api.queries.campaigns.getAllCampaigns) ?? [];
  const count = campaigns.length;
  return (
    <section>
      <div className='flex flex-wrap items-center justify-between'>
        <Typography variant='h1' className='mb-0'>
          Campagnes
        </Typography>
        <CtaButton props={CtaProps} icon={<SvgCrayon />} />
      </div>
      <p className='text-primary/80'>{`${count} campagnes`}</p>
      <div className='flex justify-end'>
        <SearchBar variant='minimal' onQueryChange={onQueryChange} />
      </div>
    </section>
  );
}
