import DetailsCard from "@/components/details-card";
import Link from "next/link";

type Props = {
  data: {
    title: string;
    description: string;
    startDate: Date;
    archivedDate: Date;
    slug: string;
  }[];
  className?: string;
  variant: "archived";
};

export default function ArchivedCards({
  data,
  variant,
  className = "",
}: Props) {
  return (
      <div className={`flex gap-5 flex-wrap w-full ${className}`}>
        {data.map((item, index) => (
          <div key={index} className="w-full xl:basis-1/4 grow">
            <Link href={`/archived/${item.slug}`} className="block h-full">
            <DetailsCard variant={variant} {...item} />
            </Link>
          </div>
        ))}
      </div>
  );
}