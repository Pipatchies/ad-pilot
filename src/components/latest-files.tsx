import Typography from "@/components/typography";
import CtaButton from "@/components/cta-button";
import DetailsCard from "@/components/details-card";

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
  variant: "media" | "default" | "campaign" | "target";
  className?: string;
};

export default function LatestFiles({
  title,
  cta,
  data,
  variant,
  className = "",
}: Props) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between">
        <Typography variant={variant === "target" ? "h1" : "h2"} className={variant === "target" ? "font-bold pb-10" : "mb-0"}>
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
      <div className="flex gap-5 flex-wrap w-full">
        {data.map((item, index) => (
          <div key={index} className="w-full xl:basis-1/4 grow">
            <DetailsCard variant={variant} {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
