'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Typography from '@/components/typography';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useFormContext } from 'react-hook-form';

interface Props {
  organizations: {
    organizationId: Id<'organizations'>;
    organizationName: string;
    logo: string;
    step: string;
    createdAt: number;
    lastConnectionTime: number;
  }[];
  disabled?: boolean;
}

export default function ClientSection({ organizations, disabled }: Props) {
  const { control } = useFormContext();

  return (
    <Card className='w-full rounded-sm bg-card/20 text-primary px-5 py-10 shadow-none border-none'>
      <CardHeader>
        <Typography variant='h2'>Le client</Typography>
      </CardHeader>

      <CardContent>
        <FormField
          control={control}
          name='organization'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className='text-lg'>Le client</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
                <FormControl>
                  <SelectTrigger
                    className={`w-1/3 text-base rounded-sm border p-5 bg-white cursor-pointer hover:bg-white ${
                      fieldState.error ? 'border-destructive' : 'border-[#A5A4BF]'
                    }`}
                  >
                    <SelectValue
                      placeholder={
                        <span className='italic text-primary/50'>Sélectionnez un client</span>
                      }
                    />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.organizationId} value={org.organizationId}>
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
  );
}
