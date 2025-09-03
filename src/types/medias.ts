export const TYPE_VALUES = ["jpg", "png", "pdf", "mp4", "mp3"] as const;
export type MediaFileType = typeof TYPE_VALUES[number];

export const MEDIA_TYPE_VALUES = [
  "digital",
  "tv",
  "ooh",
  "radio",
  "cinema",
  "press",
] as const;
export type MediaType = typeof MEDIA_TYPE_VALUES[number];

export type Media = {
  title: string;
  url: string;
  type: MediaFileType;
  mediaType: MediaType;
  publicId: string;
  resourceType: "image" | "video" | "raw";
  width?: number;
  height?: number;
};
