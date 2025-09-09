"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import SvgCalendrier from "@/components/icons/Calendrier";
import SvgSmallDown from "@/components/icons/SmallDown";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import Typography from "@/components/typography";
import { useFieldArray } from "react-hook-form";
import SvgPlus from "@/components/icons/Plus";
import SvgUploder from "@/components/icons/Uploder";
import CtaButton from "@/components/cta-button";
import { Button } from "@/components/ui/button";
import DocumentsTable from "@/components/documents-table";
import InvoicesTable from "@/components/invoices-table";
import { Id } from "../../../../../convex/_generated/dataModel";
import MediaModal from "@/components/media-modal";
import DetailsCard from "@/components/details-card";
import { Media, MediaType } from "@/types/medias";

// ---------------- CONFIG ----------------

const mediaTypes = [
  { label: "Digital", value: "digital" },
  { label: "TV", value: "tv" },
  { label: "Affichage", value: "ooh" },
  { label: "Radio", value: "radio" },
  { label: "Cinéma", value: "cinema" },
  { label: "Presse", value: "press" },
];

const state = [
  { label: "En cours", value: "current" },
  { label: "Terminé", value: "completed" },
  { label: "En attente", value: "upcoming" },
];

type StatusState = "completed" | "current" | "upcoming";

// const stateReport = [
//   { label: "Terminé", value: "completed" },
//   { label: "Archivée", value: "archived" },
// ];

const ctaProps = [
  { text: "Ajouter un média", url: "#", target: "self" },
  { text: "Ajouter un document", url: "#", target: "self" },
  { text: "Ajouter une facture", url: "#", target: "self" },
  { text: "Enregistrer la campagne", url: "#", target: "self" },
];

// ---------------- SCHEMA ----------------

const formSchema = z.object({
  organization: z.string().min(1, { message: "L'organisation est requise" }),
  title: z.string().min(1, { message: "Le titre est requis" }),
  subtitle: z.string().min(1, { message: "Le sous-titre est requis" }),
  mediaTypes: z.array(z.string()).min(1, {
    message: "Veuillez sélectionner au moins un média",
  }),
  budgetTotal: z.number().nonnegative({
    message: "Le budget total doit être positif",
  }),
  budgetMedia: z
    .array(
      z.object({
        mediaType: z
          .string()
          .min(1, { message: "Veuillez sélectionner un type de média" }),
        amount: z.number().nonnegative({
          message: "Le montant doit être positif",
        }),
        pourcent: z.string().min(1, { message: "La part est requise" }),
        // startDate: z.date({ required_error: "La date est requise" }),
        title: z.string().min(1, { message: "Le titre est requis" }),
        details: z.string().min(1, { message: "Le détail est requis" }),
      })
    )
    .min(1, { message: "Veuillez ajouter au moins un budget média" }),
  status: z
    .array(
      z.object({
        label: z.string().min(1, { message: "Le label est requis" }),
        state: z.string().min(1, { message: "L'état est requis" }),
        deadline: z.date({ required_error: "La date est requise" }).nullable(),
      })
    )
    .length(5, { message: "Il doit y avoir exactement 5 étapes" })
    .superRefine((steps, ctx) => {
  for (let i = 1; i < steps.length; i++) {
    if (steps[i].deadline && steps[i - 1].deadline && 
        (steps[i].deadline as Date) <= (steps[i - 1].deadline as Date)) {
      ctx.addIssue({
        code: "custom",
        message: "La date doit être supérieure à celle de l'étape précédente",
        path: [i, "deadline"],
      });
    }
  }
}),
  diffusionLines: z
    .array(
      z.object({
        media: z.string().min(1, { message: "Le média est requis" }),
        startDate: z.date().nullable().optional(),
        endDate: z.date().nullable().optional(),
      })
    )
    .optional()
    .superRefine((lines, ctx) => {
      (lines ?? []).forEach((line, i) => {
        if (!line.startDate) {
          ctx.addIssue({
            code: "custom",
            message: "La date de début est requise",
            path: [i, "startDate"],
          });
        }
        if (!line.endDate) {
          ctx.addIssue({
            code: "custom",
            message: "La date de fin est requise",
            path: [i, "endDate"],
          });
        }

        if (line.startDate && line.endDate && line.endDate <= line.startDate) {
          ctx.addIssue({
            code: "custom",
            message: "La date de fin doit être postérieure à la date de début",
            path: [i, "endDate"],
          });
        }
      });
    }),
  targetLine: z
    .array(
      z.object({
        target: z.string().min(1, { message: "La cible est requise" }),
        csvFiles: z.string().min(1, { message: "Le fichier CSV est requis" }),
      })
    )
    .min(1, { message: "Veuillez définir au moins une cible" }),
  // statusReport: z
  //   .string()
  //   .min(1, { message: "Veuillez sélectionner l'état de la campagne" }),
  // documentReport: z
  //   .string()
  //   .min(1, { message: "Veuillez importer un document de récap" }),
  // kpiLines: z
  //   .array(
  //     z.object({
  //       icon: z.string().min(1, { message: "L'icône est requise" }),
  //       title: z.string().min(1, { message: "Le titre est requis" }),
  //       info: z.string().min(1, { message: "L'information est requise" }),
  //     })
  //   )
  //   .min(1, { message: "Veuillez définir au moins un KPI" }),
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
          // startDate: undefined,
          title: "",
          details: "",
        },
      ],
      status: Array.from({ length: 5 }, () => ({
        label: "",
        state: "",
        deadline: null,
      })),
      diffusionLines: [],
      targetLine: [
        {
          target: "",
          csvFiles: "",
        },
      ],
      // statusReport: "",
      // documentReport: "",
      // kpiLines: [
      //   {
      //     icon: "",
      //     title: "",
      //     info: "",
      //   },
      // ],
    };

export default function CampaignForm() {
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [formMedias, setFormMedias] = useState<Media[]>([]);

  const organizations =
    useQuery(api.queries.organizations.getAllOrganizationsWithLastConnection) ??
    [];
  const createCampaign = useMutation(api.mutations.campaigns.createCampaign);
  const createMedia = useMutation(api.mutations.medias.createMedia);
  const moveMediaToCampaign = useAction(
    api.actions.cloudinary.moveMediaToCampaign
  );

  const {
    fields: budgetFields,
    append: appendBudget,
    remove: removeBudget,
  } = useFieldArray({
    control: form.control,
    name: "budgetMedia",
  });

  const { fields: diffusionFields, replace: replaceDiffusions } = useFieldArray(
    {
      control: form.control,
      name: "diffusionLines",
    }
  );

  const {
    fields: targetFields,
    append: appendTarget,
    remove: removeTarget,
  } = useFieldArray({
    control: form.control,
    name: "targetLine",
  });

  // const {
  //   fields: kpiFields,
  //   append: appendKpi,
  //   remove: removeKpi,
  // } = useFieldArray({
  //   control: form.control,
  //   name: "kpiLines",
  // });

  const budgetWatch = form.watch("budgetMedia");

  useEffect(() => {
    const seen = new Set<string>();
    const uniqueMedias = (budgetWatch ?? [])
      .map((b) => b.mediaType)
      .filter((m) => {
        if (!m) return false;
        if (seen.has(m)) return false;
        seen.add(m);
        return true;
      });

    if (uniqueMedias.length === 0) {
      if (form.getValues("diffusionLines")?.length) {
        replaceDiffusions([]);
      }
      return;
    }

    const current = form.getValues("diffusionLines") ?? [];
    const byMedia = new Map(current.map((d) => [d.media, d]));

    const next = uniqueMedias.map((m) => {
      const prev = byMedia.get(m);

      return {
        media: m,
        startDate: prev?.startDate ?? null,
        endDate: prev?.endDate ?? null,
      };
    });

    const same =
      current.length === next.length &&
      current.every(
        (c, i) =>
          c.media === next[i].media &&
          (c.startDate?.getTime?.() ?? null) ===
            (next[i].startDate?.getTime?.() ?? null) &&
          (c.endDate?.getTime?.() ?? null) ===
            (next[i].endDate?.getTime?.() ?? null)
      );

    if (!same) {
      replaceDiffusions(next);
    }
  }, [JSON.stringify(budgetWatch), replaceDiffusions, form]);

  async function onSubmit(values: FormValues) {
    try {
      const allStarts =
        values.diffusionLines?.map((d) => d.startDate!.getTime()) ?? [];
      const allEnds =
        values.diffusionLines?.map((d) => d.endDate!.getTime()) ?? [];

      const startDate = allStarts.length
        ? new Date(Math.min(...allStarts)).toISOString()
        : new Date().toISOString();

      const endDate = allEnds.length
        ? new Date(Math.max(...allEnds)).toISOString()
        : new Date().toISOString();

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
          // startDate: b.startDate.toISOString(),
          title: b.title,
          details: b.details,
        })),

        status: values.status.map((s, i) => ({
          id: i,
          label: s.label,
          state: s.state as StatusState,
          deadline: s.deadline ? s.deadline.toISOString() : new Date().toISOString(),
        })),

        diffusions: (values.diffusionLines ?? []).map((d) => ({
          mediaType: d.media as MediaType,
          startDate: d.startDate!.toISOString(),
          endDate: d.endDate!.toISOString(),
        })),

        // digitalReportUrl: "",

        // report: {
        //   status: values.statusReport as any,
        //   document: values.documentReport,
        //   kpi: values.kpiLines.map((k) => ({
        //     icon: k.icon,
        //     title: k.title,
        //     info: k.info,
        //   })),
        // },

        archived: false,
      });

      await Promise.all(
        formMedias.map(async (m) => {
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
            mediaTypes: [m.mediaType],
            publicId: newPublicId,
            resourceType: m.resourceType,
            width: renamed.width,
            height: renamed.height,
            campaignId,
          });
        })
      );

      toast.success("Succès", {
        description: "La campagne a été enregistrée correctement.",
      });
      form.reset(defaultValues); 
      
    } catch {
      toast.error("Erreur", {
        description: "Impossible d'enregistrer la campagne.",
      });
    }
  }

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10 gap-2">
            <CardHeader>
              <Typography variant="h2" className="mb-0">
                Le client
              </Typography>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Le client</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-1/3 text-base italic rounded-sm border border-[#A5A4BF] p-5 bg-white">
                          <SelectValue
                            placeholder={
                              <span className="text-primary/50 italic">
                                Sélectionnez un client existant
                              </span>
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full text-base italic rounded-sm border border-[#A5A4BF] text-primary text-base">
                        {organizations.map((org) => (
                          <SelectItem
                            key={org.organizationId}
                            value={org.organizationId}
                          >
                            {org.organizationName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
            <CardHeader>
              <Typography variant="h2" className="mb-0">
                La campagne
              </Typography>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[250px]">
                      <FormLabel className="text-lg">
                        Titre de la campagne
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Renseignez le nom de la campagne"
                          className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[250px]">
                      <FormLabel className="text-lg">Sous-titre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Renseignez le sous-titre"
                          className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mediaTypes"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[250px]">
                      <FormLabel className="text-lg">
                        Média de diffusion
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="ghost"
                              role="combobox"
                              className={cn(
                                "w-full p-5 text-base italic border border-[#A5A4BF] rounded-sm justify-between hover:bg-transparent hover:border-[#A5A4BF] hover:text-primary/50 bg-white",
                                !field.value?.length
                                  ? "text-primary/50"
                                  : "text-primary"
                              )}
                            >
                              {field.value?.length > 0
                                ? field.value.length > 2
                                  ? `${field.value.length} types de média sélectionnés`
                                  : field.value
                                      .map(
                                        (mediaType: string) =>
                                          mediaTypes.find(
                                            (o) => o.value === mediaType
                                          )?.label
                                      )
                                      .join(", ")
                                : "Sélectionnez un ou plusieurs médias"}
                              <SvgSmallDown />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[--radix-popover-trigger-width] min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0 border border-[#A5A4BF] shadow-md rounded-sm bg-white"
                          align="start"
                        >
                          <Command>
                            <CommandEmpty>
                              Aucun type de média trouvé.
                            </CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {mediaTypes.map((mediaType) => {
                                  const isSelected = field.value?.includes(
                                    mediaType.value
                                  );
                                  return (
                                    <CommandItem
                                      key={mediaType.value}
                                      onSelect={() => {
                                        const updated = isSelected
                                          ? field.value.filter(
                                              (v: string) =>
                                                v !== mediaType.value
                                            )
                                          : [
                                              ...(field.value ?? []),
                                              mediaType.value,
                                            ];
                                        field.onChange(updated);
                                      }}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          checked={isSelected}
                                          onCheckedChange={() => {}}
                                        />
                                        {mediaType.label}
                                      </div>
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
            <CardHeader>
              <Typography variant="h2" className="mb-0">
                Le budget
              </Typography>
            </CardHeader>

            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="budgetTotal"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[150px]">
                    <FormLabel className="text-lg">Budget total</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Budget en €"
                        className="w-1/3 !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? 0
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 mb-2">
                  <div className="flex-1 min-w-[170px] text-lg">Média</div>
                  <div className="flex-1 min-w-[170px] text-lg">Budget</div>
                  <div className="flex-1 min-w-[170px] text-lg">
                    Part honoraire
                  </div>
                  {/* <div className="flex-1 min-w-[170px] text-lg">
                    Date de lancement
                  </div> */}
                  <div className="flex-1 min-w-[170px] text-lg">Titre info</div>
                  <div className="flex-1 min-w-[170px] text-lg">
                    Détail info
                  </div>
                </div>
                {budgetFields.map((row, index) => (
                  <div
                    key={row.id}
                    className="flex flex-row flex-nowrap gap-2 mb-2"
                  >
                    <FormField
                      control={form.control}
                      name={`budgetMedia.${index}.mediaType`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[170px]">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? ""}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full text-base italic rounded-sm border border-[#A5A4BF] p-5 bg-white">
                                <SelectValue
                                  placeholder={
                                    <span className="text-primary/50 italic">
                                      Type de média
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

                    <FormField
                      control={form.control}
                      name={`budgetMedia.${index}.amount`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[170px]">
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Budget en €"
                              className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value)
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
                      name={`budgetMedia.${index}.pourcent`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[170px]">
                          <FormControl>
                            <Input
                              placeholder="Part en € ou en %"
                              className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name={`budgetMedia.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[170px]">
                          <Popover>
                            <PopoverTrigger asChild>
                              <div
                                className={cn(
                                  "w-full rounded-sm py-2 px-5 flex items-center justify-between cursor-pointer",
                                  "border",
                                  field.value
                                    ? "text-primary"
                                    : "text-primary/50",
                                  "border-[#A5A4BF] bg-white"
                                )}
                              >
                                <span className="text-base italic">
                                  {field.value
                                    ? format(field.value, "dd/MM/yyyy", {
                                        locale: fr,
                                      })
                                    : "Sélectionnez"}
                                </span>
                                <SvgCalendrier />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 text-primary rounded-sm shadow border-[#A5A4BF]"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(d) => field.onChange(d)}
                                disabled={(date) =>
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                                locale={fr}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    <FormField
                      control={form.control}
                      name={`budgetMedia.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[170px]">
                          <FormControl>
                            <Input
                              placeholder="Titre"
                              className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`budgetMedia.${index}.details`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[170px]">
                          <FormControl>
                            <Input
                              placeholder="Détail"
                              className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <div className="flex">
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-4 py-2 font-semibold cursor-pointer underline"
                    onClick={() =>
                      appendBudget({
                        mediaType: "",
                        amount: 0,
                        pourcent: "",
                        // startDate: new Date(),
                        title: "",
                        details: "",
                      })
                    }
                  >
                    Ajouter
                    <SvgPlus />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-4 py-2 font-semibold cursor-pointer"
                    onClick={() => removeBudget(budgetFields.length - 1)}
                    disabled={budgetFields.length === 0}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
            <CardHeader>
              <Typography variant="h2" className="mb-0">
                Les étapes
              </Typography>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-4 mb-2">
                <div className="flex-1 min-w-[170px] text-lg">Étape</div>
                <div className="flex-1 min-w-[170px] text-lg">État</div>
                <div className="flex-1 min-w-[170px] text-lg">
                  Date de lancement
                </div>
              </div>
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex flex-wrap gap-4 mb-2">
                  <FormField
                    control={form.control}
                    name={`status.${index}.label`}
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[170px]">
                        <FormControl>
                          <Input
                            placeholder="Nom étape"
                            className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`status.${index}.state`}
                    render={({ field }) => {
                      const allSteps = form.watch("status");

                      return (
                        <FormItem className="flex-1 min-w-[170px]">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? ""}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full text-base italic rounded-sm border border-[#A5A4BF] p-5 bg-white">
                                <SelectValue
                                  placeholder={
                                    <span className="text-primary/50 italic">
                                      Sélectionnez l'état de l'étape
                                    </span>
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full text-base italic rounded-sm border border-[#A5A4BF] text-primary text-base">
                              {state.map((s) => {
                                const prev = allSteps[index - 1]?.state;

                                const disabled =
                                  (index > 0 && !prev) ||
                                  (s.value === "completed" &&
                                    index > 0 &&
                                    prev !== "completed") ||
                                  (s.value === "current" &&
                                    prev === "upcoming") ||
                                  (s.value === "upcoming" &&
                                    prev === "completed") ||
                                  (s.value === "current" && prev === "current");

                                return (
                                  <SelectItem
                                    key={s.value}
                                    value={s.value}
                                    disabled={disabled}
                                  >
                                    {s.label}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name={`status.${index}.deadline`}
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[170px]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                "w-full rounded-sm py-2 px-5 flex items-center justify-between",
                                "border",
                                field.value
                                  ? "text-primary"
                                  : "text-primary/50",
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
              ))}
            </CardContent>
          </Card>

          <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
            <CardHeader>
              <Typography variant="h2" className="mb-0">
                La diffusion
              </Typography>
            </CardHeader>

            <CardContent>
              {diffusionFields.length === 0 ? (
                <p className="text-primary/60 italic">
                  Ajoute au moins un média dans <strong>Le budget</strong> pour
                  définir ses dates de diffusion.
                </p>
              ) : (
                <div className="flex flex-col gap-6">
                  {diffusionFields.map((row, index) => (
                    <div key={row.id} className="flex flex-wrap gap-4">
                      <div className="w-full">
                        <div className="mt-1 text-xl underline">
                          {mediaTypes.find((mt) => mt.value === row.media)
                            ?.label ?? row.media}
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name={`diffusionLines.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem className="w-full md:w-1/3">
                            <FormLabel className="text-lg">
                              Date de lancement
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  className={cn(
                                    "w-full rounded-sm py-2 px-5 flex items-center justify-between",
                                    "border",
                                    field.value
                                      ? "text-primary"
                                      : "text-primary/50",
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
                                  disabled={(date) =>
                                    date < new Date("1900-01-01")
                                  }
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
                        name={`diffusionLines.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem className="w-full md:w-1/3">
                            <FormLabel className="text-lg">
                              Date de fin
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  className={cn(
                                    "w-full rounded-sm py-2 px-5 flex items-center justify-between",
                                    "border",
                                    field.value
                                      ? "text-primary"
                                      : "text-primary/50",
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
                                  onSelect={(d) => field.onChange(d ?? null)}
                                  disabled={(date) =>
                                    date < new Date("1900-01-01")
                                  }
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
            <CardHeader>
              <Typography variant="h2" className="mb-0">
                Les cibles de la campagne
              </Typography>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-4 mb-2">
                <div className="flex-1 min-w-[170px] text-lg">
                  Intitulé de la cible
                </div>
                <div className="flex-1 min-w-[170px] text-lg">
                  Importer le fichier CSV
                </div>
              </div>
              {targetFields.map((row, index) => (
                <div key={row.id} className="flex flex-wrap gap-4 mb-2">
                  <FormField
                    control={form.control}
                    name={`targetLine.${index}.target`}
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormControl>
                          <Input
                            placeholder="Renseignez l'intitulé"
                            className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`targetLine.${index}.csvFiles`}
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Importer le fichier CSV"
                              className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12"
                              {...field}
                            />
                            <SvgUploder className="absolute right-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <div className="flex">
                <Button
                  type="button"
                  variant="ghost"
                  className="px-4 py-2 font-semibold cursor-pointer underline"
                  onClick={() =>
                    appendTarget({
                      target: "",
                      csvFiles: "",
                    })
                  }
                >
                  Ajouter
                  <SvgPlus />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="px-4 py-2 font-semibold cursor-pointer"
                  onClick={() => removeTarget(targetFields.length - 1)}
                  disabled={targetFields.length === 0}
                >
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
            <CardHeader className="flex justify-between">
              <Typography variant="h2" className="mb-0">
                Les médias
              </Typography>
              <MediaModal
                onAddMedia={(media) =>
                  setFormMedias((prev) => [...prev, media])
                }
              />
            </CardHeader>

            <CardContent>
              {formMedias.length === 0 ? (
                <p className="text-center py-4">Aucun média pour le moment.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formMedias.map((m, i) => (
                    <DetailsCard
                      key={i}
                      variant="media"
                      title={m.title}
                      description={m.type.toUpperCase()}
                      startDate={new Date()}
                      media={{
                        publicId: m.publicId,
                        type: m.type,
                        width: m.width,
                        height: m.height,
                        alt: m.title,
                      }}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
            <CardHeader className="flex justify-between">
              <Typography variant="h2" className="mb-0">
                Les documents
              </Typography>
              <CtaButton
                props={ctaProps[1]}
                icon={<SvgPlus />}
                className="flex items-center border px-3 py-1 text-xs sm:text-sm"
                variant="default"
              />
            </CardHeader>

            <CardContent>
              <DocumentsTable
                documents={[]}
                headerClassName="border-b border-solid border-[#A5A4BF]"
              />
            </CardContent>
          </Card>

          <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
            <CardHeader className="flex justify-between">
              <Typography variant="h2" className="mb-0">
                Les factures agences
              </Typography>
              <CtaButton
                props={ctaProps[2]}
                icon={<SvgPlus />}
                className="flex items-center border px-3 py-1 text-xs sm:text-sm"
                variant="default"
              />
            </CardHeader>

            <CardContent>
              <InvoicesTable
                invoices={[]}
                variant="agency"
                headerClassName="border-b border-solid border-[#A5A4BF]"
              />
            </CardContent>

            <CardHeader className="flex justify-between">
              <Typography variant="h2" className="mb-0">
                Les factures régie
              </Typography>
            </CardHeader>

            <CardContent>
              {" "}
              <InvoicesTable
                invoices={[]}
                variant="vendor"
                headerClassName="border-b border-solid border-[#A5A4BF]"
              />
            </CardContent>
          </Card>

          {/* <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
            <CardHeader>
              <Typography variant="h2" className="mb-0">
                Bilan
              </Typography>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="statusReport"
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormLabel className="text-lg">
                        Etat de la campagne
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full text-base italic rounded-sm border border-[#A5A4BF] p-5 bg-white">
                            <SelectValue
                              placeholder={
                                <span className="text-primary/50 italic">
                                  Sélectionnez l'état de l'étape
                                </span>
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full text-base italic rounded-sm border border-[#A5A4BF] text-primary text-base">
                          {stateReport.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentReport"
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormLabel className="text-lg">
                        Document de récap
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Importer le fichier CSV"
                            className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12"
                            {...field}
                          />
                          <SvgUploder className="absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 mb-2">
                  <div className="flex-1 min-w-[170px] text-lg">Icône KPI</div>
                  <div className="flex-1 min-w-[170px] text-lg">Titre KPI</div>
                  <div className="flex-1 min-w-[170px] text-lg">Info KPI</div>
                </div>
                {kpiFields.map((row, index) => (
                  <div
                    key={row.id}
                    className="flex flex-row flex-nowrap gap-2 mb-2"
                  >
                    <FormField
                      control={form.control}
                      name={`kpiLines.${index}.icon`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[170px]">
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Sélectionnez l'icon"
                                className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12"
                                {...field}
                              />
                              <SvgUploder className="absolute right-3 top-1/2 -translate-y-1/2" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`kpiLines.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[170px]">
                          <FormControl>
                            <Input
                              placeholder="Renseignez titre KPI"
                              className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`kpiLines.${index}.info`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[170px]">
                          <FormControl>
                            <Input
                              placeholder="Renseignez info KPI"
                              className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <div className="flex">
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-4 py-2 font-semibold cursor-pointer underline"
                    onClick={() =>
                      appendKpi({
                        icon: "",
                        title: "",
                        info: "",
                      })
                    }
                  >
                    Ajouter
                    <SvgPlus />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-4 py-2 font-semibold cursor-pointer"
                    onClick={() => removeKpi(kpiFields.length - 1)}
                    disabled={kpiFields.length === 0}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card> */}

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
