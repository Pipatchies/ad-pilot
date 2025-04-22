"use client"

import { useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  login: z.string().min(2, { message: "Le login est requis." }),
  password: z.string().min(4, { message: "Le mot de passe est requis." }),
})

type FormValues = z.infer<typeof formSchema>

export default function SignInPage() {
  const router = useRouter()
  
  const [signedIn, setSignedIn] = useState(false)
  const [error, setError] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  })

  const onSubmit = (values: FormValues) => {
    setError("")
    const { login, password } = values

    if (login === "admin" && password === "verywell") {
      setSignedIn(true)
      router.push("/dashboard")
    } else {
      setError("Identifiants incorrects.")
    }
  }

  if (signedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div className="space-y-6">
          <Image
            className="dark:invert mx-auto"
            src="/adpilot.png"
            alt="ADPILOT logo"
            width={400}
            height={200}
            priority
          />
          <h1 className="text-2xl font-bold">Bienvenue, admin ! 🎉</h1>
          <p className="text-gray-500">
            Vous êtes connecté. D'autres fonctionnalités arrivent très bientôt !
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-8">
        <Image
          className="dark:invert mx-auto"
          src="/adpilot.png"
          alt="ADPILOT logo"
          width={600}
          height={300}
          priority
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-4"
          >
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Login</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="LOGIN"
                      {...field}
                      className="h-12 text-center border-2 border-gray-200 focus:border-gray-300"
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
                  <FormLabel className="sr-only">Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="MOT DE PASSE"
                      {...field}
                      className="h-12 text-center border-2 border-gray-200 focus:border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <p className="text-sm text-red-500 text-center font-medium">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-12 mt-4 bg-gradient-to-r from-blue-600 via-pink-500 to-orange-400 hover:opacity-90 text-white font-extrabold text-lg"
            >
              Se connecter
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
