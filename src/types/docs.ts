import { Id } from "../../convex/_generated/dataModel";

export const TYPE_VALUES = ["jpg", "png", "pdf", "mp4", "mp3"] as const;
export type DocumentFileType = typeof TYPE_VALUES[number];

export type Document = {
  title: string;
  type: DocumentFileType;
  url?: string;
  publicId?: string;
  resourceType?: "image" | "video" | "raw";
  campaignId?: Id<"campaigns">;
  organizationId?: Id<"organizations">;
};

export type DocumentItem = {
  title: string;
  type: string;
};