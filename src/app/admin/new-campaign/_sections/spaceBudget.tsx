"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Typography from "@/components/typography";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import SvgCalendrier from "@/components/icons/Calendrier";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import React from "react";

const mediaTypes = [
  { label: "Digital", value: "digital" },
  { label: "TV", value: "tv" },
  { label: "Affichage", value: "ooh" },
  { label: "Radio", value: "radio" },
  { label: "Cinéma", value: "cinema" },
  { label: "Presse", value: "press" },
];

import BudgetInput from "@/components/budget-input";

export default function SpaceBudget() {
  const { control, watch } = useFormContext();

  const mediaTypesWatch = watch("mediaTypes");

  const { fields: budgetFields } = useFieldArray({
    control,
    name: "budgetMedia",
  });

  return (
    <Card className="w-full rounded-sm bg-card/20 text-primary px-5 py-10 shadow-none border-none">
      <CardHeader>
        <Typography variant="h2" className="mb-0">
          Le budget
        </Typography>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ---------------- Budget total ---------------- */}
        <FormField
          control={control}
          name="budgetTotal"
          render={({ field }) => (
            <FormItem className="flex-1 min-w-[150px]">
              <FormLabel className="text-lg">Budget total</FormLabel>
              <FormControl>
                <BudgetInput
                  placeholder="Budget en €"
                  className="w-1/3 !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------------- Budgets par média ---------------- */}
        <div className="space-y-8">
          {budgetFields.map((row, index) => (
            <div key={row.id}>
              {index > 0 && (
                <div className="border-t border-gray-300 my-8"></div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* MEDIA TYPE */}
                <FormField
                  control={control}
                  name={`budgetMedia.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Média</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full text-base italic rounded-sm border border-[#A5A4BF] p-5 bg-white">
                            <SelectValue placeholder="Type de média" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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

                {/* AMOUNT */}
                <FormField
                  control={control}
                  name={`budgetMedia.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Budget</FormLabel>
                      <FormControl>
                        <BudgetInput
                          placeholder="Budget en €"
                          className="w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* POURCENT */}
                <FormField
                  control={control}
                  name={`budgetMedia.${index}.pourcent`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Part honoraire</FormLabel>
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

                {/* PERIOD */}
                <FormField
                  control={control}
                  name={`budgetMedia.${index}.period`}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Période</FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            className={cn(
                              "w-full rounded-sm py-2 px-5 flex items-center justify-between cursor-pointer bg-white",
                              "border",
                              fieldState.error
                                ? "border-destructive"
                                : "border-[#A5A4BF]"
                            )}
                          >
                            <span className="text-base italic">
                              {field.value?.from && field.value?.to
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

                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="range"
                            selected={{
                              from: field.value?.from ?? undefined,
                              to: field.value?.to ?? undefined,
                            }}
                            onSelect={(range) => {
                              field.onChange({
                                from: range?.from ?? null,
                                to: range?.to ?? null,
                              });
                            }}
                            locale={fr}
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* TITLE */}
                <FormField
                  control={control}
                  name={`budgetMedia.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
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

                {/* DETAILS */}
                <FormField
                  control={control}
                  name={`budgetMedia.${index}.details`}
                  render={({ field }) => (
                    <FormItem>
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
