import SvgCible from '@/components/icons/Cible';
import SvgMegaphone from '@/components/icons/Megaphone';
import { Card } from '@/components/ui/card';
import React from 'react';
import SvgUsers from '@/components/icons/Users';
import SvgGrandeTelevision from '@/components/icons/GrandeTelevision';

interface ReportItem {
  icon: string;
  title: string;
  info: string | number;
}

interface ReportCardProps {
  items: ReportItem[];
}

const getIcon = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'tv':
    case 'television':
    case 'grp':
      return <SvgGrandeTelevision className='h-[46] w-[59] fill-[#a5a4bf]' />;
    case 'cible':
    case 'target':
    case 'coverage':
      return <SvgCible />;
    case 'users':
    case 'contacts':
      return <SvgUsers />;
    case 'megaphone':
    case 'repetitions':
      return <SvgMegaphone />;
    default:
      return <SvgGrandeTelevision className='h-[46] w-[59] fill-[#a5a4bf]' />;
  }
};

export default function ReportCard({ items }: ReportCardProps) {
  return (
    <section>
      <Card className='w-full rounded-sm shadow-around bg-white border-none text-primary px-8 py-15'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center'>
          {items.map((item, index) => (
            <div key={index} className='flex items-center space-x-4'>
              {getIcon(item.icon)}
              <div>
                <div className='text-3xl font-[800]'>{item.info}</div>
                <div className='text-xl'>{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
