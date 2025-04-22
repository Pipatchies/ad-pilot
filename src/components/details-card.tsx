import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Typography from "./typography";
import Image from "next/image";
import SvgImageSmall from "./icons/ImageSmall";
import { cn } from "@/lib/utils";

type IconType = {
  name: string;
  url: string;
  width?: number;
  height?: number;
};

type DetailsCardProps = {
  title: string;
  description: string;
  campaignTitle?: string;
  startDate: Date;
  endDate?: Date;
  status?: string;
  icons?: IconType[];
  variant: "default" | "campaign" | "media";
};

export default function DetailsCard({
  title,
  description,
  campaignTitle,
  startDate,
  endDate,
  status,
  icons,
  variant,
}: DetailsCardProps) {
  return (
      <Card className={cn(
        "text-primary bg-card/50 h-[250px] shadow-none border-none gap-y-4 w-full",
      variant === "media" && ""
    )}
    >
        <CardHeader>
          {variant === "media" && (
            <>
              <div className="bg-primary flex items-center justify-center h-16 w-16">
                <SvgImageSmall />
              </div>
              <Typography variant="h3" className="mb-0">
                {title}
              </Typography>
              <CardDescription className="italic text-primary">
                {description}
              </CardDescription>
            </>
          )}
          {(variant === "campaign" || variant === "default") && (
            <>
              <Typography variant="h3" className="mb-0">
                {title}
              </Typography>
              <CardDescription className="italic text-primary">
                {description}
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          {variant === "campaign" && (
            <ul className="space-y-1">
              <li>
                <span className="underline">Date de lancement :</span>{" "}
                {startDate.toLocaleDateString()}
              </li>
              <li>
                <span className="underline">Date de fin :</span>{" "}
                {endDate?.toLocaleDateString()}
              </li>
              <li>
                <span className="underline">Etape :</span> {status}
              </li>
            </ul>
          )}

          {variant === "default" && (
            <ul className="space-y-1">
              {campaignTitle && (
                <li>
                  <span className="underline">Campagne</span> : {campaignTitle}
                </li>
              )}
              <li>
                <span className="underline">Date</span> :{" "}
                {startDate.toLocaleDateString()}
              </li>
            </ul>
          )}

          {variant === "media" && (
            <>
              <ul className="space-y-1">
                <li>
                  <span className="underline">Date</span> :{" "}
                  {startDate.toLocaleDateString()}
                </li>
              </ul>
            </>
          )}
        </CardContent>

        {variant === "campaign" && icons && icons.length > 0 && (
          <CardFooter className="flex items-end gap-x-2">
            <span className="underline">Médias :</span>
            {icons.map((icon, index) => (
              <Image
                key={index}
                src={icon.url}
                alt={icon.name}
                width={icon.width}
                height={icon.height}
              />
            ))}
          </CardFooter>
        )}
      </Card>
  );
}
