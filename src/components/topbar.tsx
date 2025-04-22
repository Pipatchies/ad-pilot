"use client";
import { useState, useEffect } from "react";
import CtaButton from "./cta-button";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";
import SvgSearch from "./icons/Search";
import SvgNotification from "./icons/Notification";
import SvgCrayon from "./icons/Crayon";

const ctaProps = {
  text: "Déposer un brief",
  url: "#",
  target: "self",
};

export default function Topbar() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query.length > 2) {
      console.log("query", query);
    }
  }, [query]);

  return (
    <div className="bg-white flex items-end sm:items-center justify-between px-4 md:px-6 w-full text-primary gap-6">
      {/* Bloc gauche */}
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger />
        <div className="flex items-center gap-2 border-b border-primary/40 px-3 py-2 w-full">
          <SvgSearch className="w-5 fill-primary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher"
            className="w-full bg-transparent outline-none placeholder:text-primary text-sm"
          />
        </div>
      </div>

      {/* Bloc droit */}
      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 items-end sm:items-center text-sm">
        <CtaButton
          props={ctaProps}
          icon={<SvgCrayon className="text-primary group-hover:text-white transition-colors w-4 h-4" />}
          className="flex items-center gap-1 h-9 border px-3 py-1 text-xs sm:text-sm"
          variant="default"
        />

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10">
            <SvgNotification className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute top-0 right-1 h-2.5 w-2.5 rounded-full bg-destructive border border-white" />
          </div>

          <div className="border-r h-5 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Collapsible defaultOpen className="group/collapsible">
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer">
                  <span className="hidden md:inline text-sm">John Doe</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-data-[state=close]/collapsible:rotate-180" />
                </div>
              </CollapsibleTrigger>
            </Collapsible>

            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
              <AvatarImage src="/logo-occitanie-2017.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}



