"use client";

import React from "react";
import Modal from "@/components/modal";
import SvgCorbeille from "@/components/icons/Corbeille";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import CtaButton from "@/components/cta-button";
import { toast } from "sonner";

type DeletedModalProps = {
  organizationId: Id<"organizations">;
  organizationName: string;
};

export default function DeleteClientModal({
  organizationId,
  organizationName,
}: DeletedModalProps) {
  const deleteOrganization = useMutation(api.mutations.organizations.deleteOrganization);

  async function onDelete() {
    try {
      await deleteOrganization({ organizationId });
      toast.success("Compte supprimé");
    } catch {
      toast.error("Échec de la suppression");
    }
  }

  const modalData = {
    title: "Supprimer ce compte ?",
    children: (
      <div>
        Confirmez la suppression du compte <strong>{organizationName}</strong>.
        <p className="text-xs mt-5 text-muted-foreground">Cette action est irréversible. Le compte sera définitivement supprimé.</p>
      </div>
    ),
    footer: (
      <CtaButton
        props={{ text: "Supprimer", onClick: onDelete }}
        variant="submit"
      />
    ),
  };

  return (
    <Modal
      variant="icon"
      cta={{ icon: <SvgCorbeille className="cursor-pointer" /> }}
      data={modalData}
    />
  );
}
