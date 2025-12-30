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
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SvgUploder from "../icons/Uploder";
import { DocumentFileType, Document } from "@/types/docs";
import { Id } from "../../../convex/_generated/dataModel";

interface DocumentModalProps {
  onSuccess?: () => void;
  onAddDocument?: (documents: Document) => void;
  defaultOrganizationId?: string;
  defaultCampaignId?: string;
}

const CtaProps = {
  text: "Ajouter un document",
  icon: <SvgPlus />,
};

export default function DocModal({ onAddDocument, onSuccess, defaultOrganizationId, defaultCampaignId }: DocumentModalProps) {
  const getSignature = useAction(api.actions.cloudinary.getUploadSignature);
  const createDocument = useMutation(api.mutations.documents.createDocument);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedOrgId, setSelectedOrgId] = useState<string>(
      defaultOrganizationId || ""
    );
    const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
      defaultCampaignId || ""
    );
  
    const organizations = useQuery(
      api.queries.organizations.getAllOrganizationsWithLastConnection
    );
  
    const campaigns = useQuery(
      api.queries.campaigns.getCampaignsByOrganization,
      selectedOrgId
        ? { organizationId: selectedOrgId as Id<"organizations"> }
        : "skip"
    );

  const formSchema = z.object({
    organizationId: z.string().optional(),
    campaignId: z.string().optional(),
    title: z.string().min(1, "Le titre est requis"),
  });

  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationId: "",
      campaignId: "",
      title: "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier.");
      return;
    }

    if (!onAddDocument) {
      if (!selectedOrgId || !selectedCampaignId) {
        toast.error("Veuillez sélectionner une organisation et une campagne.");
        return;
      }
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

    const resourceType: "image" | "video" | "raw" =
      tableType === "mp4" ? "video" : tableType === "mp3" ? "raw" : "image";
    const folder = `campaigns/documents`;

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

      const documentsData = {
        title: values.title,
        type: tableType,
        url: json.secure_url,
        publicId: json.public_id,
        resourceType,
      };

      if (onAddDocument) {
        onAddDocument({
                  ...documentsData,
                });
        toast.success("Document ajouté avec succès !");
      } else {
        await createDocument({
          ...documentsData,
          campaignId: selectedCampaignId as Id<"campaigns">,
          organizationId: selectedOrgId as Id<"organizations">,
        });
        toast.success("Document ajouté avec succès !");
      }

      setFile(null);
      form.reset();
      setIsOpen(false);
      if (onSuccess) onSuccess();
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'upload", {
        description: "Échec de l'enregistrement.",
      });
    } finally {
      setUploading(false);
      setIsSubmitting(false);
    }
  }

  const DocumentFormData = {
    title: "Ajouter un document",
    children: (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!defaultOrganizationId && !defaultCampaignId && !onAddDocument && (
                      <div className="flex gap-4">
                        <div className="w-1/2 space-y-2">
                          <FormLabel className="text-lg font-semibold">
                            Client
                          </FormLabel>
                          <Select
                            value={selectedOrgId}
                            onValueChange={(val) => {
                              setSelectedOrgId(val);
                              setSelectedCampaignId("");
                            }}
                          >
                            <SelectTrigger className="w-full text-base italic rounded-sm border border-[#A5A4BF] p-5 bg-white">
                              <SelectValue
                                placeholder={
                                  <span className="text-primary/50 italic">
                                    Sélectionnez le client
                                  </span>
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {organizations?.map((org) => (
                                <SelectItem
                                  key={org.organizationId}
                                  value={org.organizationId}
                                >
                                  {org.organizationName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
          
                        <div className="w-1/2 space-y-2">
                          <FormLabel className="text-lg font-semibold">
                            Campagne
                          </FormLabel>
                          <Select
                            value={selectedCampaignId}
                            onValueChange={setSelectedCampaignId}
                            disabled={!selectedOrgId}
                          >
                            <SelectTrigger className="w-full text-base italic rounded-sm border border-[#A5A4BF] p-5 bg-white">
                              <SelectValue
                                placeholder={
                                  <span className="text-primary/50 italic">
                                    Sélectionnez la campagne
                                  </span>
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {campaigns?.map((camp) => (
                                <SelectItem key={camp._id} value={camp._id}>
                                  {camp.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-lg font-semibold">
                  {" "}
                  Titre du document
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
      data={DocumentFormData}
      open={isOpen}
      onOpenChange={setIsOpen}
      preventAutoClose={true}
    />
  );
}
