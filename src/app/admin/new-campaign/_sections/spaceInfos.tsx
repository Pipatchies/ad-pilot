'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Typography from '@/components/typography';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import SvgSmallDown from '@/components/icons/SmallDown';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const mediaTypes = [
  { label: 'Digital', value: 'digital' },
  { label: 'TV', value: 'tv' },
  { label: 'Affichage', value: 'ooh' },
  { label: 'Radio', value: 'radio' },
  { label: 'Cinéma', value: 'cinema' },
  { label: 'Presse', value: 'press' },
];

const tvTypes = [
  { label: 'TV classique', value: 'tv-classique' },
  { label: 'Parrainage TV', value: 'parrainage-tv' },
  { label: 'TV ségmentée', value: 'tv-segmentee' },
  { label: 'Streaming', value: 'streaming' },
];

const radioTypes = [
  { label: 'Radio classique', value: 'radio-classique' },
  { label: 'Parrainage radio', value: 'parrainage-radio' },
  { label: 'Audio digital', value: 'audio-digital' },
];

export default function SpaceInfos() {
  const { control, watch } = useFormContext();
  const mediaTypesWatch = watch('mediaTypes');

  return (
    <Card className='w-full rounded-sm bg-card/20 text-primary px-5 py-10 shadow-none border-none'>
      <CardHeader>
        <Typography variant='h2' className='mb-0'>
          La campagne
        </Typography>
      </CardHeader>

      <CardContent>
        <div className='flex flex-wrap gap-4 items-start'>
          {/* Titre */}
          <FormField
            control={control}
            name='title'
            render={({ field }) => (
              <FormItem className='flex-1 min-w-[250px]'>
                <FormLabel className='text-lg'>Titre de la campagne</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Renseignez le nom de la campagne'
                    className='w-full !text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white'
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
            name='subtitle'
            render={({ field }) => (
              <FormItem className='flex-1 min-w-[250px]'>
                <FormLabel className='text-lg'>Sous-titre</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Renseignez le sous-titre'
                    className='w-full !text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Media Column */}
          <div className='flex-1 min-w-[250px] flex flex-col gap-4'>
            {/* Media types */}
            <FormField
              control={control}
              name='mediaTypes'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-lg'>Média de diffusion</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='ghost'
                          role='combobox'
                          className={cn(
                            'w-full p-5 text-base border border-[#A5A4BF] rounded-sm justify-between bg-white cursor-pointer hover:bg-white hover:text-primary/50',
                            !field.value?.length ? 'text-primary/50 italic' : 'text-primary',
                          )}
                        >
                          {field.value?.length > 0
                            ? field.value.length > 2
                              ? `${field.value.length} types de média sélectionnés`
                              : field.value
                                  .map(
                                    (mediaType: string) =>
                                      mediaTypes.find((o) => o.value === mediaType)?.label,
                                  )
                                  .join(', ')
                            : 'Sélectionnez un ou plusieurs médias'}
                          <SvgSmallDown />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className='w-[--radix-popover-trigger-width] p-0 border border-[#A5A4BF] shadow-sm bg-white'>
                      <Command>
                        <CommandEmpty>Aucun type de média trouvé.</CommandEmpty>

                        <CommandList>
                          <CommandGroup>
                            {mediaTypes.map((mediaType) => {
                              const isSelected = field.value?.includes(mediaType.value);

                              return (
                                <CommandItem
                                  key={mediaType.value}
                                  onSelect={() => {
                                    const newValues = isSelected
                                      ? field.value.filter((v: string) => v !== mediaType.value)
                                      : [...(field.value ?? []), mediaType.value];

                                    field.onChange(newValues);
                                  }}
                                >
                                  <div className='flex items-center gap-2'>
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

            {/* TV Types */}
            {mediaTypesWatch?.includes('tv') && (
              <FormField
                control={control}
                name='tvTypes'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-lg'>Type de TV</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='ghost'
                            role='combobox'
                            className={cn(
                              'w-full p-5 text-base italic border border-[#A5A4BF] rounded-sm justify-between bg-white cursor-pointer hover:bg-white hover:text-primary/50',
                              !field.value?.length ? 'text-primary/50' : 'text-primary',
                            )}
                          >
                            {(field.value || []).length > 0 ? (
                              (field.value || []).length > 2 ? (
                                <span>
                                  {(field.value || []).length} diffusions TV sélectionnées
                                </span>
                              ) : (
                                <div className='flex gap-1 flex-wrap'>
                                  {(field.value || []).map((val: string) => (
                                    <Badge
                                      key={val}
                                      className='bg-primary text-white rounded-sm px-2 py-1 text-sm font-normal italic'
                                    >
                                      {tvTypes.find((o) => o.value === val)?.label}
                                    </Badge>
                                  ))}
                                </div>
                              )
                            ) : (
                              'Sélectionnez une ou plusieurs diffusions TV'
                            )}
                            <SvgSmallDown />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-[--radix-popover-trigger-width] p-0 border border-[#A5A4BF] shadow-sm bg-white'>
                        <Command>
                          <CommandEmpty>Aucune diffusion TV trouvée.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {tvTypes.map((option) => {
                                const isSelected = field.value?.includes(option.value);
                                return (
                                  <CommandItem
                                    key={option.value}
                                    onSelect={() => {
                                      const updatedValue = isSelected
                                        ? field.value?.filter((val: string) => val !== option.value)
                                        : [...(field.value ?? []), option.value];
                                      field.onChange(updatedValue);
                                    }}
                                  >
                                    <div className='flex items-center gap-2'>
                                      <Checkbox checked={isSelected} />
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

            {/* Radio Types */}
            {mediaTypesWatch?.includes('radio') && (
              <FormField
                control={control}
                name='radioTypes'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-lg'>Type de Radio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='ghost'
                            role='combobox'
                            className={cn(
                              'w-full p-5 text-base border border-[#A5A4BF] rounded-sm justify-between bg-white cursor-pointer hover:bg-white hover:text-primary/50',
                              !field.value?.length ? 'text-primary/50 italic' : 'text-primary',
                            )}
                          >
                            {(field.value || []).length > 0 ? (
                              (field.value || []).length > 2 ? (
                                <span>
                                  {(field.value || []).length} diffusions radio sélectionnées
                                </span>
                              ) : (
                                <div className='flex gap-1 flex-wrap'>
                                  {(field.value || []).map((val: string) => (
                                    <Badge
                                      key={val}
                                      className='bg-primary text-white rounded-sm px-2 py-1 text-sm font-normal italic'
                                    >
                                      {radioTypes.find((o) => o.value === val)?.label}
                                    </Badge>
                                  ))}
                                </div>
                              )
                            ) : (
                              'Sélectionnez une ou plusieurs diffusions radio'
                            )}
                            <SvgSmallDown />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-[--radix-popover-trigger-width] p-0 border border-[#A5A4BF] shadow-sm bg-white'>
                        <Command>
                          <CommandEmpty>Aucune diffusion radio trouvée.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {radioTypes.map((option) => {
                                const isSelected = field.value?.includes(option.value);
                                return (
                                  <CommandItem
                                    key={option.value}
                                    onSelect={() => {
                                      const updatedValue = isSelected
                                        ? field.value?.filter((val: string) => val !== option.value)
                                        : [...(field.value ?? []), option.value];
                                      field.onChange(updatedValue);
                                    }}
                                  >
                                    <div className='flex items-center gap-2'>
                                      <Checkbox checked={isSelected} />
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

            {/* Display Types */}
            {mediaTypesWatch?.includes('ooh') && (
              <FormField
                control={control}
                name='displayTypes'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-lg'>Type d'affichage</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full text-base rounded-sm border border-[#A5A4BF] p-5 bg-white cursor-pointer hover:bg-white'>
                          <SelectValue
                            placeholder={
                              <span className='text-primary/50 italic'>Type d'affichage</span>
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='affichage-temporaire'>Affichage temporaire</SelectItem>
                        <SelectItem value='affichage-permanent'>Affichage permanent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
