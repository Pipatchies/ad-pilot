"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import CtaButton from "./ctaButton";
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
    <div className="w-full h-13.5 bg-white flex items-center justify-center gap-6 text-primary">
      <SidebarTrigger />
      <div className="flex items-center gap-2 w-full max-w-4xl py-2 border-b border-primary/40 ml-40">
        <SvgSearch className="w-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher"
          className="w-full bg-transparent outline-none placeholder:text-primary text-sm font-[400]"
        />
      </div>

      <div className="flex items-center gap-6 ml-6">
        <CtaButton
          props={ctaProps}
          icon={<SvgCrayon />}
          className="border transition flex gap-2 items-center"
          variant="ghost"
        />

        <div className="relative inline-flex w-8 h-8">
          <SvgNotification className="w-8 h-8" />
          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-destructive border border-white" />
        </div>

        <div className="border-r h-8"></div>

        <div className="flex items-center gap-4">
          <Collapsible defaultOpen className="group/collapsible">
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm ">John Doe</span>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=close]/collapsible:rotate-180 color-chevron" />
              </div>
            </CollapsibleTrigger>
          </Collapsible>
          <Avatar className="h-12 w-12">
            <AvatarImage src="/Logo_Occitanie_2017.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
