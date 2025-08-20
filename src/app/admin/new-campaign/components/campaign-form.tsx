"use client";
import React, { useState } from "react";
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
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import Typography from "@/components/typography";
import { useFieldArray } from "react-hook-form";
import SvgPlus from "@/components/icons/Plus";
import SvgUploder from "@/components/icons/Uploder";
import CtaButton from "@/components/cta-button";
import { Button } from "@/components/ui/button";

const mediaTypes = [
  { label: "Digital", value: "digital" },
  { label: "TV", value: "tv" },
  { label: "Affichage", value: "affichage" },
  { label: "Radio", value: "radio" },
  { label: "Cinéma", value: "cinema" },
  { label: "Presse", value: "presse" },
];


const ctaProps = [
  { text: "Ajouter un média", url: "#", target: "self" },
  { text: "Ajouter un document", url: "#", target: "self" },
  { text: "Ajouter une facture", url: "#", target: "self" },
];

const formSchema = z
  .object({
    period: z
      .object({
        from: z.date(),
        to: z.date(),
      })
      .refine((data) => data.from && data.to, {
        message: "Veuillez sélectionner une période",
      }),
    target: z.string().min(2, {
      message: "Le choix d'une cible est requis",
    }),
    territory: z
      .string({
        required_error: "Veuillez sélectionner un type de territoire",
      })
      .min(1, {
        message: "Veuillez sélectionner un type de territoire",
      }),
    cities: z.string().min(2, {
      message: "Veuillez inscrire au moins une ville",
    }),
    budget: z
      .number({
        required_error: "Veuillez préciser votre budget",
        invalid_type_error: "Le budget doit être un nombre valide",
      })
      .positive("Le budget doit être supérieur à 0"),
    objectives: z.array(z.string()).min(1, {
      message: "Veuillez sélectionner au moins un objectif",
    }),
    mediaTypes: z.array(z.string()).min(1, {
      message: "Veuillez sélectionner au moins un type de média",
    }),
    tvTypes: z.array(z.string()).optional(),
    displayTypes: z.string().optional(),
    radioTypes: z.array(z.string()).optional(),
    brief: z.string().min(10, {
      message: "Votre brief doit contenir au moins 10 caractères",
    }),
    budgetTotal: z.number().nonnegative().optional(),
    budgetLines: z
      .array(
        z.object({
          media: z.string().min(1, "Le média est requis"),
          mediaBudget: z.number().nonnegative().optional(),
          feeShare: z.string().optional(),
          launchDate: z.date().optional(),
          infoTitle: z.string().optional(),
          infoDetail: z.string().optional(),
        })
      )
      .min(1),
    deadline: z.date({ required_error: "Sélectionnez une date" }).optional(),
    targetLine: z.array(
      z.object({
        target: z.string().min(1, "Le cible est requis"),
        csvFiles: z.string().min(1, "Le fichier csv est requis"),
      })
    ),
    kpiLines: z
      .array(
        z.object({
          icon: z.string().min(1, "L'icône est requise"),
          title: z.string().min(1, "Le titre est requis"),
          info: z.string().min(1, "L'info est requise"),
        })
      )
      .min(1),
  })
  .refine(
    (data) => {
      if (data.mediaTypes.includes("tv")) {
        return data.tvTypes && data.tvTypes.length > 0;
      }
      return true;
    },
    {
      message: "Veuillez sélectionner au moins un type de diffusion TV",
      path: ["tvTypes"],
    }
  )
  .refine(
    (data) => {
      if (data.mediaTypes.includes("affichage")) {
        return !!data.displayTypes;
      }
      return true;
    },
    {
      message: "Veuillez selectionner un type d'affichage",
      path: ["displayTypes"],
    }
  )
  .refine(
    (data) => {
      if (data.mediaTypes.includes("radio")) {
        return data.radioTypes && data.radioTypes.length > 0;
      }
      return true;
    },
    {
      message: "Veuillez sélectionner au moins un type de diffusion Radio",
      path: ["radioTypes"],
    }
  );

export default function CampaignForm() {
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      period: {
        from: undefined,
        to: undefined,
      },
      target: "",
      territory: "",
      cities: "",
      budget: 0,
      objectives: [],
      mediaTypes: [],
      tvTypes: [],
      displayTypes: "",
      radioTypes: [],
      brief: "",
      budgetTotal: 0,
      budgetLines: [
        {
          media: "",
          mediaBudget: 0,
          feeShare: "",
          launchDate: undefined,
          infoTitle: "",
          infoDetail: "",
        },
      ],
      deadline: undefined,
      targetLine: [
        {
          target: "",
          csvFiles: "",
        },
      ],
      kpiLines: [
        {
          icon: "",
          title: "",
          info: "",
        },
      ],
    },
  });

  const createBrief = useMutation(api.mutations.briefs.createBrief);
  const [mediaTypeOpen, setMediaTypeOpen] = useState(false);

  const {
    fields: budgetFields,
    append: appendBudget,
    remove: removeBudget,
  } = useFieldArray({
    control: form.control,
    name: "budgetLines",
  });

  const {
    fields: targetFields,
    append: appendTarget,
    remove: removeTarget,
  } = useFieldArray({
    control: form.control,
    name: "targetLine",
  });

  const {
    fields: kpiFields,
    append: appendKpi,
    remove: removeKpi,
  } = useFieldArray({
    control: form.control,
    name: "kpiLines",
  });

  async function onSubmit(values: FormValues) {
    try {
      await createBrief({
        periodFrom: values.period.from.toISOString(),
        periodTo: values.period.to.toISOString(),
        target: values.target,
        territory: values.territory,
        cities: values.cities,
        budget: values.budget,
        objectives: values.objectives,
        mediaTypes: values.mediaTypes,
        tvTypes: values.tvTypes?.length ? values.tvTypes : undefined,
        displayTypes: values.displayTypes || undefined,
        radioTypes: values.radioTypes?.length ? values.radioTypes : undefined,
        brief: values.brief,
      });

      toast.success("Succès", {
        description: "Le formulaire a été envoyé correctement.",
      });
    } catch {
      toast.error("Erreur", {
        description: "Veuillez remplir tous les champs du formulaire.",
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
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Le client</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                        <SelectItem value="1">Verywell</SelectItem>
                        <SelectItem value="2">Science Po Toulouse</SelectItem>
                        <SelectItem value="3">Garorock</SelectItem>
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
                  name="territory"
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
                  name="cities"
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
                      <Popover
                        open={mediaTypeOpen}
                        onOpenChange={setMediaTypeOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="ghost"
                              role="combobox"
                              aria-expanded={mediaTypeOpen}
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
                          className="w-[--radix-popover-trigger-width] p-0 mt-2 border border-[#A5A4BF] shadow-md rounded-sm bg-white"
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
              {/* Budget total */}
              <FormField
                control={form.control}
                name="budgetTotal"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[150px]">
                    <FormLabel className="text-lg">Budget total</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Budget en €"
                        className="w-1/3 !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Lignes dynamiques */}
              <div className="space-y-4">
                {budgetFields.map((row, index) => (
                  <div
                    key={row.id}
                    className="flex flex-row flex-nowrap gap-2 overflow-x-auto"
                  >
                    {/* Média */}
                    <FormField
                      control={form.control}
                      name={`budgetLines.${index}.media`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[170px]">
                          <FormLabel className="text-lg">Média</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Type de média"
                              className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Budget du média */}
                    <FormField
                      control={form.control}
                      name={`budgetLines.${index}.mediaBudget`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[170px]">
                          <FormLabel className="text-lg">
                            Budget du média
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Budget en €"
                              className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              value={field.value ?? ""}
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

                    {/* Part d'honoraire */}
                    <FormField
                      control={form.control}
                      name={`budgetLines.${index}.feeShare`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[170px]">
                          <FormLabel className="text-lg">
                            Part d'honoraire
                          </FormLabel>
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

                    {/* Date de lancement (simple) */}
                    <FormField
                      control={form.control}
                      name={`budgetLines.${index}.launchDate`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[170px]">
                          <FormLabel className="text-lg">
                            Date de lancement
                          </FormLabel>
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
                    />

                    {/* Titre info */}
                    <FormField
                      control={form.control}
                      name={`budgetLines.${index}.infoTitle`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[170px]">
                          <FormLabel className="text-lg">Titre info</FormLabel>
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

                    {/* Détail info */}
                    <FormField
                      control={form.control}
                      name={`budgetLines.${index}.infoDetail`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[170px]">
                          <FormLabel className="text-lg">Détail info</FormLabel>
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
                        media: "",
                        mediaBudget: 0,
                        feeShare: "",
                        launchDate: undefined,
                        infoTitle: "",
                        infoDetail: "",
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
              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="territory"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[250px]">
                      <FormLabel className="text-lg">Etapes</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief"
                          className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          placeholder="Création"
                          className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          placeholder="Validation"
                          className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          placeholder="Diffusion"
                          className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          placeholder="Bilan"
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
                  name="cities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Etat</FormLabel>
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
                          <SelectItem value="1">En attente</SelectItem>
                          <SelectItem value="2">En cours</SelectItem>
                          <SelectItem value="3">Terminé</SelectItem>
                        </SelectContent>
                      </Select>
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
                          <SelectItem value="1">En attente</SelectItem>
                          <SelectItem value="2">En cours</SelectItem>
                          <SelectItem value="3">Terminé</SelectItem>
                        </SelectContent>
                      </Select>
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
                          <SelectItem value="1">En attente</SelectItem>
                          <SelectItem value="2">En cours</SelectItem>
                          <SelectItem value="3">Terminé</SelectItem>
                        </SelectContent>
                      </Select>
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
                          <SelectItem value="1">En attente</SelectItem>
                          <SelectItem value="2">En cours</SelectItem>
                          <SelectItem value="3">Terminé</SelectItem>
                        </SelectContent>
                      </Select>
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
                          <SelectItem value="1">En attente</SelectItem>
                          <SelectItem value="2">En cours</SelectItem>
                          <SelectItem value="3">Terminé</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[170px]">
                      <FormLabel className="text-lg">
                        Date de lancement
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            className={cn(
                              "w-full rounded-sm py-2 px-5 flex items-center justify-between cursor-pointer",
                              "border",
                              field.value ? "text-primary" : "text-primary/50",
                              "border-[#A5A4BF] bg-white"
                            )}
                          >
                            <span className="text-base italic">
                              {field.value
                                ? format(field.value, "dd/MM/yyyy", {
                                    locale: fr,
                                  })
                                : "Sélectionnez la date"}
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
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                            locale={fr}
                          />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            className={cn(
                              "w-full rounded-sm py-2 px-5 flex items-center justify-between cursor-pointer",
                              "border",
                              field.value ? "text-primary" : "text-primary/50",
                              "border-[#A5A4BF] bg-white"
                            )}
                          >
                            <span className="text-base italic">
                              {field.value
                                ? format(field.value, "dd/MM/yyyy", {
                                    locale: fr,
                                  })
                                : "Sélectionnez la date"}
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
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                            locale={fr}
                          />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            className={cn(
                              "w-full rounded-sm py-2 px-5 flex items-center justify-between cursor-pointer",
                              "border",
                              field.value ? "text-primary" : "text-primary/50",
                              "border-[#A5A4BF] bg-white"
                            )}
                          >
                            <span className="text-base italic">
                              {field.value
                                ? format(field.value, "dd/MM/yyyy", {
                                    locale: fr,
                                  })
                                : "Sélectionnez la date"}
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
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                            locale={fr}
                          />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            className={cn(
                              "w-full rounded-sm py-2 px-5 flex items-center justify-between cursor-pointer",
                              "border",
                              field.value ? "text-primary" : "text-primary/50",
                              "border-[#A5A4BF] bg-white"
                            )}
                          >
                            <span className="text-base italic">
                              {field.value
                                ? format(field.value, "dd/MM/yyyy", {
                                    locale: fr,
                                  })
                                : "Sélectionnez la date"}
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
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                            locale={fr}
                          />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            className={cn(
                              "w-full rounded-sm py-2 px-5 flex items-center justify-between cursor-pointer",
                              "border",
                              field.value ? "text-primary" : "text-primary/50",
                              "border-[#A5A4BF] bg-white"
                            )}
                          >
                            <span className="text-base italic">
                              {field.value
                                ? format(field.value, "dd/MM/yyyy", {
                                    locale: fr,
                                  })
                                : "Sélectionnez la date"}
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
                            disabled={(date) => date < new Date("1900-01-01")}
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
            </CardContent>
          </Card>

          <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
            <CardHeader>
              <Typography variant="h2" className="mb-0">
                La diffusion
              </Typography>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormLabel className="text-lg">
                        Date de lancement
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            className={cn(
                              "w-full rounded-sm py-2 px-5 flex items-center justify-between cursor-pointer",
                              "border",
                              field.value ? "text-primary" : "text-primary/50",
                              "border-[#A5A4BF] bg-white"
                            )}
                          >
                            <span className="text-base italic">
                              {field.value
                                ? format(field.value, "dd/MM/yyyy", {
                                    locale: fr,
                                  })
                                : "Sélectionnez la date"}
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
                            disabled={(date) => date < new Date("1900-01-01")}
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
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormLabel className="text-lg">Date de fin</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            className={cn(
                              "w-full rounded-sm py-2 px-5 flex items-center justify-between cursor-pointer",
                              "border",
                              field.value ? "text-primary" : "text-primary/50",
                              "border-[#A5A4BF] bg-white"
                            )}
                          >
                            <span className="text-base italic">
                              {field.value
                                ? format(field.value, "dd/MM/yyyy", {
                                    locale: fr,
                                  })
                                : "Sélectionnez la date"}
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
                            disabled={(date) => date < new Date("1900-01-01")}
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
            </CardContent>
          </Card>

          <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
            <CardHeader>
              <Typography variant="h2" className="mb-0">
                Les cibles de la campagne
              </Typography>
            </CardHeader>

            <CardContent>
              {targetFields.map((row, index) => (
                <div key={row.id} className="flex flex-wrap gap-4">
                  <FormField
                    control={form.control}
                    name={`targetLine.${index}.target`}
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel className="text-lg">
                          Intitulé de la cible
                        </FormLabel>
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
                        <FormLabel className="text-lg">
                          Importer le fichier CSV
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
              <CtaButton
                props={ctaProps[0]}
                icon={<SvgPlus />}
                className="flex items-center border px-3 py-1 text-xs sm:text-sm"
                variant="default"
              />
            </CardHeader>

            <CardContent></CardContent>
          </Card>

          <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
            <CardHeader className="flex justify-between">
              <Typography variant="h2" className="mb-0">
                Les factures agences
              </Typography>
              <CtaButton
                props={ctaProps[1]}
                icon={<SvgPlus />}
                className="flex items-center border px-3 py-1 text-xs sm:text-sm"
                variant="default"
              />
            </CardHeader>

            <CardContent></CardContent>

            <CardHeader className="flex justify-between">
              <Typography variant="h2" className="mb-0">
                Les factures régie
              </Typography>
            </CardHeader>

            <CardContent></CardContent>
          </Card>

          <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
            <CardHeader>
              <Typography variant="h2" className="mb-0">
                Bilan
              </Typography>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="cities"
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
                          <SelectItem value="1">Terminée</SelectItem>
                          <SelectItem value="2">Archivée</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budgetTotal"
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
              {/* Lignes dynamiques */}
              <div className="space-y-4">
                {kpiFields.map((row, index) => (
                  <div
                    key={row.id}
                    className="flex flex-row flex-nowrap gap-2 overflow-x-auto"
                  >
                    {/* Média */}
                    <FormField
                      control={form.control}
                      name={`kpiLines.${index}.icon`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[250px]">
                          <FormLabel className="text-lg">Icon KPI</FormLabel>
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
                        <FormItem className="flex-1 min-w-[250px]">
                          <FormLabel className="text-lg">Titre KPI</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Renseignez titre KPI"
                              className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormControl>
                            <Input
                              placeholder="Renseignez titre KPI"
                              className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormControl>
                            <Input
                              placeholder="Renseignez titre KPI"
                              className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              {...field}
                            />
                          </FormControl>
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
                        <FormItem className="flex-1 min-w-[250px]">
                          <FormLabel className="text-lg">Info KPI</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Renseignez info KPI"
                              className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormControl>
                            <Input
                              placeholder="Renseignez info KPI"
                              className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormControl>
                            <Input
                              placeholder="Renseignez info KPI"
                              className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              {...field}
                            />
                          </FormControl>
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
          </Card>

          <div className="w-full flex justify-center">
            <Button type="submit" className="w-full md:w-auto cursor-pointer">
              Enregistrer la campagne
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
