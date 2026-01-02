"use client";

import { useFormContext } from "react-hook-form";
import Typography from "@/components/typography";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SvgUploder from "@/components/icons/Uploder";
import React, { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { DocumentFileType } from "@/types/docs";

export default function SpaceDigital({ campaignId }: { campaignId?: string }) {
  const { control } = useFormContext();
  const getSignature = useAction(api.actions.cloudinary.getUploadSignature);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (file: File, onChange: (value: any) => void) => {
    try {
      setUploading(true);
      const ext = (file.name.split(".").pop() || "").toLowerCase();
      let tableType: DocumentFileType | null = null;
      if (["jpg", "jpeg"].includes(ext)) tableType = "jpg";
      if (ext === "png") tableType = "png";
      if (ext === "pdf") tableType = "pdf";

      if (!tableType) {
        toast.error("Format non supporté (JPG, PNG, PDF uniquement).");
        return;
      }

      const resourceType = "raw"; 
      const folder = campaignId
        ? `campaigns/${campaignId}/digital`
        : `campaigns/temp`;

      const sig = await getSignature({ folder, resourceType });
      const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`;

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sig.apiKey);
      fd.append("timestamp", String(sig.timestamp));
      fd.append("upload_preset", sig.uploadPreset);
      fd.append("signature", sig.signature);
      fd.append("folder", sig.folder);

      const res = await fetch(endpoint, { method: "POST", body: fd });
      const json = await res.json();

      if (json.error) throw new Error(json.error.message || "Upload failed");

      onChange({
        url: json.secure_url,
        publicId: json.public_id,
        resourceType,
        name: file.name,
      });

      toast.success("Fichier uploadé avec succès !");
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
      <CardHeader>
        <Typography variant="h2" className="mb-0">
          Analyse digitale
        </Typography>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <FormField
            control={control}
            name="digitalAnalysis"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-lg font-semibold mb-2">
                  Document de récap
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      readOnly
                      value={
                        field.value?.name ||
                        (typeof field.value === "string" ? field.value : "")
                      }
                      placeholder={
                        uploading ? "Upload en cours..." : "analyse.pdf"
                      }
                      className="!text-base md:text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12 bg-white cursor-pointer hover:bg-white"
                      onClick={() =>
                        !uploading &&
                        document.getElementById("hiddenDigitalInput")?.click()
                      }
                    />
                    <SvgUploder
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() =>
                        !uploading &&
                        document.getElementById("hiddenDigitalInput")?.click()
                      }
                    />
                    <input
                      id="hiddenDigitalInput"
                      type="file"
                      accept="application/pdf,image/png,image/jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        if (f) {
                          setFile(f);
                          handleUpload(f, field.onChange);
                        }
                      }}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
