import Typography from '@/components/typography';
import CtaButton from '@/components/cta-button';
import DetailsCard from '@/components/card/details-card';

type Props = {
  title: string;
  cta?: {
    text: string;
    url: string;
    target: string;
  };
  data: {
    title: string;
    description?: string;
    startDate?: Date;
    age?: string;
    subject?: string;
    url?: string;
    fileData?: {
      url: string;
      type: string;
      publicId: string;
      title: string;
    };
  }[];
  variant: 'media' | 'default' | 'campaign';
  className?: string;
  hideEditIcon?: boolean;
  emptyMessage?: string;
};

export default function LatestFiles({
  title,
  cta,
  data,
  variant,
  className = '',
  hideEditIcon = false,
  emptyMessage,
}: Props) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className='flex flex-wrap items-center justify-between'>
        <Typography variant='h2' className='mb-0'>
          {title}
        </Typography>
        {cta && <CtaButton props={cta} className='border transition h-10' variant='noIcon' />}
      </div>

      {data.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {data.map((item, index) => (
            <div key={index} className='w-full'>
              <DetailsCard
                variant={variant}
                hideEditIcon={hideEditIcon}
                url={item.url}
                fileData={item.fileData}
                {...item}
              />
            </div>
          ))}
        </div>
      ) : (
        emptyMessage && (
          <div className='flex h-[150px] w-full items-center justify-center rounded-lg bg-muted/40 text-primary text-sm'>
            {emptyMessage}
          </div>
        )
      )}
    </div>
  );
}
