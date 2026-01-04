"use client";

import React from "react";
import Modal from "@/components/modal/modal";
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
import { useMutation, useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import SvgProfil from "@/components/icons/Profil";
import SvgMail from "@/components/icons/Mail";
import SvgCrayonBig from "@/components/icons/CrayonBig";
import SvgLock from "@/components/icons/Lock";
import SvgCrayon from "@/components/icons/Crayon";

const formSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.optional(
    z.string().min(8, "Le mot de passe doit faire au moins 8 caractères")
  ),
});

type UpdateModalProps = {
  userId: Id<"users">;
  firstname: string;
  lastname: string;
  email: string;
  triggerType?: "button" | "icon";
  triggerText?: string;
};

export default function UpdateAccountModal({
  userId,
  firstname,
  lastname,
  email,
  triggerType = "icon",
  triggerText = "Modifier",
}: UpdateModalProps) {
  const updateUser = useMutation(api.mutations.users.updateUser);
  const updatePassword = useAction(api.actions.users.updateUserPassword);

  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstname, lastname, email, password: "" },
    values: { firstname, lastname, email, password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const promises = [];
      promises.push(
        updateUser({
          userId,
          patch: {
            name: values.firstname,
            lastname: values.lastname,
            email: values.email,
          },
        })
      );

      if (values.password && values.password.length > 0) {
        promises.push(
          updatePassword({
            userId,
            password: values.password,
          })
        );
      }

      await Promise.all(promises);

      toast.success("Compte mis à jour");
      form.reset({ ...values, password: "" });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Échec de la mise à jour");
    } finally {
      setIsSubmitting(false);
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
              name="firstname"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel className="text-lg font-semibold">
                    {" "}
                    <SvgProfil className="fill-primary" />
                    Prénom
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
              name="lastname"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel className="text-lg font-semibold">
                    {" "}
                    <SvgProfil className="fill-primary" />
                    Nom
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

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  <SvgMail className="fill-primary" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@exemple.com"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  <SvgLock className="fill-primary" />
                  Mot de passe
                </FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input
                      type="password"
                      placeholder="••••••••••••"
                      className="!text-base md:text-base placeholder:italic placeholder:text-primary/50 rounded-r-none border-[#A5A4BF] p-5 w-1/2 focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                    />
                    <div className="flex items-center justify-center h-[48px] bg-primary/50 rounded-sm text-base text-white font-medium w-1/2 text-center cursor-default">
                      Définir un nouveau mot de passe
                    </div>
                  </div>
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
          onClick: form.handleSubmit(onSubmit),
          loading: isSubmitting,
        }}
        variant="submit"
      />
    ),
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={setIsOpen}
      preventAutoClose={true}
      variant={triggerType}
      cta={{
        icon:
          triggerType === "button" ? (
            <SvgCrayon />
          ) : (
            <SvgCrayonBig className="cursor-pointer" />
          ),
        text: triggerText,
      }}
      data={modalData}
    />
  );
}
