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
import SvgUploder from "@/components/icons/Uploder";
import Modal from "@/components/modal/modal";
import CtaButton from "../../cta-button";
import SvgCrayonBig from "../../icons/CrayonBig";

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  htprice: z.coerce.number().min(0, "Le montant HT doit être positif"),
  ttcprice: z.coerce.number().min(0, "Le montant TTC doit être positif"),
  startDate: z.string().min(1, "La date est requise"),
  dueDate: z.string().min(1, "L'échéance est requise"),
});

type UpdateInvoiceModalProps = {
  invoiceId: Id<"invoices">;
  defaultValues: {
    title: string;
    htprice: number;
    ttcprice: number;
    startDate: string;
    dueDate: string;
  };
};

export default function UpdateInvoiceModal({
  invoiceId,
  defaultValues,
}: UpdateInvoiceModalProps) {
  const updateInvoice = useMutation(api.mutations.invoices.updateInvoice);
  const getSignature = useAction(api.actions.cloudinary.getUploadSignature);

  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues.title,
      htprice: defaultValues.htprice,
      ttcprice: defaultValues.ttcprice,
      startDate: defaultValues.startDate
        ? new Date(defaultValues.startDate).toISOString().split("T")[0]
        : "",
      dueDate: defaultValues.dueDate
        ? new Date(defaultValues.dueDate).toISOString().split("T")[0]
        : "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUploading(true);
    setIsSubmitting(true);
    try {
      let url: string | undefined;
      let publicId: string | undefined;
      let resourceType: "raw" | undefined;

      if (file) {
        const folder = `campaigns/invoices`;
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
      }

      await updateInvoice({
        invoiceId,
        patch: {
          title: values.title,
          htprice: values.htprice,
          ttcprice: values.ttcprice,
          startDate: values.startDate,
          dueDate: values.dueDate,
          ...(url && { url }),
          ...(publicId && { publicId }),
          ...(resourceType && { resourceType }),
        },
      });

      toast.success("Facture mise à jour");
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
    title: "Modifier la facture",
    className: "!max-w-4xl",
    children: (
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de la facture" className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12 cursor-pointer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="htprice"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="text-lg font-semibold">Montant HT</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12 cursor-pointer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ttcprice"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="text-lg font-semibold">Montant TTC</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12 cursor-pointer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="text-lg font-semibold">Date de facturation</FormLabel>
                    <FormControl>
                      <Input type="date" className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12 cursor-pointer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="text-lg font-semibold">Date d'échéance</FormLabel>
                    <FormControl>
                      <Input type="date" className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12 cursor-pointer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormItem>
              <FormLabel className="text-lg font-semibold">
                Mettre à jour le fichier
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    readOnly
                    value={file ? file.name : ""}
                    placeholder="Sélectionnez un nouveau fichier"
                    className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12 cursor-pointer"
                    onClick={() =>
                      document.getElementById("updateInvoiceFileInput")?.click()
                    }
                  />

                  <SvgUploder
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() =>
                      document.getElementById("updateInvoiceFileInput")?.click()
                    }
                  />

                  <input
                    id="updateInvoiceFileInput"
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
