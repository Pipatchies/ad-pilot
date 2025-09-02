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
import { cn, getIconFromType } from "@/lib/utils";
import { CldImage } from "next-cloudinary";

type MediaThumb = {
  publicId?: string;
  url?: string;
  type?: "jpg" | "png" | "pdf" | "mp4" | "mp3";
  width?: number;
  height?: number;
};


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
  media?: MediaThumb;
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
  media,
}: DetailsCardProps) {

  const getAspectClass = () => {
    if (!media?.type) return "aspect-[16/9]";
    if (media.type === "pdf") return "aspect-[4/3]";
    if (media.type === "mp4") return "aspect-[16/9]";
    if (media.width && media.height) {
      if (media.width === media.height) return "aspect-square";
      return media.width > media.height ? "aspect-[16/9]" : "aspect-[3/4]";
    }
    return "aspect-[16/9]";
  };

  const renderMediaThumb = () => {
    if (!media?.publicId || !media?.type) {
      return (
        <div className="bg-primary flex items-center justify-center h-17 w-17 fill-white">
          <SvgImageSmall />
        </div>
      );
    }

    const isPdf = media.type === "pdf";
    const isVideo = media.type === "mp4";
    const isImage = media.type === "jpg" || media.type === "png";

return (
      <div className={cn("relative w-[265px] rounded overflow-hidden bg-muted", getAspectClass())}>
        {isImage && (
          <CldImage
            src={media.publicId}
            fill
            crop="fill"
            gravity="auto"
            format="auto"
            quality="auto"
            alt={title}
            className="object-cover"
          />
        )}

        {isPdf && (
          <CldImage
            src={`${media.publicId}.pdf`}
            rawTransformations={["pg_1"]}
            fill
            crop="fill"
            gravity="auto"
            format="jpg"
            quality="auto"
            alt={title}
            className="object-cover"
          />
        )}

        {isVideo && (
          <CldImage
            src={media.publicId}
            assetType="video"
            fill
            crop="fill"
            gravity="auto"
            format="jpg"
            quality="auto"
            alt={title}
            className="object-cover"
          />
        )}
      </div>
    );
  };
  
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
            {renderMediaThumb()}
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