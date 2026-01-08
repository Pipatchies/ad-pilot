'use client';
import React from 'react';

import InvoiceCards from './invoice-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import SvgTallDown from '@/components/icons/TallDown';

interface InvoiceCarouselProps {
  invoices: {
    title: string;
    description: string;
    startDate: Date;
    sendBy: string;
    slug: string;
  }[];
}

export default function InvoiceCarousel({ invoices }: InvoiceCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section>
      <div className='relative flex items-center justify-between w-full'>
        <Button
          variant='ghost'
          size='icon'
          className='fill-[#E1DFE6] hover:bg-white cursor-pointer pr-10 active:fill-[#A5A4BF]'
          onClick={() => api?.scrollPrev()}
          aria-label='Précédent'
        >
          <SvgTallDown className='rotate-90 size-10' />
        </Button>

        <Carousel
          setApi={setApi}
          className='w-full'
          opts={{
            align: 'start',
            loop: true,
          }}
        >
          <CarouselContent>
            {invoices.map((invoice, index) => (
              <CarouselItem key={index} className='pl-6 md:basis-1/2 lg:basis-1/3'>
                <InvoiceCards data={[invoice]} variant='invoice' className='h-full' />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <Button
          variant='ghost'
          size='icon'
          className='fill-[#E1DFE6] hover:bg-white cursor-pointer pl-10 active:fill-[#A5A4BF]'
          onClick={() => api?.scrollNext()}
          aria-label='Suivant'
        >
          <SvgTallDown className='rotate-270 size-10' />
        </Button>
      </div>

      <div className='flex justify-center gap-1 mt-4'>
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === current - 1 ? 'w-6 bg-[#A5A4BF]' : 'w-2 bg-[#E1DFE6]'
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
