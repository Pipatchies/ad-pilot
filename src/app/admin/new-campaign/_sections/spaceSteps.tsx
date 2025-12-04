"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import Typography from "@/components/typography";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import SvgCalendrier from "@/components/icons/Calendrier";
import { cn } from "@/lib/utils";

const stateOptions = [
  { label: "En cours", value: "current" },
  { label: "Terminé", value: "completed" },
  { label: "En attente", value: "upcoming" },
];

export default function SpaceSteps() {
  const { control, watch } = useFormContext();
    const steps = watch("status") || [];

  return (
    <Card className="w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10">
      <CardHeader>
        <Typography variant="h2" className="mb-0">Les étapes</Typography>
      </CardHeader>

      <CardContent>
        {/* Headers */}
        <div className="flex flex-wrap gap-4 mb-2">
          <div className="flex-1 min-w-[170px] text-lg">Étape</div>
          <div className="flex-1 min-w-[170px] text-lg">État</div>
          <div className="flex-1 min-w-[170px] text-lg">Date de lancement</div>
        </div>

        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-wrap gap-4 mb-4">
            
            {/* LABEL */}
            <FormField
              control={control}
              name={`status.${index}.label`}
              render={({ field, fieldState }) => (
                <FormItem className="flex-1 min-w-[170px]">
                  <FormControl>
                    <input
                      className={cn(
                        "w-full p-5 rounded-sm border bg-white italic",
                        fieldState.error ? "border-destructive" : "border-[#A5A4BF]"
                      )}
                      placeholder="Nom étape"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* STATE */}
            <FormField
              control={control}
              name={`status.${index}.state`}
              render={({ field, fieldState }) => {
                const prev = steps[index - 1]?.state;

                return (
                  <FormItem className="flex-1 min-w-[170px]">
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            "w-full p-5 rounded-sm border bg-white italic",
                            fieldState.error ? "border-destructive" : "border-[#A5A4BF]"
                          )}
                        >
                          <SelectValue placeholder="Sélectionnez l'état" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {stateOptions.map((opt) => {
                          // règles métier
                          const disabled =
                            (index > 0 && !prev) ||
                            (opt.value === "completed" && index > 0 && prev !== "completed") ||
                            (opt.value === "current" && prev === "upcoming") ||
                            (opt.value === "upcoming" && prev === "completed") ||
                            (opt.value === "current" && prev === "current");

                          return (
                            <SelectItem key={opt.value} value={opt.value} disabled={disabled}>
                              {opt.label}
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

            {/* DEADLINE */}
            <FormField
              control={control}
              name={`status.${index}.deadline`}
              render={({ field, fieldState }) => (
                <FormItem className="flex-1 min-w-[170px]">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full rounded-sm py-2 px-5 flex items-center justify-between",
                          "border bg-white italic",
                          fieldState.error ? "border-destructive" : "border-[#A5A4BF]"
                        )}
                      >
                        <span className="text-base">
                          {field.value
                            ? format(field.value, "dd/MM/yyyy", { locale: fr })
                            : "Sélectionnez la date"}
                        </span>
                        <SvgCalendrier />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={(d) => field.onChange(d ?? null)}
                        disabled={(date) => {
                          const prev = watch(`status.${index - 1}.deadline`);
                          return prev ? date <= prev : false;
                        }}
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
  );
}
