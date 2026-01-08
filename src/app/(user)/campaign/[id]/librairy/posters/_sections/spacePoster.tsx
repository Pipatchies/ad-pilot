'use client';
import React, { useState, useMemo } from 'react';
import VisualsCard from '../../components/visuals-card';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../../convex/_generated/dataModel';
import SvgImageSmall from '@/components/icons/ImageSmall';
import SpacePosterHeader from './spacePosterHeader';

export default function SpacePoster() {
  const params = useParams();
  const campaignId = params?.id as Id<'campaigns'>;

  const medias = useQuery(api.queries.medias.getMediaFilesByCampaign, {
    campaignId,
  });

  const visualsCardData = useMemo(
    () =>
      medias?.map((media) => ({
        title: media.title,
        type: media.type,
        date: new Date(media._creationTime),
        icon: <SvgImageSmall />,
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
      <SpacePosterHeader
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
