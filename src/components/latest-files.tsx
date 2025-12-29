import Typography from "@/components/typography";
import CtaButton from "@/components/cta-button";
import DetailsCard from "@/components/card/details-card";

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
  }[];
  variant: "media" | "default" | "campaign";
  className?: string;
  hideEditIcon?: boolean;
};

export default function LatestFiles({
  title,
  cta,
  data,
  variant,
  className = "",
  hideEditIcon = false,
}: Props) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between">
        <Typography variant="h2" className="mb-0">
          {title}
        </Typography>
        {cta && (
          <CtaButton
            props={cta}
            className="border transition h-10"
            variant="noIcon"
          />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((item, index) => (
          <div key={index} className="w-full">
            <DetailsCard
              variant={variant}
              hideEditIcon={hideEditIcon}
              {...item}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
