"use client";

import React from "react";
import Modal from "@/components/modal";
import SvgPlus from "@/components/icons/Plus";
import CtaButton from "@/components/cta-button";
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
import SvgProfil from "@/components/icons/Profil";
import SvgMail from "@/components/icons/Mail";
import SvgLock from "@/components/icons/Lock";

const ctaProps = {
  text: "Ajouter un compte",
  icon: <SvgPlus />,
};



export default function AccountModal() {
  const formSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Au moins 6 caractères"),
});

type FormValues = z.infer<typeof formSchema>;
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  },
});

async function onSubmit(values: FormValues) {
  try {
    console.log("Form data:", values);
    toast.success("Succès", {
      description: "Le formulaire a été envoyé correctement.",
    });
  } catch {
    toast.error("Erreur", {
      description: "Veuillez remplir tous les champs du formulaire.",
    });
  }
}

const userFormData = {
  title: "Créer un compte administrateur",
  children: (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel className="text-lg font-semibold"> <SvgProfil className="fill-primary"/>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Votre prénom" className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel className="text-lg font-semibold"> <SvgProfil className="fill-primary"/>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold"><SvgMail className="fill-primary"/>Email</FormLabel>
              <FormControl>
                <Input placeholder="Renseignez votre email" className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold"><SvgLock className="fill-primary"/>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  ),
  footer: (
    <CtaButton
      props={{
        text: "Enregistrer",
      }}
      variant="submit"
    />
  ),
};
  return <Modal cta={ctaProps} data={userFormData} />;
}
