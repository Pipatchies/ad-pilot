"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import SvgCalendrier from "@/components/icons/Calendrier";
import SvgSmallDown from "@/components/icons/SmallDown";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { DocumentFileType } from "@/types/docs";
import CtaButton from "@/components/cta-button";
import SvgUploder from "@/components/icons/Uploder";
import BudgetInput from "@/components/budget-input";

const objectifs = [
  { label: "Notoriété", value: "notoriete" },
  { label: "Image", value: "image" },
  { label: "Drive to store", value: "drive-to-store" },
  { label: "Drive to web", value: "drive-to-web" },
  { label: "Conversion / Achat", value: "conversion-achat" },
];

const mediaTypes = [
  { label: "Digital", value: "digital" },
  { label: "TV", value: "tv" },
  { label: "Affichage", value: "affichage" },
  { label: "Radio", value: "radio" },
  { label: "Cinéma", value: "cinema" },
  { label: "Presse", value: "presse" },
];

const tvTypes = [
  { label: "TV classique", value: "tv-classique" },
  { label: "Parrainage TV", value: "parrainage-tv" },
  { label: "TV ségmentée", value: "tv-segmentee" },
  { label: "Streaming", value: "streaming" },
];

const radioTypes = [
  { label: "Radio classique", value: "radio-classique" },
  { label: "Parrainage radio", value: "parrainage-radio" },
  { label: "Audio digital", value: "audio-digital" },
];

const formSchema = z
  .object({
    title: z.string().min(2, {
      message: "Le titre est requis",
    }),
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
    url: z.string().optional(),
    brief: z.string().min(10, {
      message: "Votre brief doit contenir au moins 10 caractères",
    }),
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

export default function BriefForm() {
  type FormValues = z.infer<typeof formSchema>;

  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
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
      url: "",
      brief: "",
    },
  });

  const createBrief = useMutation(api.mutations.briefs.createBrief);
  const getSignature = useAction(api.actions.cloudinary.getUploadSignature);

  const selectedMediaTypes = form.watch("mediaTypes") || [];

  async function onSubmit(values: FormValues) {
    if (!file) {
      toast.error("Veuillez sélectionner un document.");
      return;
    }

    setIsSubmitting(true);
    let fileUrl = values.url;

    try {
      setUploading(true);
      const ext = (file.name.split(".").pop() || "").toLowerCase();
      let tableType: DocumentFileType | null = null;
      if (["jpg", "jpeg"].includes(ext)) tableType = "jpg";
      if (ext === "png") tableType = "png";
      if (ext === "pdf") tableType = "pdf";
      if (ext === "mp3") tableType = "mp3";
      if (ext === "mp4") tableType = "mp4";

      if (!tableType) {
        toast.error(
          "Format non supporté. Autorisés : png, jpg, pdf, mp3, mp4."
        );
        setUploading(false);
        setIsSubmitting(false);
        return;
      }

      const folder = "clients/briefs";
      const resourceType = "raw";
      const sig = await getSignature({ folder, resourceType });
      const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`;

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
      fileUrl = json.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Erreur lors de l'upload du document.");
      setUploading(false);
      setIsSubmitting(false);
      return;
    }

    try {
      await createBrief({
        title: values.title,
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
        url: fileUrl,
        brief: values.brief,
      });

      toast.success("Succès", {
        description: "Le formulaire a été envoyé correctement.",
      });
      form.reset();
      setFile(null);
    } catch {
      toast.error("Erreur", {
        description: "Veuillez remplir tous les champs du formulaire.",
      });
    } finally {
      setUploading(false);
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <Card className="w-full h-auto rounded-sm shadow-around bg-white border-none text-primary py-20 px-10">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Nom de la campagne
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Définissez le nom de la campagne"
                        className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem className="flex flex-col relative">
                      <FormLabel className="text-lg font-semibold">
                        Période
                      </FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            className={cn(
                              "w-full rounded-sm py-2 px-5 flex items-center justify-between cursor-pointer",
                              "border",
                              !field.value ? "text-primary" : "text-primary/50",
                              form.formState.errors.period
                                ? "border-destructive"
                                : "border-[#A5A4BF]"
                            )}
                          >
                            <span
                              className={cn(
                                "text-base italic",
                                field.value?.from && field.value?.to
                                  ? "text-primary"
                                  : "text-primary/50"
                              )}
                            >
                              {field.value?.from && !field.value?.to
                                ? `${format(field.value.from, "dd/MM/yyyy", {
                                    locale: fr,
                                  })} – ...`
                                : field.value?.from && field.value?.to
                                ? `${format(field.value.from, "dd/MM/yyyy", {
                                    locale: fr,
                                  })} - ${format(field.value.to, "dd/MM/yyyy", {
                                    locale: fr,
                                  })}`
                                : "Sélectionner la période"}
                            </span>
                            <SvgCalendrier />
                          </div>
                        </PopoverTrigger>

                        <PopoverContent
                          className="w-auto p-0 text-primary rounded-sm shadow border-[#A5A4BF]"
                          align="start"
                        >
                          <Calendar
                            mode="range"
                            selected={field.value}
                            onSelect={(range) => {
                              field.onChange(range);
                            }}
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
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Cible
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Renseignez votre cible"
                          className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="territory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Territoire
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full text-base italic rounded-sm border border-[#A5A4BF] p-5">
                            <SelectValue
                              placeholder={
                                <span className="text-primary/50 italic">
                                  Sélectionnez un type de territoire
                                </span>
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full text-base italic rounded-sm border border-[#A5A4BF] text-primary text-base">
                          <SelectItem value="national">National</SelectItem>
                          <SelectItem value="regional">Régional</SelectItem>
                          <SelectItem value="local">Local</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Villes
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Précisez les villes"
                          className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Budget
                      </FormLabel>
                      <FormControl>
                        <BudgetInput
                          placeholder="Précisez votre budget"
                          className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="objectives"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-lg font-semibold">
                        Objectifs
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="ghost"
                              role="combobox"
                              className={cn(
                                "w-full p-5 text-base italic border border-[#A5A4BF] rounded-sm justify-between hover:bg-transparent hover:border-[#A5A4BF] hover:text-primary/50",
                                !field.value.length
                                  ? "text-primary/50"
                                  : "text-primary"
                              )}
                            >
                              {field.value.length > 0 ? (
                                field.value.length > 2 ? (
                                  <span>
                                    {field.value.length} objectifs sélectionnés
                                  </span>
                                ) : (
                                  <div className="flex gap-1 flex-wrap">
                                    {field.value.map((objectif: string) => (
                                      <Badge
                                        key={objectif}
                                        className="bg-primary text-white rounded-sm px-2 py-1 text-sm"
                                      >
                                        {
                                          objectifs.find(
                                            (o) => o.value === objectif
                                          )?.label
                                        }
                                      </Badge>
                                    ))}
                                  </div>
                                )
                              ) : (
                                "Sélectionnez un ou plusieurs objectifs"
                              )}
                              <SvgSmallDown />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[--radix-popover-trigger-width] min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0 border border-[#A5A4BF] shadow-md rounded-sm"
                          align="start"
                        >
                          <Command>
                            <CommandEmpty>Aucun objectif trouvé.</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {objectifs.map((objectif) => {
                                  const isSelected = field.value.includes(
                                    objectif.value
                                  );
                                  return (
                                    <CommandItem
                                      key={objectif.value}
                                      onSelect={() => {
                                        const updatedValue = isSelected
                                          ? field.value.filter(
                                              (val) => val !== objectif.value
                                            )
                                          : [...field.value, objectif.value];

                                        field.onChange(updatedValue);
                                      }}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          checked={isSelected}
                                          onCheckedChange={() => {}}
                                          className="mr-2"
                                        />
                                        {objectif.label}
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

              {/* Media(s) */}
              <div className="space-y-4">
                <FormLabel className="text-lg font-semibold">
                  Média(s)
                </FormLabel>

                {/* Type de média */}
                <FormField
                  control={form.control}
                  name="mediaTypes"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="ghost"
                              role="combobox"
                              className={cn(
                                "w-full p-5 text-base italic border border-[#A5A4BF] rounded-sm justify-between hover:bg-transparent hover:border-[#A5A4BF] hover:text-primary/50",
                                !field.value.length
                                  ? "text-primary/50"
                                  : "text-primary"
                              )}
                            >
                              {field.value.length > 0 ? (
                                field.value.length > 2 ? (
                                  <span>
                                    {field.value.length} types de média
                                    sélectionnés
                                  </span>
                                ) : (
                                  <div className="flex gap-1 flex-wrap">
                                    {field.value.map((mediaType: string) => (
                                      <Badge
                                        key={mediaType}
                                        className="bg-primary text-white rounded-sm px-2 py-1 text-sm"
                                      >
                                        {
                                          mediaTypes.find(
                                            (o) => o.value === mediaType
                                          )?.label
                                        }
                                      </Badge>
                                    ))}
                                  </div>
                                )
                              ) : (
                                "Sélectionnez un ou plusieurs médias"
                              )}
                              <SvgSmallDown />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[--radix-popover-trigger-width] min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0 border border-[#A5A4BF] shadow-md rounded-sm"
                          align="start"
                        >
                          <Command>
                            <CommandEmpty>
                              Aucun type de média trouvé.
                            </CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {mediaTypes.map((mediaType) => {
                                  const isSelected = field.value.includes(
                                    mediaType.value
                                  );
                                  return (
                                    <CommandItem
                                      key={mediaType.value}
                                      onSelect={() => {
                                        const updatedValue = isSelected
                                          ? field.value.filter(
                                              (val) => val !== mediaType.value
                                            )
                                          : [...field.value, mediaType.value];
                                        field.onChange(updatedValue);
                                      }}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          checked={isSelected}
                                          onCheckedChange={() => {}}
                                          className="mr-2"
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

                {selectedMediaTypes.includes("tv") && (
                  <FormField
                    control={form.control}
                    name="tvTypes"
                    render={({ field }) => (
                      <FormItem>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="ghost"
                                role="combobox"
                                className={cn(
                                  "w-full p-5 text-base italic border border-[#A5A4BF] rounded-sm justify-between hover:bg-transparent hover:border-[#A5A4BF] hover:text-primary/50",
                                  !field.value?.length
                                    ? "text-primary/50"
                                    : "text-primary"
                                )}
                              >
                                {(field.value || []).length > 0 ? (
                                  (field.value || []).length > 2 ? (
                                    <span>
                                      {(field.value || []).length} diffusions TV
                                      sélectionnées
                                    </span>
                                  ) : (
                                    <div className="flex gap-1 flex-wrap">
                                      {field.value?.map((val: string) => (
                                        <Badge
                                          key={val}
                                          className="bg-primary text-white rounded-sm px-2 py-1 text-sm"
                                        >
                                          {
                                            tvTypes.find((o) => o.value === val)
                                              ?.label
                                          }
                                        </Badge>
                                      ))}
                                    </div>
                                  )
                                ) : (
                                  "Sélectionnez une ou plusieurs diffusions TV"
                                )}
                                <SvgSmallDown />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[--radix-popover-trigger-width] min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0 border border-[#A5A4BF] shadow-md rounded-sm"
                            align="start"
                          >
                            <Command>
                              <CommandEmpty>
                                Aucune diffusion TV trouvée.
                              </CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {tvTypes.map((option) => {
                                    const isSelected = field.value?.includes(
                                      option.value
                                    );
                                    return (
                                      <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                          const updatedValue = isSelected
                                            ? field.value?.filter(
                                                (val) => val !== option.value
                                              )
                                            : [
                                                ...(field.value ?? []),
                                                option.value,
                                              ];
                                          field.onChange(updatedValue);
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => {}}
                                            className="mr-2"
                                          />
                                          {option.label}
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
                )}

                {selectedMediaTypes.includes("affichage") && (
                  <FormField
                    control={form.control}
                    name="displayTypes"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full p-5 text-base italic border border-[#A5A4BF] rounded-sm">
                              <SelectValue
                                placeholder={
                                  <span className="text-primary/50 italic">
                                    Sélectionnez le type d'affichage
                                  </span>
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-full text-base italic rounded-sm border border-[#A5A4BF] text-primary text-base">
                            <SelectItem value="affichage-temporaire">
                              Affichage temporaire
                            </SelectItem>
                            <SelectItem value="affichage-permanent">
                              Affichage permanent
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedMediaTypes.includes("radio") && (
                  <FormField
                    control={form.control}
                    name="radioTypes"
                    render={({ field }) => (
                      <FormItem>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="ghost"
                                role="combobox"
                                className={cn(
                                  "w-full p-5 text-base italic border border-[#A5A4BF] rounded-sm justify-between hover:bg-transparent hover:border-[#A5A4BF] hover:text-primary/50",
                                  !field.value?.length
                                    ? "text-primary/50"
                                    : "text-primary"
                                )}
                              >
                                {(field.value || []).length > 0 ? (
                                  (field.value || []).length > 2 ? (
                                    <span>
                                      {(field.value || []).length} diffusions
                                      radio sélectionnées
                                    </span>
                                  ) : (
                                    <div className="flex gap-1 flex-wrap">
                                      {field.value?.map((val: string) => (
                                        <Badge
                                          key={val}
                                          className="bg-primary text-white rounded-sm px-2 py-1 text-sm"
                                        >
                                          {
                                            radioTypes.find(
                                              (o) => o.value === val
                                            )?.label
                                          }
                                        </Badge>
                                      ))}
                                    </div>
                                  )
                                ) : (
                                  "Sélectionnez une ou plusieurs diffusions radio"
                                )}
                                <SvgSmallDown />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[--radix-popover-trigger-width] min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0 border border-[#A5A4BF] shadow-md rounded-sm"
                            align="start"
                          >
                            <Command>
                              <CommandEmpty>
                                Aucune diffusion radio trouvée.
                              </CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {radioTypes.map((option) => {
                                    const isSelected = field.value?.includes(
                                      option.value
                                    );
                                    return (
                                      <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                          const updatedValue = isSelected
                                            ? field.value?.filter(
                                                (val) => val !== option.value
                                              )
                                            : [
                                                ...(field.value ?? []),
                                                option.value,
                                              ];
                                          field.onChange(updatedValue);
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => {}}
                                            className="mr-2"
                                          />
                                          {option.label}
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
                )}
              </div>

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[170px]">
                    <FormLabel className="text-lg font-semibold">
                      Importez votre brief
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          readOnly
                          value={field.value || ""}
                          placeholder="Sélectionnez le document"
                          className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12 bg-white cursor-pointer"
                          onClick={() =>
                            document.getElementById("hiddenBriefInput")?.click()
                          }
                        />
                        <SvgUploder
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                          onClick={() =>
                            document.getElementById("hiddenBriefInput")?.click()
                          }
                        />
                        <input
                          id="hiddenBriefInput"
                          type="file"
                          accept="application/pdf,image/png,image/jpeg,audio/mpeg,video/mp4"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            if (f && f.size > 10 * 1024 * 1024) {
                              toast.error(
                                "Le fichier est trop volumineux (max 10 Mo)."
                              );
                              e.target.value = "";
                              setFile(null);
                              field.onChange("");
                              return;
                            }
                            setFile(f);
                            if (f) field.onChange(f.name);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brief"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Votre brief
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Donnez-nous plus de détail sur votre brief..."
                        className="min-h-[150px] w-full p-5 text-base italic border border-[#A5A4BF] rounded-sm bg-white placeholder:text-primary/50 text-primary focus:outline-none focus:ring-0 focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex justify-center">
                <CtaButton
                  props={{
                    text: "Enregistrer la campagne",
                    onClick: form.handleSubmit(onSubmit),
                    disabled: uploading || isSubmitting,
                    loading: isSubmitting,
                  }}
                  variant="submit"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
