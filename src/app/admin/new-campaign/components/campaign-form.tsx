"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import CtaButton from "@/components/cta-button";

// Convex
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

// Types
import { Media, MediaType } from "@/types/medias";
import { Invoice } from "@/types/invoices";
import { Document } from "@/types/docs";

// Sections
import SpaceOrganizations from "../_sections/spaceOrganizations";
import SpaceInfos from "../_sections/spaceInfos";
import SpaceBudget from "../_sections/spaceBudget";
import SpaceSteps from "../_sections/spaceSteps";
import SpaceTarget from "../_sections/spaceTargets";
import SpaceMedias from "../_sections/spaceMedias";
import SpaceDocuments from "../_sections/spaceDocuments";
import SpaceInvoices from "../_sections/spaceInvoices";

// ---------------- SCHEMA ----------------

const formSchema = z.object({
  organization: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  mediaTypes: z.array(z.string()).min(1),
  budgetTotal: z.number().nonnegative(),

  budgetMedia: z.array(
    z.object({
      mediaType: z.string().min(1),
      amount: z.number().nonnegative(),
      pourcent: z.string().min(1),
      period: z.object({
        from: z.date().nullable(),
        to: z.date().nullable(),
      }).refine((p) => p.from && p.to, {
        message: "La période est requise",
      }),
      title: z.string().min(1),
      details: z.string().min(1),
    })
  ),

  status: z.array(
    z.object({
      label: z.string().min(1),
      state: z.string().min(1),
      deadline: z.date().nullable(),
    })
  ).length(5),

  targetLine: z.array(
    z.object({
      target: z.string().min(1),
      csvFiles: z.string().min(1),
    })
  ).min(1),
});

// ---------------- DEFAULT VALUES ----------------

const defaultValues = {
  organization: "",
  title: "",
  subtitle: "",
  mediaTypes: [],
  budgetTotal: 0,
  budgetMedia: [
    {
      mediaType: "",
      amount: 0,
      pourcent: "",
      period: { from: null, to: null },
      title: "",
      details: "",
    },
  ],
  status: ["Brief","Création","Validation","Diffusion en cours","Bilan"].map(label => ({
    label,
    state: "",
    deadline: null,
  })),
  targetLine: [{ target: "", csvFiles: "" }],
};

export default function CampaignForm() {
  type FormValues = z.infer<typeof formSchema>;

  const router = useRouter();

  // Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Local states
  const [formMedias, setFormMedias] = useState<Media[]>([]);
  const [formInvoices, setFormInvoices] = useState<Invoice[]>([]);
  const [formDocuments, setFormDocuments] = useState<Document[]>([]);

  // Convex queries
  const organizations =
    useQuery(api.queries.organizations.getAllOrganizationsWithLastConnection) ?? [];

  const createCampaign = useMutation(api.mutations.campaigns.createCampaign);
  const createMedia = useMutation(api.mutations.medias.createMedia);
  const moveMediaToCampaign = useAction(api.actions.cloudinary.moveMediaToCampaign);
  const createInvoice = useMutation(api.mutations.invoices.createInvoice);
  const createDocument = useMutation(api.mutations.documents.createDocument);

  // Keep budgetMedia in sync with mediaTypes
  const mediaTypesWatch = form.watch("mediaTypes");

  useEffect(() => {
    const selected = mediaTypesWatch ?? [];
    const prev = form.getValues("budgetMedia") ?? [];

    const updated = selected.map((media) => {
      const existing = prev.find((b) => b.mediaType === media);
      return existing ?? {
        mediaType: media,
        amount: 0,
        pourcent: "",
        period: { from: null, to: null },
        title: "",
        details: "",
      };
    });

    form.setValue("budgetMedia", updated, { shouldValidate: true });
  }, [JSON.stringify(mediaTypesWatch)]);

  // ---------------- SUBMIT ----------------

  async function onSubmit(values: FormValues) {
    try {
      const startDates = values.budgetMedia
        .map((b) => b.period.from?.getTime())
        .filter((x): x is number => typeof x === "number");

      const endDates = values.budgetMedia
        .map((b) => b.period.to?.getTime())
        .filter((x): x is number => typeof x === "number");

      const startDate = startDates.length ? new Date(Math.min(...startDates)).toISOString() : new Date().toISOString();
      const endDate = endDates.length ? new Date(Math.max(...endDates)).toISOString() : new Date().toISOString();

      const campaignId: Id<"campaigns"> = await createCampaign({
        organizationId: values.organization as Id<"organizations">,
        title: values.title,
        subtitle: values.subtitle,
        mediaTypes: values.mediaTypes as MediaType[],
        startDate,
        endDate,
        totalBudget: values.budgetTotal,

        budgetMedia: values.budgetMedia.map((b) => ({
          type: b.mediaType as MediaType,
          amount: b.amount,
          pourcent: b.pourcent,
          periodFrom: b.period.from?.toISOString(),
          periodTo: b.period.to?.toISOString(),
          title: b.title,
          details: b.details,
        })),

        status: values.status.map((s, i) => ({
          id: i,
          label: s.label,
          state: s.state as any,
          deadline: s.deadline ? s.deadline.toISOString() : new Date().toISOString(),
        })),

        archived: false,
      });

      // Save medias
      await Promise.all(
        formMedias.map(async (m) => {
          if (!m.publicId || !m.resourceType || !m.mediaType) {
            throw new Error("Media is missing required fields");
          }
          const newPublicId = `campaigns/${campaignId}/medias/${m.publicId.split("/").pop()}`;
          const renamed = await moveMediaToCampaign({
            publicId: m.publicId,
            newPublicId,
            resourceType: m.resourceType,
          });

          await createMedia({
            title: m.title,
            url: renamed.secure_url,
            type: m.type,
            mediaTypes: [m.mediaType],
            publicId: newPublicId,
            resourceType: m.resourceType,
            width: renamed.width,
            height: renamed.height,
            campaignId,
          });
        })
      );

      // Save invoices
      await Promise.all(
        formInvoices.map(async (i) => {
          if (!i.publicId || !i.resourceType || !i.invoiceType) {
            throw new Error("Invoice is missing required fields");
          }
          const newPublicId = `campaigns/${campaignId}/invoices/${i.publicId.split("/").pop()}`;
          const renamed = await moveMediaToCampaign({
            publicId: i.publicId,
            newPublicId,
            resourceType: i.resourceType,
          });

          await createInvoice({
            title: i.title,
            url: renamed.secure_url,
            invoiceType: i.invoiceType,
            vendorName: i.vendorName ?? "",
            agencyInvoice: i.agencyInvoice ?? "",
            htprice: i.htprice,
            ttcprice: i.ttcprice,
            startDate: i.startDate,
            dueDate: i.dueDate,
            publicId: newPublicId,
            resourceType: i.resourceType,
            organizationId: values.organization as Id<"organizations">,
            campaignId,
          });
        })
      );

      // Save documents
      await Promise.all(
        formDocuments.map(async (d) => {
          if (!d.publicId || !d.resourceType || !d.type) {
            throw new Error("Document is missing required fields");
          }
          const newPublicId = `campaigns/${campaignId}/documents/${d.publicId.split("/").pop()}`;
          const renamed = await moveMediaToCampaign({
            publicId: d.publicId,
            newPublicId,
            resourceType: d.resourceType,
          });

          await createDocument({
            title: d.title,
            url: renamed.secure_url,
            type: d.type,
            publicId: newPublicId,
            resourceType: d.resourceType,
            campaignId,
            organizationId: values.organization as Id<"organizations">,
          });
        })
      );

      toast.success("Succès", { description: "La campagne a été enregistrée." });
      form.reset(defaultValues);
      router.push(`/admin/dashboard`);

    } catch (err) {
      toast.error("Erreur", { description: "Impossible d'enregistrer la campagne." });
    }
  }

  // ---------------- RENDER ----------------

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <SpaceOrganizations organizations={organizations} />

          <SpaceInfos />

          <SpaceBudget />

          <SpaceSteps />

          <SpaceTarget />

          <SpaceMedias
            formMedias={formMedias}
            setFormMedias={setFormMedias}
          />

          <SpaceDocuments
            formDocuments={formDocuments}
            setFormDocuments={setFormDocuments}
          />

          <SpaceInvoices
            formInvoices={formInvoices}
            setFormInvoices={setFormInvoices}
          />

          <div className="w-full flex justify-center">
            <CtaButton
              props={{
                text: "Enregistrer la campagne",
                onClick: form.handleSubmit(onSubmit),
              }}
              variant="submit"
            />
          </div>
        </form>
      </Form>
    </section>
  );
}
