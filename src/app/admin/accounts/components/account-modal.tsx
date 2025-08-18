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
import { useAction, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import zxcvbn from "zxcvbn";
import { getPasswordCriteria } from "@/lib/utils";

const CtaProps = {
  text: "Ajouter un compte",
  icon: <SvgPlus />,
};

export default function AccountModal() {
  const roles = useQuery(api.queries.roles.getAllRoles);
  const adminRoleId = roles?.find((r) => r.name === "admin")?._id;
  const adminCreateUser = useAction(api.actions.users.adminCreateAdmin);


  const [passwordStrength, setPasswordStrength] = React.useState(0);

  const formSchema = z.object({
    firstname: z.string().min(1, "Le prénom est requis"),
    lastname: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(6, "Au moins 6 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
      ),
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
    const strength = zxcvbn(values.password).score;

    if (strength < 3) {
      toast.error("Mot de passe trop faible", {
        description: "Veuillez choisir un mot de passe plus sécurisé.",
      });
      return;
    }

    if (!adminRoleId) {
      toast.error("Impossible de créer le compte : rôle admin introuvable.");
      return;
    }

    try {
      await adminCreateUser({
        email: values.email,
        firstname: values.firstname,
        lastname: values.lastname,
        password: values.password,
        roleId: adminRoleId,
      });

      toast.success("Compte administrateur créé !");
      form.reset();
    } catch (e: any) {
      const msg =
        e?.data === "EMAIL_TAKEN" ? "Email déjà utilisé." :
        e?.data === "FORBIDDEN" ? "Accès refusé." :
        e?.data === "UNAUTHENTICATED" ? "Vous devez être connecté." :
        "Échec de la création.";
      toast.error("Erreur", { description: msg });
    }
  }


  const UserFormData = {
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
                  <FormLabel className="text-lg font-semibold">
                    {" "}
                    <SvgProfil className="fill-primary" />
                    Prénom
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Votre prénom"
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
                      placeholder="Votre nom"
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
                    placeholder="Renseignez votre email"
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
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="!text-base md:text-base placeholder:italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const strength = zxcvbn(e.target.value).score;
                      setPasswordStrength(strength);
                    }}
                  />
                </FormControl>
                <div className="h-2 w-full bg-gray-200 rounded mt-3">
                  <div
                    className={`h-full rounded transition-all`}
                    style={{
                      width: `${(passwordStrength / 4) * 100}%`,
                      backgroundColor:
                        passwordStrength < 2
                          ? "#dc2626"
                          : passwordStrength === 2
                          ? "#facc15"
                          : "#16a34a",
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Force :{" "}
                  {
                    ["Très faible", "Faible", "Moyenne", "Forte", "Très forte"][
                      passwordStrength
                    ]
                  }
                </p>

                {(() => {
                  const criteria = getPasswordCriteria(form.watch("password"));
                  return (
                    <ul className="mt-2 text-sm space-y-1">
                      <li
                        className={
                          criteria.hasLowercase
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        {criteria.hasLowercase ? "✅" : "❌"} Une minuscule
                      </li>
                      <li
                        className={
                          criteria.hasUppercase
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        {criteria.hasUppercase ? "✅" : "❌"} Une majuscule
                      </li>
                      <li
                        className={
                          criteria.hasNumber ? "text-green-600" : "text-red-500"
                        }
                      >
                        {criteria.hasNumber ? "✅" : "❌"} Un chiffre
                      </li>
                      <li
                        className={
                          criteria.hasSpecialChar
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        {criteria.hasSpecialChar ? "✅" : "❌"} Un caractère
                        spécial
                      </li>
                    </ul>
                  );
                })()}
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
        }}
        variant="submit"
      />
    ),
  };
  return <Modal cta={CtaProps} data={UserFormData} />;
}
