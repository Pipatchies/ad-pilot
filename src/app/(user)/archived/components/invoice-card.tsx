import DetailsCard from "@/components/details-card";
import Link from "next/link";

type Props = {
  data: {
    title: string;
    description: string;
    startDate: Date;
    sendBy: string;
    slug: string;
  }[];
  className?: string;
  variant: "invoice";
};

export default function InvoiceCards({
  data,
  variant,
  className = "",
}: Props) {
  return (
      <div className={className}>
        {data.map((item, index) => (
            <Link key={index} href={`/archived/${item.slug}`} className="block h-full">
            <DetailsCard variant={variant} {...item} />
            </Link>
        ))}
      </div>
  );
}