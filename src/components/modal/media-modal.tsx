"use client";

import React, { useState } from "react";
import Modal from "@/components/modal/modal";
import SvgPlus from "@/components/icons/Plus";
import CtaButton from "@/components/cta-button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SvgUploder from "../icons/Uploder";
import {
  Media,
  MEDIA_TYPE_LABELS,
  MEDIA_TYPE_VALUES,
  MediaFileType,
} from "@/types/medias";

interface MediaModalProps {
  onAddMedia: (media: Media) => void;
}

const CtaProps = {
  text: "Ajouter un média",
  icon: <SvgPlus />,
};

const mediaTypes = MEDIA_TYPE_VALUES.map((value) => {
  if (!MEDIA_TYPE_LABELS) {
    return { value, label: value };
  }
  return {
    value,
    label: MEDIA_TYPE_LABELS[value],
  };
});

export default function MediaModal({ onAddMedia }: MediaModalProps) {
  const getSignature = useAction(api.actions.cloudinary.getUploadSignature);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    mediaType: z.enum(MEDIA_TYPE_VALUES, {
      errorMap: () => ({ message: "Veuillez sélectionner un type de média" }),
    }),
  });

  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      mediaType: undefined,
    },
  });

  async function onSubmit(values: FormValues) {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier.");
      return;
    }

    const ext = (file.name.split(".").pop() || "").toLowerCase();
    let tableType: MediaFileType | null = null;
    if (["jpg", "jpeg"].includes(ext)) tableType = "jpg";
    if (ext === "png") tableType = "png";
    if (ext === "pdf") tableType = "pdf";
    if (ext === "mp3") tableType = "mp3";
    if (ext === "mp4") tableType = "mp4";

    if (!tableType) {
      toast.error("Format non supporté. Autorisés : png, jpg, pdf, mp3, mp4.");
      return;
    }

    const resourceType =
      tableType === "mp4" ? "video" : tableType === "mp3" ? "raw" : "image";
    const folder = `campaigns/medias`;

    setUploading(true);
    setIsSubmitting(true);
    try {
      const sig = await getSignature({ folder, resourceType: resourceType });

      const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${sig.resourceType}/upload`;
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sig.apiKey);
      fd.append("timestamp", String(sig.timestamp));
      fd.append("upload_preset", sig.uploadPreset);
      fd.append("signature", sig.signature);
      fd.append("folder", sig.folder);

      const res = await fetch(endpoint, { method: "POST", body: fd });
      const json = await res.json();

      if (json.error) throw new Error(json.error?.message || "Upload failed");

      onAddMedia({
        title: values.title,
        url: json.secure_url,
        type: tableType,
        mediaTypes: [values.mediaType],
        publicId: json.public_id,
        resourceType,
        width: json.width,
        height: json.height,
      });

      toast.success("Média ajouté avec succès !");
      setFile(null);
      form.reset();
      setIsOpen(false);
    } catch {
      toast.error("Erreur lors de l'upload", {
        description: "Échec de l'enregistrement.",
      });
    } finally {
      setUploading(false);
      setIsSubmitting(false);
    }
  }

  const MediaFormData = {
    title: "Ajouter un média",
    children: (
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel className="text-lg font-semibold">
                    {" "}
                    Titre du média
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Renseignez le titre"
                      className="!text-base md:text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mediaType"
              render={({ field }) => (
                <FormItem className="flex-1 min-w-[170px]">
                  <FormLabel className="text-lg">Type de média</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full text-base italic rounded-sm border border-[#A5A4BF] p-5 bg-white">
                        <SelectValue
                          placeholder={
                            <span className="text-primary/50 italic">
                              Choisir le type
                            </span>
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full text-base italic rounded-sm border border-[#A5A4BF] text-primary text-base">
                      {mediaTypes.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormItem>
            <FormLabel className="text-lg font-semibold">
              Importer le média
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  readOnly
                  value={file ? file.name : ""}
                  placeholder="Sélectionnez le média"
                  className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12 cursor-pointer"
                  onClick={() =>
                    document.getElementById("hiddenMediaInput")?.click()
                  }
                />

                <SvgUploder
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() =>
                    document.getElementById("hiddenMediaInput")?.click()
                  }
                />

                <input
                  id="hiddenMediaInput"
                  type="file"
                  accept="image/*, application/pdf,video/mp4,audio/mpeg"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setFile(f);
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </form>
      </Form>
    ),
    footer: (
      <CtaButton
        props={{
          text: "Enregistrer",
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
          },
          disabled: uploading || isSubmitting,
          loading: isSubmitting,
        }}
        variant="submit"
      />
    ),
  };
  return (
    <Modal
      cta={CtaProps}
      data={MediaFormData}
      open={isOpen}
      onOpenChange={setIsOpen}
      preventAutoClose={true}
    />
  );
}
