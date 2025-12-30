"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
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
import CtaButton from "@/components/cta-button";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import SvgPlus from "@/components/icons/Plus";

const mediaTypes = [
  { label: "Digital", value: "digital" },
  { label: "TV", value: "tv" },
  { label: "Affichage", value: "affichage" },
  { label: "Radio", value: "radio" },
  { label: "Cinéma", value: "cinema" },
  { label: "Presse", value: "presse" },
];

const formSchema = z.object({
  medias: z.array(
    z.object({
      type: z.string().min(1, "Le type de média est requis"),
      regie: z.string().min(1, "Le nom de la regie est requis"),
      format: z.string().min(1, "Le format est requis"),
      quantity: z.string().min(1, "La quantité est requise"),
      period: z
        .object({
          from: z.date().optional(),
          to: z.date().optional(),
        })
        .refine((data) => data.from && data.to, {
          message: "Veuillez sélectionner une période",
        }),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

export default function QuoteForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const createQuote = useMutation(
    api.mutations.quotes.createQuote
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medias: [
        {
          type: "",
          regie: "",
          format: "",
          quantity: "",
          period: { from: undefined, to: undefined },
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medias",
  });

  React.useEffect(() => {
    if (fields.length === 0) {
      append({
        type: "",
        regie: "",
        format: "",
        quantity: "",
        period: { from: undefined, to: undefined },
      });
    }
  }, [fields, append]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const formattedMedias = values.medias.map((m) => ({
        ...m,
        period: {
          from: m.period.from?.toISOString(),
          to: m.period.to?.toISOString(),
        },
      }));

      await createQuote({ medias: formattedMedias });

      toast.success("Votre demande de devis a été envoyée avec succès !");
      form.reset({
        medias: [
          {
            type: "",
            regie: "",
            format: "",
            quantity: "",
            period: { from: undefined, to: undefined },
          },
        ],
      });
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <Card className="w-full h-auto rounded-sm shadow-around bg-white border-none text-primary py-20 px-10">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-6 relative">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-primary">
                      Média #{index + 1}
                    </h3>
                  </div>

                  {/* Type de média - Full Width */}
                  <FormField
                    control={form.control}
                    name={`medias.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-lg font-semibold">
                          Type de média
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full !text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white">
                              <SelectValue
                                placeholder={
                                  <span className="text-primary/50 italic">
                                    Sélectionnez le média
                                  </span>
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="text-primary">
                            {mediaTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Other fields - 2 Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Régie concerned */}
                    <FormField
                      control={form.control}
                      name={`medias.${index}.regie`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">
                            Régie concernée
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Précisez le nom de la régie concernée"
                              className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Format */}
                    <FormField
                      control={form.control}
                      name={`medias.${index}.format`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">
                            Le format
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Précisez le format"
                              className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Quantity */}
                    <FormField
                      control={form.control}
                      name={`medias.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">
                            Quantité souhaitée
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Renseignez la quantité"
                              className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Period */}
                    <FormField
                      control={form.control}
                      name={`medias.${index}.period`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col relative">
                          <FormLabel className="text-lg font-semibold">
                            Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <div
                                className={cn(
                                  "w-full rounded-sm py-2 px-5 flex items-center justify-between cursor-pointer bg-white",
                                  "border",
                                  !field.value?.from
                                    ? "text-primary/50"
                                    : "text-primary",
                                  "border-[#A5A4BF]"
                                )}
                              >
                                <span className="text-base italic">
                                  {field.value?.from ? (
                                    field.value.to ? (
                                      <>
                                        {format(
                                          field.value.from,
                                          "dd/MM/yyyy",
                                          {
                                            locale: fr,
                                          }
                                        )}{" "}
                                        -{" "}
                                        {format(field.value.to, "dd/MM/yyyy", {
                                          locale: fr,
                                        })}
                                      </>
                                    ) : (
                                      format(field.value.from, "dd/MM/yyyy", {
                                        locale: fr,
                                      })
                                    )
                                  ) : (
                                    "Sélectionnez la période"
                                  )}
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
                                selected={
                                  field.value
                                    ? {
                                        from: field.value.from,
                                        to: field.value.to,
                                      }
                                    : undefined
                                }
                                onSelect={(range) => {
                                  field.onChange(range);
                                }}
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
                  {index < fields.length - 1 && (
                    <div className="border-b border-[#A5A4BF]/30 my-8" />
                  )}
                </div>
              ))}

              <div className="flex gap-4 mt-4 justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  className="px-4 py-2 font-semibold cursor-pointer underline text-primary"
                  onClick={() =>
                    append({
                      type: "",
                      regie: "",
                      format: "",
                      quantity: "",
                      period: { from: undefined, to: undefined },
                    })
                  }
                >
                  Ajouter un autre média <SvgPlus />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="px-4 py-2 font-semibold cursor-pointer text-primary"
                  onClick={() => remove(fields.length - 1)}
                  disabled={fields.length <= 1}
                >
                  Supprimer
                </Button>
              </div>

              <div className="w-full flex justify-center pt-6">
                <CtaButton
                  props={{
                    text: "Envoyer",
                    onClick: form.handleSubmit(onSubmit),
                    disabled: isSubmitting,
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
