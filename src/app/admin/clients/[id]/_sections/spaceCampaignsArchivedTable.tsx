import SearchBar from '@/components/search-bar';
import CampaignTable from '@/components/table/campaign-table';
import Typography from '@/components/typography';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Campaign } from '@/types/campaigns';
import React from 'react';

interface SpaceCampaignsArchivedTableProps {
  campaigns: Campaign[];
}

export default function SpaceCampaignsArchivedTable({
  campaigns,
}: SpaceCampaignsArchivedTableProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const archivedCampaigns = campaigns.filter((c) => c.archived);

  return (
    <Card className='text-primary bg-card/50 shadow-none border-none'>
      <CardHeader>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
          <Typography variant='h2'>Campagnes archivées</Typography>
          <SearchBar
            onQueryChange={setSearchQuery}
            onDateSortChange={(dir) => console.log(dir)}
            variant='minimal'
          />
        </div>
      </CardHeader>
      <CardContent>
        <CampaignTable
          campaigns={archivedCampaigns}
          showArchived={true}
          hideClientColumn={true}
          hideStepColumn={true}
          globalFilter={searchQuery}
        />
      </CardContent>
    </Card>
  );
}
