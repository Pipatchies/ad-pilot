"use client";

import React, { useState } from "react";
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
import { useMutation, useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import Modal from "@/components/modal/modal";
import CtaButton from "../../cta-button";
import SvgCrayonBig from "../../icons/CrayonBig";
import SvgUploder from "@/components/icons/Uploder";

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
});

type UpdateDocumentModalProps = {
  documentId: Id<"documents">;
  defaultValues: {
    title: string;
  };
};

export default function UpdateDocumentModal({
  documentId,
  defaultValues,
}: UpdateDocumentModalProps) {
  const updateDocument = useMutation(
    api.mutations.documents.updateDocumentMetadata
  );
  const getSignature = useAction(api.actions.cloudinary.getUploadSignature);

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues.title,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUploading(true);
    setIsSubmitting(true);
    try {
      let url: string | undefined;
      let publicId: string | undefined;
      let resourceType: "raw" | undefined;
      let type: "pdf" | "png" | "jpg" | undefined;

      if (file) {
        const folder = `campaigns/documents`;
        const rType = "raw" as const;

        const sig = await getSignature({ folder, resourceType: rType });
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

        url = json.secure_url;
        publicId = json.public_id;
        resourceType = rType;

        // Simple extension detection for 'type' field
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext === "pdf") type = "pdf";
        else if (ext === "png") type = "png";
        else if (["jpg", "jpeg"].includes(ext || "")) type = "jpg";
        // Default fallbacks handled or ignore other types for now as per schema
      }

      await updateDocument({
        documentId,
        patch: {
          title: values.title,
          ...(url && { url }),
          ...(publicId && { publicId }),
          ...(resourceType && { resourceType }),
          ...(type && { type }),
        },
      });

      toast.success("Document mis à jour");
      setIsOpen(false);
      setFile(null);
    } catch {
      toast.error("Échec de la mise à jour");
    } finally {
      setUploading(false);
      setIsSubmitting(false);
    }
  }

  const modalData = {
    title: "Modifier le document",
    className: "!max-w-4xl",
    children: (
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="text-lg font-semibold">Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre du document" className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12 cursor-pointer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className="w-1/2">
                <FormLabel className="text-lg font-semibold">
                  Mettre à jour le fichier (Optionnel)
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      readOnly
                      value={file ? file.name : ""}
                      placeholder="Sélectionnez un nouveau fichier"
                      className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12 cursor-pointer"
                      onClick={() =>
                        document
                          .getElementById("updateDocumentFileInput")
                          ?.click()
                      }
                    />

                    <SvgUploder
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() =>
                        document
                          .getElementById("updateDocumentFileInput")
                          ?.click()
                      }
                    />

                    <input
                      id="updateDocumentFileInput"
                      type="file"
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
            </div>
          </form>
        </Form>
      </div>
    ),
    footer: (
      <CtaButton
        props={{
          text: "Mettre à jour",
          onClick: form.handleSubmit(onSubmit),
          disabled: uploading || isSubmitting,
          loading: isSubmitting,
        }}
        variant="submit"
      />
    ),
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={setIsOpen}
      preventAutoClose={true}
      variant="icon"
      cta={{ icon: <SvgCrayonBig className="cursor-pointer" /> }}
      data={modalData}
    />
  );
}
