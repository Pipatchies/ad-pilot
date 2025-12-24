"use client";

import React from "react";
import Modal from "@/components/modal/modal";
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
import { useAction, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import SvgUploder from "@/components/icons/Uploder";

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
  const getSignature = useAction(api.actions.cloudinary.getUploadSignature);

  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { organizationName, logo },
    values: { organizationName, logo },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!file) {
      toast.error("Veuillez sélectionner un logo.");
      return;
    }

    let logoUrl = values.logo;

    if (file) {
      try {
        setUploading(true);
        const folder = "clients/logos";
        const resourceType = "image";
        const sig = await getSignature({ folder, resourceType });
        const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${sig.resourceType}/upload`;

        const fd = new FormData();
        fd.append("file", file);
        fd.append("api_key", sig.apiKey);
        fd.append("timestamp", String(sig.timestamp));
        fd.append("upload_preset", sig.uploadPreset);
        fd.append("signature", sig.signature);
        fd.append("folder", sig.folder);

        const res = await fetch(endpoint, { method: "POST", body: fd });
        const json = await res.json();

        if (json.error) throw new Error(json.error.message);
        logoUrl = json.secure_url;
      } catch {
        toast.error("Erreur à l'upload du logo");
        setUploading(false);
        return;
      }
    }

    try {
      await updateOrganization({
        organizationId,
        patch: {
          name: values.organizationName,
          logo: logoUrl,
        },
      });
      toast.success("Compte mis à jour");
      form.reset({ ...values, logo: logoUrl });
      setFile(null);
    } catch {
      toast.error("Échec de la mise à jour");
    } finally {
      setUploading(false);
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
                      placeholder="Nom du client"
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
                  <FormLabel className="text-lg font-semibold">Logo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        readOnly
                        value={file ? file.name : ""}
                        placeholder="Importer le nouveau logo"
                        className="!text-base md:text-base italic placeholder:text-primary/50 rounded-sm border-[#A5A4BF] p-5 pr-12 cursor-pointer"
                        onClick={() =>
                          document.getElementById("hiddenUpdateLogoInput")?.click()
                        }
                      />
                      <SvgUploder
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() =>
                          document.getElementById("hiddenUpdateLogoInput")?.click()
                        }
                      />
                      <input
                        id="hiddenUpdateLogoInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          setFile(f);
                          if (f) field.onChange(f.name);
                        }}
                      />
                    </div>
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
        props={{
          text: "Enregistrer",
          onClick: form.handleSubmit(onSubmit),
          disabled: uploading,
        }}
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
