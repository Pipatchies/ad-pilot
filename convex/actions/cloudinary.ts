"use node";
import { v } from "convex/values";
import crypto from "crypto";
import { action, internalAction } from "../_generated/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const getUploadSignature = action({
  args: {
    folder: v.string(),
    resourceType: v.optional(v.string()),
    publicId: v.optional(v.string()),
  },
  handler: async (_, args) => {
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME!;
    const api_key = process.env.CLOUDINARY_API_KEY!;
    const api_secret = process.env.CLOUDINARY_API_SECRET!;
    const upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET!;

    const timestamp = Math.floor(Date.now() / 1000);

    const params: Record<string, string | number> = {
      timestamp,
      upload_preset,
      folder: args.folder,
    };
    if (args.publicId) params.public_id = args.publicId;

    const toSign = Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&");

    const signature = crypto
      .createHash("sha1")
      .update(toSign + api_secret)
      .digest("hex");

    return {
      cloudName: cloud_name,
      apiKey: api_key,
      timestamp,
      signature,
      uploadPreset: upload_preset,
      folder: args.folder,
      resourceType: args.resourceType ?? "auto",
      publicId: args.publicId,
    };
  },
});

export const moveMediaToCampaign = action({
  args: {
    publicId: v.string(),
    newPublicId: v.string(),
    resourceType: v.string(),
  },
  handler: async (_ctx, { publicId, newPublicId, resourceType }) => {
    const res = await cloudinary.uploader.rename(publicId, newPublicId, {
      resource_type: resourceType,
      overwrite: true,
      invalidate: true,
    });
    return res;
  },
});

export const destroyMedia = internalAction({
  args: {
    publicId: v.string(),
    resourceType: v.string(),
  },
  handler: async (_ctx, { publicId, resourceType }) => {
    try {
      const res = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        invalidate: true,
      });
      return res;
    } catch (error) {
      console.error("Error destroying media in Cloudinary:", error);
      throw new Error("Cloudinary destroy failed");
    }
  },
});
