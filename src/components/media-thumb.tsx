import { CldImage } from "next-cloudinary";
import { cn } from "@/lib/utils";
import SvgAudio from "./icons/Audio";

export type MediaThumbProps = {
  publicId?: string;
  url?: string;
  type?: "jpg" | "png" | "pdf" | "mp4" | "mp3";
  className?: string;
  width?: number;
  height?: number;
  alt: string;
};

const size = {
  landscape: { w: 140, h: 100 },
  portrait: { w: 80, h: 100 },
  square: { w: 100, h: 100 },
};

export default function MediaThumb({
  publicId,
  type,
  className,
  width,
  height,
  alt,
}: MediaThumbProps) {
  let orientation: "landscape" | "portrait" | "square" = "landscape";

  if (type === "mp3") orientation = "square";
  else if (type === "pdf") orientation = "portrait";
  else if (type === "mp4") orientation = "landscape";
  else if (type === "jpg" || type === "png") {
    if (width && height) {
      if (width === height) orientation = "square";
      else orientation = width > height ? "landscape" : "portrait";
    } else {
      orientation = "landscape";
    }
  }

  const target = size[orientation];
  const isPdf = type === "pdf";
  const isVideo = type === "mp4";
  const isImage = type === "jpg" || type === "png";

  if (!publicId || !type || type === "mp3") {
    return (
      <div
        className={cn(
          "bg-primary flex items-center justify-center fill-white",
          className
        )}
        style={{ width: target.w, height: target.h }}
      >
        <SvgAudio />
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      {isImage && (
        <CldImage
          src={publicId}
          crop="fill"
          gravity="auto"
          format="auto"
          quality="auto"
          alt={alt}
          width={target.w}
          height={target.h}
          className="object-cover"
        />
      )}

      {isPdf && (
        <CldImage
          src={`${publicId}.pdf`}
          rawTransformations={["pg_1"]}
          crop="fill"
          gravity="auto"
          format="jpg"
          quality="auto"
          alt={alt}
          width={target.w}
          height={target.h}
          className="object-cover"
        />
      )}

      {isVideo && (
        <CldImage
          src={publicId}
          assetType="video"
          crop="fill"
          gravity="auto"
          format="jpg"
          quality="auto"
          alt={alt}
          width={target.w}
          height={target.h}
          className="object-cover"
        />
      )}
    </div>
  );
}
