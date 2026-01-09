'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { ReactNode } from 'react';
import { Button } from '../ui/button';
import CtaButton from '../cta-button';
import { cn } from '@/lib/utils';

type ModalProps = {
  variant?: 'button' | 'icon';
  cta: {
    text?: string;
    icon: React.ReactNode;
  };
  data: {
    title?: ReactNode;
    description?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    subject?: string;
    className?: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  preventAutoClose?: boolean;
};

export default function Modal({
  variant = 'button',
  cta,
  data,
  open,
  onOpenChange,
  preventAutoClose,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {variant === 'button' ? (
          <CtaButton
            variant='trigger'
            props={{ text: cta.text }}
            icon={cta.icon}
            className='cursor-pointer'
          />
        ) : (
          <div className='cursor-pointer hover:opacity-70'>{cta.icon}</div>
        )}
      </DialogTrigger>
      <DialogContent
        className={cn('w-full !max-w-4xl flex flex-col items-center py-15', data.className)}
      >
        {(data.title || data.description) && (
          <DialogHeader>
            {data.title && <DialogTitle className='font-bold text-2xl'>{data.title}</DialogTitle>}
            {data.description && <DialogDescription>{data.description}</DialogDescription>}
          </DialogHeader>
        )}
        <div className='mt-4 w-full max-w-2xl'>{data.children}</div>
        <DialogFooter className='mt-6'>
          {preventAutoClose ? data.footer : <DialogClose asChild>{data.footer}</DialogClose>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
