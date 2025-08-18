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
  userId: Id<"users">;
  fullName: string;
};

export default function DeleteAccountModal({
  userId,
  fullName,
}: DeletedModalProps) {
  const deleteUser = useMutation(api.mutations.users.deleteUser);

  async function onDelete() {
    try {
      await deleteUser({ userId });
      toast.success("Compte supprimé");
    } catch {
      toast.error("Échec de la suppression");
    }
  }

  const modalData = {
    title: "Supprimer ce compte ?",
    children: (
      <div>
        Confirmez la suppression du compte <strong>{fullName}</strong>.
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
