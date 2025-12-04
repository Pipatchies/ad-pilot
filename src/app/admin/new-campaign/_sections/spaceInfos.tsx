"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import SvgSmallDown from "@/components/icons/SmallDown";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mediaTypes = [
  { label: "Digital", value: "digital" },
  { label: "TV", value: "tv" },
  { label: "Affichage", value: "ooh" },
  { label: "Radio", value: "radio" },
  { label: "Cinéma", value: "cinema" },
  { label: "Presse", value: "press" },
];

export default function SpaceInfos() {
  const { control, watch } = useFormContext();
  const mediaTypesWatch = watch("mediaTypes");

  return (
    <Card className="w-full rounded-sm bg-card/20 text-primary px-5 py-10 shadow-none border-none">
      <CardHeader>
        <Typography variant="h2" className="mb-0">
          La campagne
        </Typography>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-4">
          {/* Titre */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[250px]">
                <FormLabel className="text-lg">Titre de la campagne</FormLabel>
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

          {/* Sous-titre */}
          <FormField
            control={control}
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

          {/* Media types */}
          <FormField
            control={control}
            name="mediaTypes"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[250px]">
                <FormLabel className="text-lg">Média de diffusion</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="ghost"
                        role="combobox"
                        className={cn(
                          "w-full p-5 text-base italic border border-[#A5A4BF] rounded-sm justify-between bg-white",
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

                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0 border border-[#A5A4BF] shadow-sm bg-white">
                    <Command>
                      <CommandEmpty>Aucun type de média trouvé.</CommandEmpty>

                      <CommandList>
                        <CommandGroup>
                          {mediaTypes.map((mediaType) => {
                            const isSelected =
                              field.value?.includes(mediaType.value);

                            return (
                              <CommandItem
                                key={mediaType.value}
                                onSelect={() => {
                                  const newValues = isSelected
                                    ? field.value.filter(
                                        (v: string) => v !== mediaType.value
                                      )
                                    : [...(field.value ?? []), mediaType.value];

                                  field.onChange(newValues);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Checkbox checked={isSelected} />
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
  );
}
