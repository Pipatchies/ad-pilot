"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type ModalProps = {
  cta: {
    text: string;
    icon: React.ReactNode;
  };
  data: {
    title?: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    subject?: string;
    className?: string;
  };
};

export default function Modal({ cta, data }: ModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="group flex items-center gap-2 p-5 rounded-sm text-base font-semibold transition border border-primary text-primary hover:bg-primary hover:text-white"
        >
          <div className="mr-2">{cta.icon}</div>
          <span className="block !leading-none relative font-[600] cursor-pointer">
            {cta.text}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "w-full !max-w-4xl flex flex-col items-center py-15",
          data.className
        )}
      >
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">{data.title}</DialogTitle>
          <DialogDescription>{data.description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 w-full max-w-2xl">{data.children}</div>
        <DialogFooter className="mt-6">
          <DialogClose asChild>{data.footer}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
