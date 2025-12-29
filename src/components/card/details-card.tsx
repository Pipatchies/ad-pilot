"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Typography from "../typography";
import Image from "next/image";
import { cn, getIconFromType } from "@/lib/utils";
import MediaThumb, { MediaThumbProps } from "../media-thumb";
import MediaViewerModal from "../modal/media-viewer-modal";
import UpdateMediaModal from "../modal/update/update-media-modal";
import SvgCrayon from "../icons/Crayon";
import { Id } from "@/../convex/_generated/dataModel";
import { MediaType } from "@/types/medias";

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
  media?: MediaThumbProps;
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card
      className={cn(
        "text-primary bg-card/50 max-h-[250px] py-10 shadow-none border-none gap-y-4 w-full flex justify-center gap-2 relative",
        variant === "media" && ""
      )}
    >
      {variant === "media" && media?._id && (
        <div className="absolute top-8 right-6 z-10">
          <UpdateMediaModal
            mediaId={media._id as Id<"medias">}
            defaultValues={{
              title: title,
              mediaTypes: (mediaTypes as MediaType[]) || [],
            }}
            trigger={
              <SvgCrayon className="w-5 h-5 cursor-pointer hover:opacity-70" />
            }
          />
        </div>
      )}
      <CardHeader>
        {variant === "media" && (
          <>
            <div
              onClick={() => media?.url && setIsModalOpen(true)}
              className={cn(
                "flex items-start gap-4 mb-2",
                media?.url &&
                  "cursor-pointer hover:opacity-80 transition-opacity"
              )}
            >
              <MediaThumb
                publicId={media?.publicId}
                type={media?.type}
                alt={title}
              />
            </div>
            <Typography variant="h3" className="mb-0">
              {title}
            </Typography>
            <CardDescription className="italic text-primary">
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
              <span className="underline">Date d'archivage :</span>{" "}
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
              <span className="underline">Emetteur :</span> {sendBy}
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
      {isModalOpen && media?.url && (
        <MediaViewerModal
          isOpen={isModalOpen}
          mediaItem={{
            title: title,
            url: media.url,
            type: media.type || "pdf",
            publicId: media.publicId,
            resourceType: "raw",
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Card>
  );
}
