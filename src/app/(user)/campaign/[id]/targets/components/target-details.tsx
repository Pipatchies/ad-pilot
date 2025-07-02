import Typography from "@/components/typography";
import { Card } from "@/components/ui/card";
import React from "react";

interface TargetDetailsProps {
  title: string;
  header: {
    survey: string;
    zoom: string;
    filter: string;
    sector: string;
    subject: string;
  };
  scale: number;
  size: number;
  card: {
    legend: string;
    percentage: number;
    key: number;
  }[];
}

export default function TargetDetails({
  title,
  header,
  scale,
  size,
  card,
}: TargetDetailsProps) {
  return (
    <section>
      <Typography variant="h2">{title}</Typography>

      <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-2 w-9/10">
        <ul className="space-y-3">
          <li>
            {" "}
            <span className="underline"> Sondage : </span> {header.survey}{" "}
          </li>
          <li>
            {" "}
            <span className="underline">Zoom : </span> {header.zoom}{" "}
          </li>
          <li>
            {" "}
            <span className="underline">Filtre : </span> {header.filter}{" "}
          </li>
        </ul>
        <ul className="space-y-3">
          <li>
            {" "}
            <span className="underline">Secteur : </span>
            {header.sector}{" "}
          </li>
          <li>
            {" "}
            <span className="underline">Sujet : </span> {header.subject}{" "}
          </li>
        </ul>
      </div>

      <Card className="text-primary max-h-auto rounded-sm shadow-around bg-white border-none text-primary px-15 py-9">
        <div className="flex justify-between items-center text-primary/50">
          <span>Légende</span>
          <div className="flex gap-4">
            <span>
              Ech {scale}, Effectif {size}M
            </span>
            <span>Indice</span>
          </div>
        </div>

        <div className="space-y-6">
          {card.map((item, index) => (
            <div key={item.key || index} className="w-full">
              <p className="mb-2">{item.legend}</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-7 bg-[#EDF0F5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-destructive rounded-full flex items-center justify-end text-white px-2 sm:px-6 text-sm sm:text-base"
                    style={{ width: `${item.percentage}%` }}
                  >
                    {item.percentage}%
                  </div>
                </div>
                <span className="pl-4">{item.key}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
