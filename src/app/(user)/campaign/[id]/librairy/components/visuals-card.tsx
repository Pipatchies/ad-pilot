import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Typography from '@/components/typography';
import SvgEyeIcon from '@/components/icons/EyeIcon';
import SvgUploder from '@/components/icons/Uploder';
import { Media } from '@/types/medias';
import MediaThumb from '@/components/media-thumb';
import MediaViewerModal from '@/components/modal/media-viewer-modal';
import { cn } from '@/lib/utils';

export interface DetailsCardProps {
  title: string;
  type: string;
  date: Date;
  icon: React.ReactNode;
  media?: Media;
}

export default function VisualsCard({ title, type, date, icon, media }: DetailsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card className='text-primary bg-card/50 min-h-[450px] py-10 shadow-none border-none w-full flex flex-col'>
      <div className='flex-1 flex justify-center items-center overflow-hidden w-full p-2'>
        {media ? (
          <div
            className='relative flex items-center justify-center w-full h-full cursor-pointer hover:opacity-90 transition-opacity'
            onClick={() => setIsModalOpen(true)}
          >
            <MediaThumb
              publicId={media.publicId}
              url={media.url}
              type={media.type}
              width={media.width}
              height={media.height}
              variant='card'
              className='w-full h-full flex items-center justify-center'
              alt={title}
            />
          </div>
        ) : (
          <div className='bg-primary flex items-center justify-center h-40 w-40 fill-white'>
            {icon}
          </div>
        )}
      </div>

      <div className='flex flex-col items-center w-full px-4'>
        <CardContent className='flex flex-col items-center w-full px-0'>
          <ul className='space-y-2 flex flex-col items-center'>
            <li>
              <Typography variant='h3' className='mb-0 text-center'>
                {title}
              </Typography>
            </li>
            <li>
              <span className='italic text-primary'>{type}</span>
            </li>
            <li>
              <span className='underline'>Date :</span> {date.toLocaleDateString()}
            </li>
          </ul>
        </CardContent>

        <CardFooter className='flex flex-wrap gap-x-4 mt-4 justify-center'>
          <button
            onClick={() => setIsModalOpen(true)}
            className='hover:scale-110 transition-transform cursor-pointer'
          >
            <SvgEyeIcon />
          </button>

          {media?.url ? (
            <a
              href={
                media.url.includes('/upload/')
                  ? media.url.replace('/upload/', '/upload/fl_attachment/')
                  : media.url
              }
              download
              className='cursor-pointer hover:opacity-80 transition-opacity'
            >
              <SvgUploder />
            </a>
          ) : (
            <div className='opacity-50 cursor-not-allowed'>
              <SvgUploder />
            </div>
          )}
        </CardFooter>
      </div>

      {isModalOpen && media && (
        <MediaViewerModal
          isOpen={isModalOpen}
          mediaItem={media}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Card>
  );
}
