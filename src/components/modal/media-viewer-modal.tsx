"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import SvgUploder from "@/components/icons/Uploder";
import { CldImage } from "next-cloudinary";

import { X } from "lucide-react";
import SvgTallDown from "../icons/TallDown";
import { Media } from "@/types/medias";
import { Document } from "@/types/docs";
import { Invoice } from "@/types/invoices";
import VideoPlayer from "../video-player";

interface MediaViewerModalProps {
  mediaItem: Media | Document | Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export default function MediaViewerModal({
  mediaItem,
  isOpen,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: MediaViewerModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext && onNext) onNext();
      if (e.key === "ArrowLeft" && hasPrev && onPrev) onPrev();
    },
    [isOpen, onClose, hasNext, onNext, hasPrev, onPrev]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen || !mediaItem || !mediaItem.url) return null;

  const downloadUrl = mediaItem.url.includes("/upload/")
      ? mediaItem.url.replace("/upload/", "/upload/fl_attachment/")
      : mediaItem.url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
      >
        <X className="w-8 h-8 md:w-10 md:h-10 text-white cursor-pointer" />
      </button>

      {/* Navigation Left */}
      {hasPrev && onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2"
        >
          <SvgTallDown className="rotate-90 size-10 fill-white cursor-pointer" />
        </button>
      )}

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center w-fit h-auto max-w-[95vw] max-h-[95vh] bg-black overflow-hidden shadow-2xl">
        <div className="relative w-auto h-auto flex items-center justify-center">
          {renderContent(mediaItem)}
        </div>

        {/* Footer */}
        <div className="w-full flex items-center justify-between bg-neutral-900/90 px-6 py-4">
          <p className="text-white text-lg font-medium truncate max-w-[80%]">
            {mediaItem.title}
          </p>
          <a
            href={downloadUrl}
            download
            className="text-white/80 hover:text-white transition-colors p-2"
            title="Télécharger"
          >
            <SvgUploder className="w-6 h-6 text-white cursor-pointer" />
          </a>
        </div>
      </div>

      {/* Navigation Right */}
      {hasNext && onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2"
        >
          <SvgTallDown className="rotate-270 size-10 fill-white cursor-pointer" />
        </button>
      )}
    </div>
  );
}

function renderContent(item: Media | Document | Invoice) {
  const type = "type" in item ? item.type : "pdf";
  if (!item.url) return null;

  switch (type) {
    case "jpg":
    case "png":
      return (
        <div className="relative flex items-center justify-center">
          <CldImage
            src={item.publicId || item.url!}
            width={1920}
            height={1080}
            className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain"
            alt={item.title}
            preserveTransformations
          />
        </div>
      );

    case "mp4":
      return (
        <VideoPlayer
          url={item.url!}
          className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain"
        />
      );

    case "mp3":
      return (
        <div className="flex flex-col items-center justify-center bg-white/10 p-12 rounded-xl">
          <div className="text-white text-6xl mb-6">♫</div>
          <audio controls src={item.url} className="min-w-[300px]" />
        </div>
      );

    case "pdf":
      return (
        <iframe
          src={item.url}
          className="w-[90vw] h-[80vh] md:w-[70vw] bg-white shadow-xl"
          title={item.title}
        />
      );
    default:
      return (
        <div className="text-white">
          Format non supporté pour la prévisualisation.
        </div>
      );
  }
}
