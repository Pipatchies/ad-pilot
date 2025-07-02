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

function getIconFromType(type: string) {
  switch (type) {
    case "tv":
      return {
        name: "television",
        url: "/icons/television.svg",
        width: 26,
        height: 20,
      };
    case "radio":
      return {
        name: "radio",
        url: "/icons/radio.svg",
        width: 28,
        height: 27,
      };
    case "digital":
      return {
        name: "digital",
        url: "/icons/domaine.svg",
        width: 26,
        height: 26,
      };
    case "affichage":
      return {
        name: "panneau",
        url: "/icons/panneau-daffichage.svg",
        width: 15,
        height: 26,
      };
    default:
      return null;
  }
}

type DetailsCardProps = {
  title: string;
  description?: string;
  campaignTitle?: string;
  startDate?: Date;
  endDate?: Date;
  archivedDate?: Date;
  sendBy?: string;
  status?: string;
  mediaTypes?: string[];
  age?: string;
  subject?: string;
  variant: "default" | "campaign" | "media" | "target" | "archived" | "invoice";
};

export default function DetailsCard({
  title,
  description,
  campaignTitle,
  startDate,
  endDate,
  archivedDate,
  sendBy,
  status,
  mediaTypes,
  age,
  subject,
  variant,
}: DetailsCardProps) {
  return (
    <Card
      className={cn(
        "text-primary bg-card/50 max-h-[250px] py-10 shadow-none border-none gap-y-4 w-full flex justify-center",
        variant === "media" && ""
      )}
    >
      <CardHeader>
        {variant === "media" && (
          <>
            <div className="bg-primary flex items-center justify-center h-17 w-17 fill-white">
              <SvgImageSmall />
            </div>
            <Typography variant="h3" className="mb-0">
              {title}
            </Typography>
            <CardDescription className="italic text-primary ">
              {description}
            </CardDescription>
          </>
        )}
        {(variant === "campaign" ||
          variant === "default" ||
          variant === "archived" ||
        variant === "invoice") && (
          <>
            <Typography variant="h3" className="mb-0">
              {title}
            </Typography>
            <CardDescription className="italic text-primary">
              {description}
            </CardDescription>
          </>
        )}
        {variant === "target" && (
          <>
            <Typography variant="h3" className="mb-0">
              {title}
            </Typography>
          </>
        )}
      </CardHeader>
      <CardContent>
        {variant === "campaign" && (
          <ul className="space-y-1">
            <li>
              <span className="underline">Date de lancement :</span>{" "}
              {startDate?.toLocaleDateString()}
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
              {startDate?.toLocaleDateString()}
            </li>
          </ul>
        )}

        {variant === "media" && (
          <>
            <ul className="space-y-1">
              <li>
                <span className="underline">Date</span> :{" "}
                {startDate?.toLocaleDateString()}
              </li>
            </ul>
          </>
        )}

        {variant === "target" && (
          <>
            <ul className="space-y-1">
              <li>
                <span className="underline">Tranche d'âge</span> : {age}
              </li>
              <li>
                <span className="underline">Sujet</span> : {subject}
              </li>
            </ul>
          </>
        )}

        {variant === "archived" && (
          <ul className="space-y-1">
            <li>
              <span className="underline">Date de lancement :</span>{" "}
              {startDate?.toLocaleDateString()}
            </li>
            <li>
              <span className="underline">Date d'archivage' :</span>{" "}
              {archivedDate?.toLocaleDateString()}
            </li>
          </ul>
        )}

        {variant === "invoice" && (
          <ul className="space-y-1">
            <li>
              <span className="underline">Date :</span>{" "}
              {startDate?.toLocaleDateString()}
            </li>
            <li>
              <span className="underline">Emmetteur :</span>{" "}
              {sendBy}
            </li>
          </ul>
        )}
      </CardContent>

      {variant === "campaign" && mediaTypes && mediaTypes.length > 0 && (
        <CardFooter className="flex items-end gap-x-2">
          <span className="underline">Médias :</span>
          {mediaTypes.map((type, index) => {
            const icon = getIconFromType(type);
            return (
              icon && (
                <Image
                  key={index}
                  src={icon.url}
                  alt={icon.name}
                  width={icon.width}
                  height={icon.height}
                />
              )
            );
          })}
        </CardFooter>
      )}
    </Card>
  );
}