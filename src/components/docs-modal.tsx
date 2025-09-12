"use client";

import React, { useState } from "react";
import Modal from "@/components/modal";
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
import SvgUploder from "./icons/Uploder";
import { DocumentFileType, Document } from "@/types/docs";


interface DocumentModalProps {
  onAddDocument: (documents: Document) => void;
}

const CtaProps = {
  text: "Ajouter un document",
  icon: <SvgPlus />,
};

export default function DocModal({ onAddDocument }: DocumentModalProps) {
  const getSignature = useAction(api.actions.cloudinary.getUploadSignature);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const formSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
  });

  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (!file) {
          toast.error("Veuillez sélectionner un fichier.");
          return;
        }
    
        const ext = (file.name.split(".").pop() || "").toLowerCase();
        let tableType: DocumentFileType | null = null;
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
        const folder = `campaigns/documents`;
    
        setUploading(true);
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

      onAddDocument({
        title: values.title,
        type: tableType,
        url: json.secure_url,
        publicId: json.public_id,
        resourceType,
      });

      toast.success("Document ajouté avec succès !");
      setFile(null);
      form.reset();
    } catch {
      toast.error("Erreur lors de l'upload", {
        description: "Échec de l'enregistrement.",
      });
    } finally {
      setUploading(false);
    }
  }

  const InvoiceFormData = {
    title: "Ajouter un document",
    children: (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-lg font-semibold">
                    {" "}
                    Numéro de facture
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

          <FormItem>
            <FormLabel className="text-lg font-semibold">
              Importer le document
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  readOnly
                  value={file ? file.name : ""}
                  placeholder="Sélectionnez le document"
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
                  accept="application/pdf"
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
          onClick: form.handleSubmit(onSubmit),
          disabled: uploading,
        }}
        variant="submit"
      />
    ),
  };
  return <Modal cta={CtaProps} data={InvoiceFormData} />;
}
