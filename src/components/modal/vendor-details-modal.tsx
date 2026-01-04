"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SvgProfil from "@/components/icons/Profil";
import SvgMail from "@/components/icons/Mail";
import SvgPhone from "@/components/icons/Phone";

interface VendorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  vendorContact?: string;
  vendorEmail?: string;
  vendorPhone?: string;
}

export default function VendorDetailsModal({
  isOpen,
  onClose,
  vendorName,
  vendorContact,
  vendorEmail,
  vendorPhone,
}: VendorDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full !max-w-md flex flex-col items-center p-22 pt-14 gap-6 bg-[#F3F3F7]/95 backdrop-blur-sm border-none shadow-[0px_4px_20px_0px_rgba(0,0,0,0.10)] rounded-xl sm:rounded-xl">
        <DialogHeader className="w-full">
          <DialogTitle className="font-bold text-3xl text-primary">
            {vendorName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-3 text-primary">
            <SvgProfil className="w-5 h-5 fill-current" />
            <span className="text-lg">{vendorContact || "-"}</span>
          </div>
          <div className="flex items-center gap-3 text-primary">
            <SvgMail className="w-5 h-5 fill-current" />
            <span className="text-lg">{vendorEmail || "-"}</span>
          </div>
          <div className="flex items-center gap-3 text-primary">
            <SvgPhone className="w-5 h-5 stroke-current" />
            <span className="text-lg tracking-wide">
              {vendorPhone || "-"}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
