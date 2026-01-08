'use client';

import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Typography from '@/components/typography';
import SvgPlus from '@/components/icons/Plus';
import SvgUploder from '@/components/icons/Uploder';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';

export default function SpaceTarget() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'targetLine',
  });

  return (
    <Card className='w-full h-auto rounded-sm text-primary bg-card/20 shadow-none border-none px-5 py-10'>
      <CardHeader>
        <Typography variant='h2' className='mb-0'>
          Les cibles de la campagne
        </Typography>
      </CardHeader>

      <CardContent>
        {/* Header */}
        <div className='flex flex-wrap gap-4 mb-2'>
          <div className='flex-1 min-w-[170px] text-lg'>Intitulé de la cible</div>
          <div className='flex-1 min-w-[170px] text-lg'>Fichier CSV</div>
        </div>

        {/* Lines */}
        {fields.map((row, index) => (
          <div key={row.id} className='flex flex-wrap gap-4 mb-4'>
            {/* TARGET LABEL */}
            <FormField
              control={control}
              name={`targetLine.${index}.target`}
              render={({ field, fieldState }) => (
                <FormItem className='flex-1 min-w-[170px]'>
                  <FormControl>
                    <Input
                      placeholder="Renseignez l'intitulé"
                      className={cn(
                        'w-full rounded-sm border bg-white placeholder:italic placeholder:text-primary/50 p-5',
                        fieldState.error ? 'border-destructive' : 'border-[#A5A4BF]',
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CSV FILE */}
            <FormField
              control={control}
              name={`targetLine.${index}.csvFiles`}
              render={({ field, fieldState }) => (
                <FormItem className='flex-1 min-w-[170px]'>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        placeholder='Importer le fichier CSV'
                        className={cn(
                          'rounded-sm border bg-white placeholder:italic placeholder:text-primary/50 p-5 pr-12',
                          fieldState.error ? 'border-destructive' : 'border-[#A5A4BF]',
                        )}
                        {...field}
                      />
                      <SvgUploder className='absolute right-3 top-1/2 -translate-y-1/2' />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        {/* Add / Remove */}
        <div className='flex gap-4 mt-4'>
          <Button
            type='button'
            variant='ghost'
            className='px-4 py-2 font-semibold cursor-pointer underline'
            onClick={() =>
              append({
                target: '',
                csvFiles: '',
              })
            }
          >
            Ajouter <SvgPlus />
          </Button>

          <Button
            type='button'
            variant='ghost'
            className='px-4 py-2 font-semibold cursor-pointer'
            onClick={() => remove(fields.length - 1)}
            disabled={fields.length === 0}
          >
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
