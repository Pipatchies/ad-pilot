"use client";
import React, { useState } from "react";
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

const diffusionTVs = [
  { label: "TV classique", value: "tv-classique" },
  { label: "Parrainage TV", value: "parrainage-tv" },
  { label: "TV ségmentée", value: "tv-segmentee" },
  { label: "Streaming", value: "streaming" },
];

const diffusionRadios = [
  { label: "Radio classique", value: "radio-classique" },
  { label: "Parrainage radio", value: "parrainage-radio" },
  { label: "Audio digital", value: "audio-digital" },
];

const formSchema = z
  .object({
    periode: z
      .object({
        from: z.date(),
        to: z.date(),
      })
      .refine((data) => data.from && data.to, {
        message: "Veuillez sélectionner une période",
      }),
    cible: z.string().min(2, {
      message: "Le choix d'une cible est requis",
    }),
    territoire: z
      .string({
        required_error: "Veuillez sélectionner un type de territoire",
      })
      .min(1, {
        message: "Veuillez sélectionner un type de territoire",
      }),
    villes: z.string().min(2, {
      message: "Veuillez inscrire au moins une ville",
    }),
    budget: z.string().min(1, {
      message: "Veuillez préciser votre budget",
    }),
    objectifs: z.array(z.string()).min(1, {
      message: "Veuillez sélectionner au moins un objectif",
    }),
    mediaType: z.array(z.string()).min(1, {
      message: "Veuillez sélectionner au moins un type de média",
    }),
    diffusionTV: z.array(z.string()).optional(),
    typeAffichage: z.string().optional(),
    diffusionRadio: z.array(z.string()).optional(),
    brief: z.string().min(10, {
      message: "Votre brief doit contenir au moins 10 caractères",
    }),
  })
  .refine(
    (data) => {
      if (data.mediaType.includes("tv")) {
        return data.diffusionTV && data.diffusionTV.length > 0;
      }
      return true;
    },
    {
      message: "Veuillez sélectionner au moins un type de diffusion TV",
      path: ["diffusionTV"],
    }
  )
  .refine(
    (data) => {
      if (data.mediaType.includes("affichage")) {
        return !!data.typeAffichage;
      }
      return true;
    },
    {
      message: "Veuillez selectionner un type d'affichage",
      path: ["typeAffichage"],
    }
  )
  .refine(
    (data) => {
      if (data.mediaType.includes("radio")) {
        return data.diffusionRadio && data.diffusionRadio.length > 0;
      }
      return true;
    },
    {
      message: "Veuillez sélectionner au moins un type de diffusion Radio",
      path: ["diffusionRadio"],
    }
  );

export default function BriefForm() {
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      periode: {
        from: undefined,
        to: undefined,
      },
      cible: "",
      territoire: "",
      villes: "",
      budget: "",
      objectifs: [],
      mediaType: [],
      diffusionTV: [],
      typeAffichage: "",
      diffusionRadio: [],
      brief: "",
    },
  });

  const [objectifsOpen, setObjectifsOpen] = useState(false);
  const [mediaTypeOpen, setMediaTypeOpen] = useState(false);
  const [diffusionTVOpen, setDiffusionTVOpen] = useState(false);
  const [diffusionRadioOpen, setDiffusionRadioOpen] = useState(false);

  const selectedMediaTypes = form.watch("mediaType") || [];

  function onSubmit(values: FormValues) {
    toast.success("Succès", {
      description: "Le formulaire a été envoyé correctement.",
    });
  }

  function onInvalid(errors: any) {
    toast.error("Erreur", {
      description: "Veuillez remplir tous les champs du formulaire.",
    });
  }

  return (
    <section>
      <Card className="w-full h-auto rounded-sm shadow-around bg-white border-none text-primary py-20 px-10">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onInvalid)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="periode"
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
                              form.formState.errors.periode
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

                {/* Cible */}
                <FormField
                  control={form.control}
                  name="cible"
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

                {/* Territoire */}
                <FormField
                  control={form.control}
                  name="territoire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Territoire
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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

                {/* Villes */}
                <FormField
                  control={form.control}
                  name="villes"
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

                {/* Budget */}
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Budget
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Précisez votre budget"
                          className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Objectifs avec liste déroulante et cases à cocher */}
                <FormField
                  control={form.control}
                  name="objectifs"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-lg font-semibold">
                        Objectifs
                      </FormLabel>
                      <Popover
                        open={objectifsOpen}
                        onOpenChange={setObjectifsOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="ghost"
                              role="combobox"
                              aria-expanded={objectifsOpen}
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
                                    {field.value.map((objectif) => (
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
                          className="w-full p-0 mt-2 border border-[#A5A4BF] shadow-md rounded-sm"
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
                  name="mediaType"
                  render={({ field }) => (
                    <FormItem>
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
                                    {field.value.map((mediaType) => (
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
                          className="w-[--radix-popover-trigger-width] p-0 mt-2 border border-[#A5A4BF] shadow-md rounded-sm"
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

                {/* Cond. affichage des champs supplémentaires */}
                {selectedMediaTypes.includes("tv") && (
                  <FormField
                    control={form.control}
                    name="diffusionTV"
                    render={({ field }) => (
                      <FormItem>
                        <Popover
                          open={diffusionTVOpen}
                          onOpenChange={setDiffusionTVOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="ghost"
                                role="combobox"
                                aria-expanded={diffusionTVOpen}
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
                                      {field.value?.map((val) => (
                                        <Badge
                                          key={val}
                                          className="bg-primary text-white rounded-sm px-2 py-1 text-sm"
                                        >
                                          {
                                            diffusionTVs.find(
                                              (o) => o.value === val
                                            )?.label
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
                            className="w-[--radix-popover-trigger-width] p-0 mt-2 border border-[#A5A4BF] shadow-md rounded-sm"
                            align="start"
                          >
                            <Command>
                              <CommandEmpty>
                                Aucune diffusion TV trouvée.
                              </CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {diffusionTVs.map((option) => {
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
                    name="typeAffichage"
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
                    name="diffusionRadio"
                    render={({ field }) => (
                      <FormItem>
                        <Popover
                          open={diffusionRadioOpen}
                          onOpenChange={setDiffusionRadioOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="ghost"
                                role="combobox"
                                aria-expanded={diffusionRadioOpen}
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
                                      {field.value?.map((val) => (
                                        <Badge
                                          key={val}
                                          className="bg-primary text-white rounded-sm px-2 py-1 text-sm"
                                        >
                                          {
                                            diffusionRadios.find(
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
                            className="w-[--radix-popover-trigger-width] p-0 mt-2 border border-[#A5A4BF] shadow-md rounded-sm"
                            align="start"
                          >
                            <Command>
                              <CommandEmpty>
                                Aucune diffusion radio trouvée.
                              </CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {diffusionRadios.map((option) => {
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
                <Button type="submit" className="w-full md:w-auto">
                  Envoyer
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
