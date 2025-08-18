"use client";

import React from "react";
import Modal from "@/components/modal";
import SvgCrayonBig from "@/components/icons/CrayonBig";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CtaButton from "@/components/cta-button";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import SvgProfil from "@/components/icons/Profil";
import SvgMail from "@/components/icons/Mail";

const formSchema = z.object({
  organizationName: z.string().min(1, "Le nom du client est requis"),
  logo: z.string().min(1, "Le logo est requis"),
});

type UpdateModalProps = {
  organizationId: Id<"organizations">;
  organizationName: string;
  logo: string;
};

export default function UpdateClientModal({
  organizationId,
  organizationName,
  logo,
}: UpdateModalProps) {
  const updateOrganization = useMutation(
    api.mutations.organizations.updateOrganization
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { organizationName, logo },
    values: { organizationName, logo },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateOrganization({
        organizationId,
        patch: {
          name: values.organizationName,
          logo: values.logo,
        },
      });
      toast.success("Compte mis à jour");
      form.reset(values);
    } catch {
      toast.error("Échec de la mise à jour");
    }
  }

  const modalData = {
    title: "Modifier le compte",
    children: (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel className="text-lg font-semibold">
                    Nom du client
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Prénom"
                      className="!text-base md:text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel className="text-lg font-semibold">
                    Logo
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nom"
                      className="!text-base md:text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    ),
    footer: (
      <CtaButton
        props={{ text: "Enregistrer", onClick: form.handleSubmit(onSubmit) }}
        variant="submit"
      />
    ),
  };

  return (
    <Modal
      variant="icon"
      cta={{ icon: <SvgCrayonBig className="cursor-pointer" /> }}
      data={modalData}
    />
  );
}
