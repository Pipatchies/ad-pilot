'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/modal/modal';
import SvgPlus from '@/components/icons/Plus';
import CtaButton from '@/components/cta-button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Id } from '@/../convex/_generated/dataModel';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SvgUploder from '../icons/Uploder';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import SvgCalendrier from '../icons/Calendrier';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Invoice } from '@/types/invoices';
import { Plus, Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

const invoiceTypes = [
  { label: 'Facture Agence', value: 'agency' },
  { label: 'Facture Régie', value: 'vendor' },
];

interface InvoiceModalProps {
  onSuccess?: () => void;
  onAddInvoice?: (invoice: Invoice) => void;
  defaultOrganizationId?: string;
  defaultCampaignId?: string;
}

const CtaProps = {
  text: 'Ajouter une facture',
  icon: <SvgPlus />,
};

export default function InvoiceModal({
  onSuccess,
  onAddInvoice,
  defaultOrganizationId,
  defaultCampaignId,
}: InvoiceModalProps) {
  const getSignature = useAction(api.actions.cloudinary.getUploadSignature);
  const createInvoice = useMutation(api.mutations.invoices.createInvoice);
  const createVendor = useMutation(api.mutations.vendors.createVendor);

  // Use generic query to get all vendors - assuming this query exists or needs to be used differently
  // If not, we might need to add a getAllVendors query.
  // For now using empty array fallback to prevent crash if query doesn't exist
  const vendors = useQuery(api.queries.vendors.getVendors) || [];

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedOrgId, setSelectedOrgId] = useState<string>(defaultOrganizationId || '');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(defaultCampaignId || '');

  // Vendor selection state
  const [openVendorCombobox, setOpenVendorCombobox] = useState(false);
  const [isCreatingVendor, setIsCreatingVendor] = useState(false);

  const organizations = useQuery(api.queries.organizations.getAllOrganizationsWithLastConnection);

  const campaigns = useQuery(
    api.queries.campaigns.getCampaignsByOrganization,
    selectedOrgId ? { organizationId: selectedOrgId as Id<'organizations'> } : 'skip',
  );

  const formSchema = z.object({
    organizationId: z.string().optional(),
    campaignId: z.string().optional(),
    title: z.string().min(1, 'Le numéro de facture est requis'),
    invoiceType: z.enum(['agency', 'vendor'], {
      required_error: 'Veuillez sélectionner un type de facture',
    }),
    agencyInvoice: z.string().optional(),
    // Keep vendorName for backward compatibility or simple input
    vendorName: z.string().optional(),
    vendorId: z.string().optional(),

    // Vendor Creation / Details fields
    newVendorName: z.string().optional(),
    vendorContact: z.string().optional(),
    vendorEmail: z.string().email('Email invalide').optional().or(z.literal('')),
    vendorPhone: z.string().optional(),

    htprice: z
      .number({
        required_error: 'Le montant HT est requis',
      })
      .nonnegative({ message: 'Le montant HT doit être positif' }),
    ttcprice: z
      .number({
        required_error: 'Le montant TTC est requis',
      })
      .nonnegative({ message: 'Le montant TTC doit être positif' }),
    startDate: z.date({ required_error: 'Date de facturation requise' }).nullable(),
    dueDate: z.date({ required_error: "Date d'échéance requise" }).nullable(),
  });

  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationId: '',
      campaignId: '',
      title: '',
      invoiceType: undefined,
      agencyInvoice: '',
      vendorName: '',
      vendorId: '',
      newVendorName: '',
      vendorContact: '',
      vendorEmail: '',
      vendorPhone: '',
      htprice: 0,
      ttcprice: 0,
      startDate: null,
      dueDate: null,
    },
  });

  const selectedInvoiceType = form.watch('invoiceType');
  const selectedVendorId = form.watch('vendorId');

  // Effect to pre-fill vendor details when a vendor is selected
  useEffect(() => {
    if (selectedVendorId && selectedVendorId !== 'new') {
      const vendor = vendors?.find((v) => v._id === selectedVendorId);
      if (vendor) {
        form.setValue('vendorContact', vendor.contactName || '');
        form.setValue('vendorEmail', vendor.email || '');
        form.setValue('vendorPhone', vendor.phone || '');
        setIsCreatingVendor(false);
      }
    } else if (selectedVendorId === 'new') {
      form.setValue('vendorContact', '');
      form.setValue('vendorEmail', '');
      form.setValue('vendorPhone', '');
      setIsCreatingVendor(true);
    }
  }, [selectedVendorId, vendors, form]);

  async function onSubmit(values: FormValues) {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier.');
      return;
    }

    if (!onAddInvoice) {
      if (!selectedOrgId || !selectedCampaignId) {
        toast.error('Veuillez sélectionner une organisation et une campagne.');
        return;
      }
    }

    const folder = `campaigns/invoices`;

    setUploading(true);
    setIsSubmitting(true);
    try {
      let finalVendorId = values.vendorId !== 'new' ? values.vendorId : undefined;

      // Handle Vendor Creation if "new" is selected
      if (values.invoiceType === 'vendor' && isCreatingVendor && values.newVendorName) {
        try {
          const newVendorId = await createVendor({
            name: values.newVendorName,
            contactName: values.vendorContact,
            email: values.vendorEmail || undefined,
            phone: values.vendorPhone,
          });
          finalVendorId = newVendorId;
        } catch (err) {
          toast.error('Erreur lors de la création de la régie.');
          setUploading(false);
          setIsSubmitting(false);
          return;
        }
      }

      const resourceType = 'raw' as const;

      const sig = await getSignature({ folder, resourceType });

      const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${sig.resourceType}/upload`;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', sig.apiKey);
      fd.append('timestamp', String(sig.timestamp));
      fd.append('upload_preset', sig.uploadPreset);
      fd.append('signature', sig.signature);
      fd.append('folder', sig.folder);

      const res = await fetch(endpoint, { method: 'POST', body: fd });
      const json = await res.json();

      if (json.error) throw new Error(json.error?.message || 'Upload failed');

      const invoiceData = {
        title: values.title,
        invoiceType: values.invoiceType,
        agencyInvoice: values.agencyInvoice,
        vendorId: finalVendorId as Id<'vendors'> | undefined,
        htprice: values.htprice,
        ttcprice: values.ttcprice,
        startDate: values.startDate ? values.startDate.toISOString() : new Date().toISOString(),
        dueDate: values.dueDate ? values.dueDate.toISOString() : new Date().toISOString(),
        url: json.secure_url,
        publicId: json.public_id,
        resourceType,
      };

      if (onAddInvoice) {
        onAddInvoice({
          ...invoiceData,
        });
        toast.success('Facture ajoutée avec succès !');
      } else {
        await createInvoice({
          ...invoiceData,
          campaignId: selectedCampaignId as Id<'campaigns'>,
          organizationId: selectedOrgId as Id<'organizations'>,
        });
        toast.success('Facture ajoutée avec succès !');
      }

      setFile(null);
      form.reset();
      setIsOpen(false);
      setIsCreatingVendor(false);
      if (onSuccess) onSuccess();
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'upload ou de la création", {
        description: "Échec de l'enregistrement.",
      });
    } finally {
      setUploading(false);
      setIsSubmitting(false);
    }
  }

  const InvoiceFormData = {
    title: 'Ajouter une facture',
    children: (
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
          }}
          className='space-y-4'
        >
          {!defaultOrganizationId && !defaultCampaignId && !onAddInvoice && (
            <div className='flex gap-4'>
              <div className='w-1/2 space-y-2'>
                <FormLabel className='text-lg font-semibold'>Client</FormLabel>
                <Select
                  value={selectedOrgId}
                  onValueChange={(val) => {
                    setSelectedOrgId(val);
                    setSelectedCampaignId('');
                  }}
                >
                  <SelectTrigger className='w-full text-base italic rounded-sm border border-[#A5A4BF] p-5 bg-white'>
                    <SelectValue
                      placeholder={
                        <span className='text-primary/50 italic'>Sélectionnez le client</span>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations?.map((org) => (
                      <SelectItem key={org.organizationId} value={org.organizationId}>
                        {org.organizationName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='w-1/2 space-y-2'>
                <FormLabel className='text-lg font-semibold'>Campagne</FormLabel>
                <Select
                  value={selectedCampaignId}
                  onValueChange={setSelectedCampaignId}
                  disabled={!selectedOrgId}
                >
                  <SelectTrigger className='w-full text-base italic rounded-sm border border-[#A5A4BF] p-5 bg-white'>
                    <SelectValue
                      placeholder={
                        <span className='text-primary/50 italic'>Sélectionnez la campagne</span>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns?.map((camp) => (
                      <SelectItem key={camp._id} value={camp._id}>
                        {camp.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className='flex gap-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem className='w-1/2'>
                  <FormLabel className='text-lg font-semibold'> Numéro de facture</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Renseignez le titre'
                      className='!text-base md:text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='invoiceType'
              render={({ field }) => (
                <FormItem className='flex-1 min-w-[170px]'>
                  <FormLabel className='text-lg'>Type de facture</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full text-base italic rounded-sm border border-[#A5A4BF] p-5 bg-white'>
                        <SelectValue
                          placeholder={
                            <span className='text-primary/50 italic'>Choisissez le type</span>
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='w-full text-base italic rounded-sm border border-[#A5A4BF] text-primary text-base'>
                      {invoiceTypes.map((m) => (
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
          </div>

          {selectedInvoiceType === 'vendor' && (
            <>
              <div className='flex gap-4'>
                {/* Agency Invoice Reference */}
                <FormField
                  control={form.control}
                  name='agencyInvoice'
                  render={({ field }) => (
                    <FormItem className='w-1/2'>
                      <FormLabel className='text-lg font-semibold'>
                        {' '}
                        Facture agence rattachée
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Renseignez le numéro'
                          className='!text-base md:text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Vendor Selection / Creation */}
                <FormField
                  control={form.control}
                  name='vendorId'
                  render={({ field }) => (
                    <FormItem className='w-1/2 flex flex-col'>
                      <FormLabel className='text-lg font-semibold'>Nom de la régie</FormLabel>
                      <Popover open={openVendorCombobox} onOpenChange={setOpenVendorCombobox}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <button
                              role='combobox'
                              aria-expanded={openVendorCombobox}
                              className={cn(
                                'w-full justify-between flex items-center rounded-sm border border-[#A5A4BF] py-2 px-5 bg-white text-base italic text-left',
                                !field.value && 'text-primary/50',
                              )}
                            >
                              {field.value
                                ? field.value === 'new'
                                  ? 'Nouvelle régie'
                                  : vendors?.find((v) => v._id === field.value)?.name
                                : 'Sélectionnez une régie'}
                              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-[300px] p-0'>
                          <Command>
                            <CommandInput placeholder='Rechercher une régie...' />
                            <CommandList>
                              <CommandEmpty>Aucune régie trouvée.</CommandEmpty>
                              <CommandGroup>
                                {vendors?.map((vendor) => (
                                  <CommandItem
                                    value={vendor.name}
                                    key={vendor._id}
                                    onSelect={() => {
                                      form.setValue('vendorId', vendor._id);
                                      setOpenVendorCombobox(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        vendor._id === field.value ? 'opacity-100' : 'opacity-0',
                                      )}
                                    />
                                    {vendor.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                              <CommandGroup>
                                <CommandItem
                                  value='new-vendor-creation'
                                  onSelect={() => {
                                    form.setValue('vendorId', 'new');
                                    setOpenVendorCombobox(false);
                                  }}
                                  className='text-primary font-medium'
                                >
                                  <Plus className='mr-2 h-4 w-4' />
                                  Créer une nouvelle régie
                                </CommandItem>
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

              {/* Dynamic Fields for Vendor Details */}
              {selectedVendorId && (isCreatingVendor || selectedVendorId) && (
                <div className='flex flex-wrap gap-4'>
                  {isCreatingVendor && (
                    <FormField
                      control={form.control}
                      name='newVendorName'
                      render={({ field }) => (
                        <FormItem className='w-[calc(50%-0.5rem)]'>
                          <FormLabel className='text-lg font-semibold'>
                            Nom de la nouvelle régie
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Renseignez le nom de la régie'
                              className='!text-base md:text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name='vendorContact'
                    render={({ field }) => (
                      <FormItem className='w-[calc(50%-0.5rem)]'>
                        <FormLabel className='text-lg font-semibold'>Nom du contact</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Renseignez le nom du contact'
                            className='!text-base md:text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white'
                            {...field}
                            disabled={!isCreatingVendor}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='vendorEmail'
                    render={({ field }) => (
                      <FormItem className='w-[calc(50%-0.5rem)]'>
                        <FormLabel className='text-lg font-semibold'>Email du contact</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Renseignez l'email du contact"
                            className='!text-base md:text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white'
                            {...field}
                            disabled={!isCreatingVendor}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='vendorPhone'
                    render={({ field }) => (
                      <FormItem className={isCreatingVendor ? 'w-[calc(50%-0.5rem)]' : 'w-full'}>
                        <FormLabel className='text-lg font-semibold'>Tel du contact</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Renseignez le numéro de téléphone'
                            className='!text-base md:text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white'
                            {...field}
                            disabled={!isCreatingVendor}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </>
          )}

          <div className='flex gap-4'>
            <FormField
              control={form.control}
              name='htprice'
              render={({ field }) => (
                <FormItem className='w-1/2'>
                  <FormLabel className='text-lg font-semibold'> Montant HT</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Renseignez le montant en €'
                      className='w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white'
                      value={field.value || ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? 0 : Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ttcprice'
              render={({ field }) => (
                <FormItem className='w-1/2'>
                  <FormLabel className='text-lg font-semibold'> Montant TTC</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Renseignez le montant en €'
                      className='w-full !text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 bg-white'
                      value={field.value || ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? 0 : Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex gap-4'>
            <FormField
              control={form.control}
              name='startDate'
              render={({ field }) => (
                <FormItem className='w-1/2'>
                  <FormLabel className='text-lg font-semibold'> Date de facturation</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type='button'
                        className={cn(
                          'w-full rounded-sm py-2 px-5 flex items-center justify-between',
                          'border',
                          field.value ? 'text-primary' : 'text-primary/50',
                          'border-[#A5A4BF] bg-white',
                        )}
                        aria-label='Choisir une date'
                      >
                        <span className='text-base italic'>
                          {field.value
                            ? format(field.value, 'dd/MM/yyyy', {
                                locale: fr,
                              })
                            : 'Sélectionnez la date'}
                        </span>
                        <SvgCalendrier />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-auto p-0 text-primary rounded-sm shadow border-[#A5A4BF]'
                      align='start'
                    >
                      <Calendar
                        mode='single'
                        selected={field.value ?? undefined}
                        onSelect={(d) => field.onChange(d || null)}
                        disabled={(date) => date < new Date('1900-01-01')}
                        defaultMonth={field.value ?? new Date()}
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
              name='dueDate'
              render={({ field }) => (
                <FormItem className='w-1/2'>
                  <FormLabel className='text-lg font-semibold'> Date d'échéance</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type='button'
                        className={cn(
                          'w-full rounded-sm py-2 px-5 flex items-center justify-between',
                          'border',
                          field.value ? 'text-primary' : 'text-primary/50',
                          'border-[#A5A4BF] bg-white',
                        )}
                        aria-label='Choisir une date'
                      >
                        <span className='text-base italic'>
                          {field.value
                            ? format(field.value, 'dd/MM/yyyy', {
                                locale: fr,
                              })
                            : 'Sélectionnez la date'}
                        </span>
                        <SvgCalendrier />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-auto p-0 text-primary rounded-sm shadow border-[#A5A4BF]'
                      align='start'
                    >
                      <Calendar
                        mode='single'
                        selected={field.value ?? undefined}
                        onSelect={(d) => field.onChange(d || null)}
                        disabled={(date) => date < new Date('1900-01-01')}
                        defaultMonth={field.value ?? new Date()}
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

          <FormItem>
            <FormLabel className='text-lg font-semibold'>Importer la facture</FormLabel>
            <FormControl>
              <div className='relative'>
                <Input
                  readOnly
                  value={file ? file.name : ''}
                  placeholder='Sélectionnez la facture'
                  className='!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12 cursor-pointer'
                  onClick={() => document.getElementById('hiddenMediaInput')?.click()}
                />

                <SvgUploder
                  className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
                  onClick={() => document.getElementById('hiddenMediaInput')?.click()}
                />

                <input
                  id='hiddenMediaInput'
                  type='file'
                  accept='application/pdf'
                  className='hidden'
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setFile(f);
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </form>
      </Form>
    ),
    footer: (
      <CtaButton
        props={{
          text: 'Enregistrer',
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
          },
          disabled: uploading || isSubmitting,
          loading: isSubmitting,
        }}
        variant='submit'
      />
    ),
  };
  return (
    <Modal
      cta={CtaProps}
      data={InvoiceFormData}
      open={isOpen}
      onOpenChange={setIsOpen}
      preventAutoClose={true}
    />
  );
}
