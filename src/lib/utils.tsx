import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import SvgImageSmall from "@/components/icons/ImageSmall";
import SvgSliderVideo from "@/components/icons/SliderVideo";
import SvgGroupe6 from "@/components/icons/Groupe6";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateBroadcastProgress(startDateString: string, endDateString: string) {
  const today = new Date();
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = today.getTime() - startDate.getTime();
  const remaining = endDate.getTime() - today.getTime();

  const progress = Math.min(
    100,
    Math.max(0, Math.round((elapsed / totalDuration) * 100))
  );

  const daysRemaining = Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));

  return { progress, daysRemaining };
}

export function getIconFromType(type: string) {
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

export function getIconFromMediaFilesType(type: string) {
  switch (type) {
    case "PNG":
    case "JPG":
    case "PDF":
      return <SvgImageSmall />;
    case "MP3":
      return <SvgGroupe6 />;
    case "MP4":
      return <SvgSliderVideo />;
    default:
      return <SvgImageSmall />;
  }
}