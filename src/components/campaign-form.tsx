"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import CtaButton from "@/components/cta-button";

// Convex
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Types
import { Media, MediaType } from "@/types/medias";
import { Invoice } from "@/types/invoices";
import { Document } from "@/types/docs";

// Sections
import SpaceOrganizations from "../app/admin/new-campaign/_sections/spaceOrganizations";
import SpaceInfos from "../app/admin/new-campaign/_sections/spaceInfos";
import SpaceBudget from "../app/admin/new-campaign/_sections/spaceBudget";
import SpaceSteps from "../app/admin/new-campaign/_sections/spaceSteps";
import SpaceTarget from "../app/admin/new-campaign/_sections/spaceTargets";
import SpaceMedias from "../app/admin/new-campaign/_sections/spaceMedias";
import SpaceDocuments from "../app/admin/new-campaign/_sections/spaceDocuments";
import SpaceInvoices from "../app/admin/new-campaign/_sections/spaceInvoices";
import SpaceCampaignReport from "@/app/admin/new-campaign/_sections/spaceCampaignReport";

// ---------------- SCHEMA ----------------

const formSchema = z.object({
  organization: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  mediaTypes: z.array(z.string()).min(1),
  tvTypes: z.array(z.string()).optional(),
  radioTypes: z.array(z.string()).optional(),
  displayTypes: z.string().optional(),
  budgetTotal: z.number().nonnegative(),

  budgetMedia: z.array(
    z.object({
      type: z.string().min(1),
      amount: z.number().nonnegative(),
      pourcent: z.number().or(z.string()),
      period: z
        .object({
          from: z.date().nullable(),
          to: z.date().nullable(),
        })
        .refine((p) => p.from && p.to, {
          message: "La période est requise",
        }),
      title: z.string().min(1),
      details: z.string().min(1),
    })
  ),

  status: z
    .array(
      z.object({
        label: z.string().min(1),
        state: z.string().min(1),
        deadline: z.date().nullable(),
      })
    )
    .length(5),

  targetLine: z
    .array(
      z.object({
        target: z.string().min(1),
        csvFiles: z.string().min(1),
      })
    )
    .min(1),

  report: z
    .object({
      status: z.enum(["current", "archived"]).optional(),
      document: z.string().optional(),
      kpi: z
        .array(
          z.object({
            icon: z.string(),
            title: z.string(),
            info: z.string(),
          })
        )
        .optional(),
    })
    .optional(),
});

// ---------------- DEFAULT VALUES ----------------

const defaultValues = {
  organization: "",
  title: "",
  subtitle: "",
  mediaTypes: [],
  tvTypes: [],
  radioTypes: [],
  displayTypes: "",
  budgetTotal: 0,
  budgetMedia: [
    {
      type: "",
      amount: 0,
      pourcent: 0,
      period: { from: null, to: null },
      title: "",
      details: "",
    },
  ],
  status: [
    "Brief",
    "Création",
    "Validation",
    "Diffusion en cours",
    "Bilan",
  ].map((label) => ({
    label,
    state: "",
    deadline: null,
  })),
  targetLine: [{ target: "", csvFiles: "" }],
  report: {
    status: undefined,
    document: "",
    kpi: [],
  },
};

export default function CampaignForm({
  campaignId,
}: {
  campaignId?: Id<"campaigns">;
}) {
  type FormValues = z.infer<typeof formSchema>;

  const router = useRouter();

  // Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Local states for uploaded files
  const [formMedias, setFormMedias] = useState<Media[]>([]);
  const [formInvoices, setFormInvoices] = useState<Invoice[]>([]);
  const [formDocuments, setFormDocuments] = useState<Document[]>([]);

  // Convex queries
  const organizations =
    useQuery(api.queries.organizations.getAllOrganizationsWithLastConnection) ??
    [];

  const existingCampaign = useQuery(
    api.queries.campaigns.getCampaignById,
    campaignId ? { campaignId } : "skip"
  );

  const existingMedias = useQuery(
    api.queries.medias.getMediaFilesByCampaign,
    campaignId ? { campaignId } : "skip"
  );

  const existingInvoices = useQuery(
    api.queries.invoices.getInvoicesByCampaign,
    campaignId ? { campaignId } : "skip"
  );

  const existingDocuments = useQuery(
    api.queries.documents.getDocumentsByCampaign,
    campaignId ? { campaignId } : "skip"
  );

  // Convex mutations
  const createCampaign = useMutation(api.mutations.campaigns.createCampaign);
  const updateCampaign = useMutation(api.mutations.campaigns.updateCampaign);
  const createMedia = useMutation(api.mutations.medias.createMedia);
  const createInvoice = useMutation(api.mutations.invoices.createInvoice);
  const createDocument = useMutation(api.mutations.documents.createDocument);

  // Convex actions
  const moveMediaToCampaign = useAction(
    api.actions.cloudinary.moveMediaToCampaign
  );

  // When editing → reset form with existing values
  useEffect(() => {
    if (!existingCampaign) return;

    form.reset({
      organization: existingCampaign.organizationId,
      title: existingCampaign.title,
      subtitle: existingCampaign.subtitle,
      mediaTypes: existingCampaign.mediaTypes,
      tvTypes: existingCampaign.tvTypes ?? [],
      radioTypes: existingCampaign.radioTypes ?? [],
      displayTypes: existingCampaign.displayTypes ?? "",
      budgetTotal: existingCampaign.totalBudget,
      budgetMedia: existingCampaign.budgetMedia.map((b) => ({
        type: b.type as MediaType,
        amount: b.amount,
        pourcent: b.pourcent,
        period: {
          from: b.periodFrom ? new Date(b.periodFrom) : null,
          to: b.periodTo ? new Date(b.periodTo) : null,
        },
        title: b.title,
        details: b.details,
      })),
      status: existingCampaign.status.map((s) => ({
        label: s.label,
        state: s.state as any,
        deadline: s.deadline ? new Date(s.deadline) : null,
      })),
      report: existingCampaign.report
        ? {
            status: existingCampaign.report.status,
            document: existingCampaign.report.document ?? "",
            kpi: existingCampaign.report.kpi ?? [],
          }
        : undefined,
    });
  }, [existingCampaign, form]);

  useEffect(() => {
    if (!existingMedias) return;
    setFormMedias(existingMedias);
  }, [existingMedias]);

  useEffect(() => {
    if (!existingInvoices) return;
    setFormInvoices(existingInvoices);
  }, [existingInvoices]);

  useEffect(() => {
    if (!existingDocuments) return;
    setFormDocuments(existingDocuments);
  }, [existingDocuments]);

  // Keep budgetMedia in sync with mediaTypes
  const mediaTypesWatch = form.watch("mediaTypes");

  const mediaTypesString = JSON.stringify(mediaTypesWatch);

  useEffect(() => {
    const selected = mediaTypesWatch ?? [];
    const prev = form.getValues("budgetMedia") ?? [];

    const updated = selected.map((media) => {
      const existing = prev.find((b) => b.type === media);
      return (
        existing ?? {
          type: media,
          amount: 0,
          pourcent: "",
          period: { from: null, to: null },
          title: "",
          details: "",
        }
      );
    });

    form.setValue("budgetMedia", updated, { shouldValidate: true });
  }, [mediaTypesString, form, mediaTypesWatch]);

  // ---------------- SUBMIT ----------------

  async function onSubmit(values: FormValues) {
    try {
      const startDates = values.budgetMedia
        .map((b) => b.period.from?.getTime())
        .filter((x): x is number => typeof x === "number");

      const endDates = values.budgetMedia
        .map((b) => b.period.to?.getTime())
        .filter((x): x is number => typeof x === "number");

      const startDate = startDates.length
        ? new Date(Math.min(...startDates)).toISOString()
        : new Date().toISOString();
      const endDate = endDates.length
        ? new Date(Math.max(...endDates)).toISOString()
        : new Date().toISOString();

      const campaignId: Id<"campaigns"> = await createCampaign({
        organizationId: values.organization as Id<"organizations">,
        title: values.title,
        subtitle: values.subtitle,
        mediaTypes: values.mediaTypes as MediaType[],
        tvTypes: values.tvTypes,
        radioTypes: values.radioTypes,
        displayTypes: values.displayTypes,
        startDate,
        endDate,
        totalBudget: values.budgetTotal,

        budgetMedia: values.budgetMedia.map((b) => ({
          type: b.type as MediaType,
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
          deadline: s.deadline
            ? s.deadline.toISOString()
            : new Date().toISOString(),
        })),

        archived: false,
      });

      // Save medias
      await Promise.all(
        formMedias.map(async (m) => {
          if (!m.publicId || !m.resourceType || !m.mediaTypes) {
            throw new Error("Media is missing required fields");
          }
          const newPublicId = `campaigns/${campaignId}/medias/${m.publicId
            .split("/")
            .pop()}`;
          const renamed = await moveMediaToCampaign({
            publicId: m.publicId,
            newPublicId,
            resourceType: m.resourceType,
          });

          await createMedia({
            title: m.title,
            url: renamed.secure_url,
            type: m.type,
            mediaTypes: m.mediaTypes,
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
          const newPublicId = `campaigns/${campaignId}/invoices/${i.publicId
            .split("/")
            .pop()}`;
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
          const newPublicId = `campaigns/${campaignId}/documents/${d.publicId
            .split("/")
            .pop()}`;
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

      toast.success("Succès", {
        description: "La campagne a été enregistrée.",
      });
      form.reset(defaultValues);
      router.push(`/admin/dashboard`);
    } catch (_err) {
      toast.error("Erreur", {
        description: "Impossible d'enregistrer la campagne.",
      });
    }
  }

  // ---------------- UPDATE ----------------

  async function onUpdate(values: FormValues) {
    try {
      if (!campaignId) return;

      await updateCampaign({
        campaignId,
        patch: {
          organizationId: values.organization as Id<"organizations">,
          title: values.title,
          subtitle: values.subtitle,
          mediaTypes: values.mediaTypes as MediaType[],
          tvTypes: values.tvTypes,
          radioTypes: values.radioTypes,
          displayTypes: values.displayTypes,
          totalBudget: values.budgetTotal,
          budgetMedia: values.budgetMedia.map((b) => ({
            type: b.type as MediaType,
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
            state: s.state as "completed" | "current" | "upcoming",
            deadline: s.deadline
              ? s.deadline.toISOString()
              : new Date().toISOString(),
          })),
          report: values.report
            ? {
                status: values.report.status,
                document: values.report.document ?? "",
                kpi: values.report.kpi ?? [],
              }
            : undefined,
          archived: values.report?.status === "archived",
        },
      });

      // Save NEW medias
      const mediasToSave = formMedias.filter(
        (m) =>
          m.publicId &&
          !existingMedias?.some((em) => em.publicId === m.publicId)
      );

      await Promise.all(
        mediasToSave.map(async (m) => {
          if (!m.publicId || !m.resourceType || !m.mediaTypes) return;

          const newPublicId = `campaigns/${campaignId}/medias/${m.publicId
            .split("/")
            .pop()}`;
          const renamed = await moveMediaToCampaign({
            publicId: m.publicId,
            newPublicId,
            resourceType: m.resourceType,
          });

          await createMedia({
            title: m.title,
            url: renamed.secure_url,
            type: m.type,
            mediaTypes: m.mediaTypes,
            publicId: newPublicId,
            resourceType: m.resourceType,
            width: renamed.width,
            height: renamed.height,
            campaignId,
          });
        })
      );

      // Save NEW invoices
      const invoicesToSave = formInvoices.filter(
        (i) =>
          i.publicId &&
          !existingInvoices?.some((ei) => ei.publicId === i.publicId)
      );
      await Promise.all(
        invoicesToSave.map(async (i) => {
          if (!i.publicId || !i.resourceType || !i.invoiceType) return;

          const newPublicId = `campaigns/${campaignId}/invoices/${i.publicId
            .split("/")
            .pop()}`;
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

      // Save NEW documents
      const docsToSave = formDocuments.filter(
        (d) =>
          d.publicId &&
          !existingDocuments?.some((ed) => ed.publicId === d.publicId)
      );
      await Promise.all(
        docsToSave.map(async (d) => {
          if (!d.publicId || !d.resourceType || !d.type) return;

          const newPublicId = `campaigns/${campaignId}/documents/${d.publicId
            .split("/")
            .pop()}`;
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

      toast.success("Campagne mise à jour !");
      router.push(`/admin/campaigns/${campaignId}`);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour.");
    }
  }

  // ---------------- RENDER ----------------

  return (
    <section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(campaignId ? onUpdate : onSubmit)}
          className="space-y-6"
        >
          <SpaceOrganizations organizations={organizations} />

          <SpaceInfos />

          <SpaceBudget />

          <SpaceSteps />

          <SpaceTarget />

          <SpaceMedias formMedias={formMedias} setFormMedias={setFormMedias} />

          <SpaceDocuments
            formDocuments={formDocuments}
            setFormDocuments={setFormDocuments}
          />

          <SpaceInvoices
            formInvoices={formInvoices}
            setFormInvoices={setFormInvoices}
          />

          {campaignId && <SpaceCampaignReport campaignId={campaignId} />}

          <div className="w-full flex justify-center">
            <CtaButton
              props={{
                text: campaignId
                  ? "Enregistrer les modifications"
                  : "Enregistrer la campagne",
                onClick: form.handleSubmit(campaignId ? onUpdate : onSubmit),
              }}
              variant="submit"
            />
          </div>
        </form>
      </Form>
    </section>
  );
}
