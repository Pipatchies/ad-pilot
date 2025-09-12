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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SvgUploder from "./icons/Uploder";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import SvgCalendrier from "./icons/Calendrier";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Invoice } from "@/types/invoices";

const invoiceTypes = [
  { label: "Facture Agence", value: "agency" },
  { label: "Facture Régie", value: "vendor" },
];

interface InvoiceModalProps {
  onAddInvoice: (invoices: Invoice) => void;
}

const CtaProps = {
  text: "Ajouter une facture",
  icon: <SvgPlus />,
};

export default function InvoiceModal({ onAddInvoice }: InvoiceModalProps) {
  const getSignature = useAction(api.actions.cloudinary.getUploadSignature);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const formSchema = z.object({
    title: z.string().min(1, "Le numéro de facture est requis"),
    invoiceType: z.enum(["agency", "vendor"], {
      required_error: "Veuillez sélectionner un type de facture",
    }),
    agencyInvoice: z.string().optional(),
    vendorName: z.string().optional(),
    htprice: z
      .number({
        required_error: "Le montant HT est requis",
      })
      .nonnegative({ message: "Le montant HT doit être positif" }),
    ttcprice: z
      .number({
        required_error: "Le montant TTC est requis",
      })
      .nonnegative({ message: "Le montant TTC doit être positif" }),
    startDate: z
      .date({ required_error: "Date de facturation requise" })
      .nullable(),
    dueDate: z.date({ required_error: "Date d'échéance requise" }).nullable(),
  });

  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      invoiceType: undefined,
      agencyInvoice: "",
      vendorName: "",
      htprice: 0,
      ttcprice: 0,
      startDate: null,
      dueDate: null,
    },
  });

  const selectedInvoiceType = form.watch("invoiceType");

  async function onSubmit(values: FormValues) {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier.");
      return;
    }

    const folder = `campaigns/invoices`;

    setUploading(true);
    try {
      const resourceType = "raw" as const;

      const sig = await getSignature({ folder, resourceType });

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

      onAddInvoice({
        title: values.title,
        invoiceType: values.invoiceType,
        agencyInvoice: values.agencyInvoice,
        vendorName: values.vendorName,
        htprice: values.htprice,
        ttcprice: values.ttcprice,
        startDate: values.startDate
          ? values.startDate.toISOString()
          : new Date().toISOString(),
        dueDate: values.dueDate
          ? values.dueDate.toISOString()
          : new Date().toISOString(),
        url: json.secure_url,
        publicId: json.public_id,
        resourceType,
      });

      toast.success("Facture ajoutée avec succès !");
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
    title: "Ajouter une facture",
    children: (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-1/2">
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
            <FormField
              control={form.control}
              name="invoiceType"
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
                      {invoiceTypes.map((m) => (
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

          {selectedInvoiceType === "vendor" && (
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="agencyInvoice"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-lg font-semibold">
                      {" "}
                      Facture agence rattachée
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Renseignez le numéro"
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
                name="vendorName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-lg font-semibold">
                      {" "}
                      Nom de la régie
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Renseignez le nom de la régie"
                        className="!text-base md:text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="htprice"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel className="text-lg font-semibold">
                    {" "}
                    Montant HT
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Renseignez le montant en €"
                      className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
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
                  <FormLabel className="text-lg font-semibold">
                    {" "}
                    Montant TTC
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Renseignez le montant en €"
                      className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
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
                  <FormLabel className="text-lg font-semibold">
                    {" "}
                    Date de facturation
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full rounded-sm py-2 px-5 flex items-center justify-between",
                          "border",
                          field.value ? "text-primary" : "text-primary/50",
                          "border-[#A5A4BF] bg-white"
                        )}
                        aria-label="Choisir une date"
                      >
                        <span className="text-base italic">
                          {field.value
                            ? format(field.value, "dd/MM/yyyy", {
                                locale: fr,
                              })
                            : "Sélectionnez la date"}
                        </span>
                        <SvgCalendrier />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 text-primary rounded-sm shadow border-[#A5A4BF]"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={(d) => field.onChange(d || null)}
                        disabled={(date) => date < new Date("1900-01-01")}
                        defaultMonth={field.value ?? new Date()}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel className="text-lg font-semibold">
                    {" "}
                    Date d'échéance
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full rounded-sm py-2 px-5 flex items-center justify-between",
                          "border",
                          field.value ? "text-primary" : "text-primary/50",
                          "border-[#A5A4BF] bg-white"
                        )}
                        aria-label="Choisir une date"
                      >
                        <span className="text-base italic">
                          {field.value
                            ? format(field.value, "dd/MM/yyyy", {
                                locale: fr,
                              })
                            : "Sélectionnez la date"}
                        </span>
                        <SvgCalendrier />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 text-primary rounded-sm shadow border-[#A5A4BF]"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={(d) => field.onChange(d || null)}
                        disabled={(date) => date < new Date("1900-01-01")}
                        defaultMonth={field.value ?? new Date()}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormItem>
            <FormLabel className="text-lg font-semibold">
              Importer la facture
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  readOnly
                  value={file ? file.name : ""}
                  placeholder="Sélectionnez la facture"
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
