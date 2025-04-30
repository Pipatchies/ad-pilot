import Typography from "@/components/typography";
import DetailsCard from "@/components/details-card";
import Link from "next/link";

type Props = {
  title: string;
  data: {
    title: string;
    age: string;
    subject: string;
    slug: string;
  }[];
  className?: string;
  variant: "target";
};

export default function TargetCards({
  title,
  data,
  variant,
  className = "",
}: Props) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between">
        <Typography variant="h1" className="font-bold pb-10">
          {title}
        </Typography>
      </div>
      <div className="flex gap-5 flex-wrap w-full">
        {data.map((item, index) => (
          <div key={index} className="w-full xl:basis-1/4 grow">
            <Link href={`/campaign/1/targets/${item.slug}`} className="block h-full">
            <DetailsCard variant={variant} {...item} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}