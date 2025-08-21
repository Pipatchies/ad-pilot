"use client";

import Image from "next/image";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const forgotSchema = z.object({
  email: z.string().email("Email invalide"),
});
type ForgotValues = z.infer<typeof forgotSchema>;

const verifySchema = z.object({
  code: z.string().min(4, "Code requis"),
  newPassword: z.string().min(6, "Au moins 6 caractères"),
});
type VerifyValues = z.infer<typeof verifySchema>;

export default function PasswordReset() {
  const { signIn } = useAuthActions();
  const router = useRouter();

  const [step, setStep] = useState<"forgot" | "verify">("forgot");
  const [err, setErr] = useState("");
  const [pending, setPending] = useState(false);
  const sentOnce = useRef(false);

  const forgotForm = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const verifyForm = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
      newPassword: "",
    },
  });

  const emailValue = forgotForm.watch("email");
  const codeValue = verifyForm.watch("code");
  const newPwdValue = verifyForm.watch("newPassword");

  async function sendCode(values: ForgotValues) {
    if (sentOnce.current) return;
    setErr("");
    setPending(true);
    try {
      const formData = new FormData();
      formData.set("flow", "reset");
      formData.set("email", values.email.trim());
      await signIn("password", formData);
      sentOnce.current = true;
      setStep("verify");
    } catch {
      setErr("Impossible d’envoyer le code.");
    } finally {
      setPending(false);
    }
  }

  async function verify(values: VerifyValues) {
    setErr("");
    setPending(true);

    const eMail = (forgotForm.getValues("email") || "").trim();
    if (!eMail) {
      setErr("Renseignez d’abord votre email (étape 1).");
      setPending(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.set("flow", "reset-verification");
      formData.set("email", eMail);
      formData.set("code", values.code.trim());
      formData.set("newPassword", values.newPassword);
      await signIn("password", formData);
      router.replace("/signin");
    } catch {
      setErr("Code invalide ou expiré.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-8">
        <Image
          className="dark:invert mx-auto"
          src="/adpilot.png"
          alt="ADPILOT logo"
          width={600}
          height={300}
          priority
        />

        <div className="rounded-2xl border border-gray-200/70 shadow-sm p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">
              Réinitialiser votre mot de passe
            </h1>
            <p className="text-gray-500 mt-1">
              {step === "forgot"
                ? "Entrez votre email pour recevoir un code de vérification."
                : `Un code a été envoyé à ${emailValue || "votre email"}.`}
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span
                aria-hidden
                className={`h-2 w-2 rounded-full ${
                  step === "forgot" ? "bg-black" : "bg-gray-300"
                }`}
              />
              <span
                aria-hidden
                className={`h-2 w-2 rounded-full ${
                  step === "verify" ? "bg-black" : "bg-gray-300"
                }`}
              />
            </div>
          </div>

          {step === "forgot" ? (
            <Form {...forgotForm}>
              <form
                onSubmit={forgotForm.handleSubmit(sendCode)}
                className="space-y-4"
              >
                <FormField
                  control={forgotForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Adresse email"
                          autoComplete="email"
                          className="h-12 text-center border-2 border-gray-200 focus-visible:ring-0 focus-visible:border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {err && (
                  <p
                    role="status"
                    aria-live="polite"
                    className="text-sm text-red-600 text-center font-medium"
                  >
                    {err}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={pending || !emailValue?.trim()}
                  className="cursor-pointer w-full h-12 mt-2 text-white font-extrabold text-lg disabled:opacity-60 bg-gradient-to-r from-blue-600 via-pink-500 to-orange-400"
                >
                  {pending ? "Envoi…" : "Envoyer le code"}
                </Button>

                <div className="text-center text-sm text-gray-500 mt-2">
                  Déjà un code ?{" "}
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setStep("verify")}
                    className="cursor-pointer p-0 h-auto font-medium underline underline-offset-4"
                  >
                    Passer à la vérification
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...verifyForm}>
              <form
                onSubmit={verifyForm.handleSubmit(verify)}
                className="space-y-4"
              >
                <div className="grid gap-4">
                  <FormField
                    control={verifyForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Code reçu"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            className="h-12 text-center tracking-widest border-2 border-gray-200 focus-visible:ring-0 focus-visible:border-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={verifyForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">
                          Nouveau mot de passe
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Nouveau mot de passe"
                            className="h-12 text-center border-2 border-gray-200 focus-visible:ring-0 focus-visible:border-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {err && (
                  <p
                    role="status"
                    aria-live="polite"
                    className="text-sm text-red-600 text-center font-medium"
                  >
                    {err}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={
                      pending ||
                      !emailValue?.trim() ||
                      !codeValue?.trim() ||
                      !newPwdValue?.trim()
                    }
                    className="cursor-pointer flex-1 h-12 text-white font-extrabold text-lg disabled:opacity-60 bg-gradient-to-r from-blue-600 via-pink-500 to-orange-400"
                  >
                    {pending ? "Validation…" : "Continuer"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep("forgot");
                      verifyForm.reset({ code: "", newPassword: "" });
                      sentOnce.current = false;
                      setErr("");
                    }}
                    className="cursor-pointer h-12 px-4"
                  >
                    Annuler
                  </Button>
                </div>

                <p className="text-center text-xs text-gray-500">
                  Besoin d’un nouveau code ?{" "}
                  <span className="font-medium">
                    recharge la page pour renvoyer
                  </span>
                  .
                </p>
              </form>
            </Form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500">
          <Button
            variant="link"
            onClick={() => router.replace("/signin")}
            className="cursor-pointer p-0 h-auto font-medium underline underline-offset-4"
          >
            Retour à la connexion
          </Button>
        </p>
      </div>
    </div>
  );
}
