"use client";

import React from "react";
import Modal from "@/components/modal";
import SvgPlus from "@/components/icons/Plus";
import { Button } from "@/components/ui/button";

const ctaProps = {
  text: "Ajouter un compte",
  icon: <SvgPlus />,
};

const userFormData = {
  title: "Créer un compte Admin",
  children: <div>Coucou</div>,
  footer: (
    <Button type="submit" className="w-full md:w-auto">
      Enregistrer
    </Button>
  ),
};

export default function AccountModal() {
  return (
    <Modal
      cta={ctaProps}
      data={userFormData}
    />
  );
}
