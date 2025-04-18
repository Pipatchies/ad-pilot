"use client";
import { useState, useEffect } from "react";
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
    <div className="h-13.5 bg-white flex items-center gap-6 text-primary">
      <SidebarTrigger />
      <div className="flex items-center gap-2 w-210 py-2 border-b border-primary/40 ml-32">
        <SvgSearch className="w-5 fill-primary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher"
          className="w-full bg-transparent outline-none placeholder:text-primary text-sm font-[400]"
        />
      </div>

      <div className="flex items-center gap-6 ml-6 h-12">
        <CtaButton
          props={ctaProps}
          icon={<SvgCrayon className="text-primary group-hover:text-white transition-colors"/>}
          className="border transition flex items-center gap-2 h-10"
          variant="default"
        />

        <div className="relative flex items-center justify-center w-10 h-10">
          <SvgNotification className="w-6 h-6" />
          <span className="absolute top-0 right-2 h-3 w-3 rounded-full bg-destructive border border-white" />
        </div>

        <div className="border-r h-6" />

        <div className="flex items-center gap-3 whitespace-nowrap h-12">
          <Collapsible defaultOpen className="group/collapsible">
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm">John Doe</span>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=close]/collapsible:rotate-180 color-chevron" />
              </div>
            </CollapsibleTrigger>
          </Collapsible>

          <Avatar className="h-10 w-10">
            <AvatarImage src="/logo-occitanie-2017.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
