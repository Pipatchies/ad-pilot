"use client";

import React from "react";
import Modal from "@/components/modal";
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
// import SvgLock from "@/components/icons/Lock";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
// import zxcvbn from "zxcvbn";
// import { getPasswordCriteria } from "@/lib/utils";
import SvgCrayon from "@/components/icons/Crayon";
import SvgUploder from "@/components/icons/Uploder";
import { Checkbox } from "@/components/ui/checkbox";
// import SvgEyeIcon from "@/components/icons/EyeIcon";

const ctaProps = {
  text: "Créer un client",
  icon: <SvgCrayon />,
};

export default function ClientModal() {
  const roles = useQuery(api.queries.roles.getAllRoles);
  const clientRoleId = roles?.find((r) => r.name === "client")?._id;

  // const [passwordStrength, setPasswordStrength] = React.useState(0);

  const formSchema = z.object({
    name: z.string().min(1, "Le nom du client est requis"),
    logo: z.string().min(1, "Le logo est requis"),
    firstname: z.string().min(1, "Le prénom de l'utilisateur est requis"),
    lastname: z.string().min(1, "Le nom de l'utilisateur est requis"),
    email: z.string().email("Email invalide"),
    // password: z
    //   .string()
    //   .min(6, "Au moins 6 caractères")
    //   .regex(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
    //     "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    //   ),
    sendEmail: z.boolean().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      logo: "",
      firstname: "",
      lastname: "",
      email: "",
      // password: "",
      sendEmail: false,
    },
  });

  async function onSubmit(values: FormValues) {
    // const strength = zxcvbn(values.password).score;

    // if (strength < 3) {
    //   toast.error("Mot de passe trop faible", {
    //     description: "Veuillez choisir un mot de passe plus sécurisé.",
    //   });
    //   return;
    // }

    if (!clientRoleId) {
      toast.error("Impossible de créer le compte : rôle client introuvable.");
      return;
    }

    try {
      console.log("Valeurs soumises :", {
        ...values,
        roleId: clientRoleId,
      });

      toast.success("Client créé !");
      form.reset();
    } catch {
      toast.error("Erreur", {
        description: "Veuillez remplir tous les champs du formulaire.",
      });
    }

    if (values.sendEmail) {
      console.log("📧 Envoi d’un email au nouvel utilisateur demandé");
    }
  }

  const userFormData = {
    title: "Créer un client",
    children: (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
          <div className="flex gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel className="text-lg font-semibold">
                    {" "}
                    Nom du client
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Renseigner le nom du client"
                      className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5"
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
              render={() => (
                <FormItem className="w-1/2">
                  <FormLabel className="text-lg font-semibold">
                    {" "}
                    Logo du client
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Importer le logo du client"
                        className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12"
                      />
                      <SvgUploder className="absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-6">
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
                      className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5"
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
                      className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5"
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
                    className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  <SvgLock className="fill-primary" />
                  Mot de passe
                </FormLabel>
                <FormControl>
                  <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const strength = zxcvbn(e.target.value).score;
                      setPasswordStrength(strength);
                    }}
                  />
                  <SvgEyeIcon className="absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
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
          /> */}
          <FormField
            control={form.control}
            name="sendEmail"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    id="sendEmail"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-primary"
                  />
                </FormControl>
                <FormLabel htmlFor="sendEmail" className="text-sm">
                  Envoyer une notification par email au nouvel utilisateur
                </FormLabel>
              </FormItem>
            )}
          />
        </form>
      </Form>
    ),
    footer: (
      <CtaButton
        props={{
          text: "Enregistrer le nouveau client",
          onClick: form.handleSubmit(onSubmit),
        }}
        variant="submit"
      />
    ),
  };
  return <Modal cta={ctaProps} data={userFormData} />;
}
