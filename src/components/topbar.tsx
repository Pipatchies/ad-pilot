"use client";
import { useState, useEffect } from "react";
import CtaButton from "./cta-button";
import { ChevronDown } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";
import SvgSearch from "./icons/Search";
import SvgNotification from "./icons/Notification";
import SvgCrayon from "./icons/Crayon";
import SvgFacture from "./icons/Facture";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";

const CtaData = {
  client: {
    text: "Déposer un brief",
    url: "/new-brief",
    target: "self",
  },
  admin: {
    text: "Créer une campagne",
    url: "/admin/new-campaign",
    target: "self",
  },
};

export default function Topbar() {
  const [query, setQuery] = useState("");
  const me = useQuery(api.queries.users.me);
  const { signOut } = useAuthActions();

  const role = me?.role === "admin" ? "admin" : "client";
  const ctaProps = CtaData[role];

  const name = me?.name;
  const lastname = me?.lastname;

  const initials =
    (name?.[0] ?? "").toUpperCase() + (lastname?.[0] ?? "").toUpperCase();

  useEffect(() => {
    if (query.length > 2) {
      console.log("query", query);
    }
  }, [query]);

  return (
    <div className="flex items-end sm:items-center justify-between px-4 md:px-6 w-full text-primary gap-6">
      <div className="flex items-center gap-6 2xl:gap-28 flex-1 ">
        <SidebarTrigger />
        <div className="flex items-center border-b border-primary/40 px-3 py-2 flex-grow max-w-4xl">
          <SvgSearch className="w-8 fill-primary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher"
            className="w-full bg-transparent outline-none placeholder:text-primary text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 items-end sm:items-center text-sm">
        {role === "client" && (
          <CtaButton
            props={{
              text: "Demander un devis",
              url: "/request-quote",
              target: "self",
            }}
            icon={<SvgFacture />}
            className="flex items-center border px-3 py-1 text-xs sm:text-sm fill-primary hover:fill-white"
            variant="default"
          />
        )}
        <CtaButton
          props={ctaProps}
          icon={<SvgCrayon />}
          className="flex items-center border px-3 py-1 text-xs sm:text-sm"
          variant="default"
        />

        <div className="flex items-center gap-3 sm:gap-4">
          {role === "client" && (
            <div className="relative flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10">
              <SvgNotification className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-1 lg:right-3 right-1 h-2.5 w-2.5 rounded-full bg-destructive border border-white" />
            </div>
          )}

          <div className="border-r h-5 hidden sm:block" />

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 cursor-pointer">
                  <span className="hidden md:inline text-sm">
                    {name} {lastname}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                    <AvatarImage src={me?.image} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 text-primary">
                <DropdownMenuLabel>Connecté</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/account" className="cursor-pointer">
                    Mon profil
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
