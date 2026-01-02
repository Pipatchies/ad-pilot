"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import Typography from "@/components/typography";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SvgPlus from "@/components/icons/Plus";
import SvgUploder from "@/components/icons/Uploder";
import React, { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { DocumentFileType } from "@/types/docs";

export default function SpaceReport({ campaignId }: { campaignId?: string }) {
  const { control } = useFormContext();
  const getSignature = useAction(api.actions.cloudinary.getUploadSignature);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (
    file: File,
    onChange: (value: string) => void
  ) => {
    try {
      setUploading(true);
      const ext = (file.name.split(".").pop() || "").toLowerCase();
      let tableType: DocumentFileType | null = null;
      if (["jpg", "jpeg"].includes(ext)) tableType = "jpg";
      if (ext === "png") tableType = "png";
      if (ext === "pdf") tableType = "pdf";
      if (ext === "mp3") tableType = "mp3";
      if (ext === "mp4") tableType = "mp4";

      if (!tableType) {
        toast.error("Format non supporté.");
        return;
      }

      const resourceType =
        tableType === "mp4" ? "video" : tableType === "mp3" ? "raw" : "image";

      const folder = `campaigns/${campaignId}/reports`;

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

      onChange(json.secure_url);
      toast.success("Fichier uploadé avec succès !");
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "report.kpi",
  });

  if (!campaignId) return null;

  return (
    <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
      <CardHeader>
        <Typography variant="h2" className="mb-0">
          Bilan
        </Typography>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ====== LIGNE 1 : STATUT & DOCUMENT ====== */}
        <div className="flex flex-wrap gap-4">
          {/* --- Statut --- */}
          <FormField
            control={control}
            name="report.status"
            render={({ field }) => (
              <FormItem className="w-1/3">
                <FormLabel className="text-lg">État de la campagne</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger className="w-full text-base rounded-sm border border-[#A5A4BF] p-5 bg-white cursor-pointer hover:bg-white">
                      <SelectValue
                        placeholder={
                          <span className="text-primary/50 italic">
                            Sélectionnez l'état de l'étape
                          </span>
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="text-base border border-[#A5A4BF]">
                    <SelectItem value="current">En cours</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- Document recap --- */}
          <FormField
            control={control}
            name="report.document"
            render={({ field }) => (
              <FormItem className="w-1/3">
                <FormLabel className="text-lg">Document de récap</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      readOnly
                      value={
                        field.value
                          ? typeof field.value === "string"
                            ? field.value
                            : field.value.name
                          : ""
                      }
                      placeholder="Importer le fichier PDF"
                      className="!text-base md:text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12 bg-white cursor-pointer hover:bg-white"
                      onClick={() =>
                        document.getElementById("hiddenDocumentInput")?.click()
                      }
                    />
                    <SvgUploder
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() =>
                        document.getElementById("hiddenDocumentInput")?.click()
                      }
                    />
                    <input
                      id="hiddenDocumentInput"
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ====== TITRE DES COLONNES KPI ====== */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 mb-2">
            <div className="flex-1 min-w-[170px] text-lg">Icône KPI</div>
            <div className="flex-1 min-w-[170px] text-lg">Titre KPI</div>
            <div className="flex-1 min-w-[170px] text-lg">Info KPI</div>
          </div>

          {/* ====== LIGNES KPI ====== */}
          {fields.map((row, index) => (
            <div key={row.id} className="flex flex-row flex-nowrap gap-2 mb-2">
              {/* ICON */}
              <FormField
                control={control}
                name={`report.kpi.${index}.icon`}
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[170px]">
                    <FormControl>
                      <div className="relative">
                        <Input
                          readOnly
                          value={
                            field.value
                              ? typeof field.value === "string"
                                ? field.value
                                : field.value.name
                              : ""
                          }
                          placeholder="Icône"
                          className="!text-base md:text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12 bg-white cursor-pointer hover:bg-white"
                          onClick={() =>
                            document
                              .getElementById(`hiddenLogoInput-${index}`)
                              ?.click()
                          }
                        />
                        <SvgUploder
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                          onClick={() =>
                            document
                              .getElementById(`hiddenLogoInput-${index}`)
                              ?.click()
                          }
                        />
                        <input
                          id={`hiddenLogoInput-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            if (f) {
                              setFile(f); // Note: setFile overrides the main file state but it's local only for potential display? logic. Actually handleUpload uses passed file arg.
                              handleUpload(f, field.onChange);
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TITLE */}
              <FormField
                control={control}
                name={`report.kpi.${index}.title`}
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[170px]">
                    <FormControl>
                      <Input
                        placeholder="Renseignez titre KPI"
                        className="w-full !text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* INFO */}
              <FormField
                control={control}
                name={`report.kpi.${index}.info`}
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[170px]">
                    <FormControl>
                      <Input
                        placeholder="Renseignez info KPI"
                        className="w-full !text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          {/* ====== BOUTONS ADD / REMOVE KPI ====== */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="ghost"
              className="px-4 py-2 font-semibold cursor-pointer underline"
              onClick={() => append({ icon: "", title: "", info: "" })}
            >
              Ajouter <SvgPlus />
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="px-4 py-2 font-semibold cursor-pointer"
              onClick={() => remove(fields.length - 1)}
              disabled={fields.length === 0}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
