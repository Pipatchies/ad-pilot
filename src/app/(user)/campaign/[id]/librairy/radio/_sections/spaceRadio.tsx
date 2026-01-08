'use client';
import React, { useState, useMemo } from 'react';
import VisualsCard from '../../components/visuals-card';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../../convex/_generated/dataModel';
import SvgAudio from '@/components/icons/Audio';
import SpaceRadioHeader from './spaceRadioHeader';

export default function SpaceRadio() {
  const params = useParams();
  const campaignId = params?.id as Id<'campaigns'>;

  const medias = useQuery(api.queries.medias.getMediaFilesByCampaign, {
    campaignId,
  });

  const visualsCardData = useMemo(
    () =>
      medias
        ?.filter((media) => media.mediaTypes && media.mediaTypes.includes('radio'))
        .map((media) => ({
          title: media.title,
          type: media.type,
          date: new Date(media._creationTime),
          icon: <SvgAudio />,
          media: media,
        })) ?? [],
    [medias],
  );

  const [globalFilter, setGlobalFilter] = useState('');
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');

  const filteredAndSorted = useMemo(() => {
    return visualsCardData
      .filter((item) => item.title.toLowerCase().includes(globalFilter.toLowerCase()))
      .sort((a, b) =>
        dateSort === 'asc'
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime(),
      );
  }, [visualsCardData, globalFilter, dateSort]);

  return (
    <section>
      <SpaceRadioHeader
        onQueryChange={setGlobalFilter}
        onDateSortChange={setDateSort}
        defaultDateSort='desc'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
        {filteredAndSorted.map((item, index) => (
          <div key={index} className='w-full'>
            <VisualsCard
              title={item.title}
              type={item.type}
              date={item.date}
              icon={item.icon}
              media={item.media}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
