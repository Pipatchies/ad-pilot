'use client';

import React, { Children } from 'react';
import Modal from '@/components/modal/modal';
import SvgCorbeille from '@/components/icons/Corbeille';
import { toast } from 'sonner';
import CtaButton from '@/components/cta-button';

type deleteModalProps = {
  onConfirm: () => Promise<any>;
};

export default function DeleteModal({ onConfirm }: deleteModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  async function handleDelete() {
    setIsSubmitting(true);
    try {
      await onConfirm();
      toast.success('Supprimé avec succès');
      setIsOpen(false);
    } catch {
      toast.error('Échec de la suppression');
    } finally {
      setIsSubmitting(false);
    }
  }

  const modalData = {
    title: (
      <div className='flex flex-col items-center space-y-2'>
        <SvgCorbeille />
        <h2 className='text-2xl font-bold text-primary text-center'>Confirmation de suppression</h2>
      </div>
    ),
    children: (
      <div className='flex items-center justify-center'>
        <p className='text-center max-w-sm'>
          Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
        </p>
      </div>
    ),
    footer: (
      <div className='flex items-center justify-center gap-4'>
        <CtaButton
          props={{
            text: 'Supprimer',
            onClick: handleDelete,
            loading: isSubmitting,
          }}
          variant='submit'
        />
        <CtaButton props={{ text: 'Annuler' }} variant='cancel' />
      </div>
    ),
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={setIsOpen}
      preventAutoClose={true}
      variant='icon'
      cta={{ icon: <SvgCorbeille className='cursor-pointer' /> }}
      data={modalData}
    />
  );
}
