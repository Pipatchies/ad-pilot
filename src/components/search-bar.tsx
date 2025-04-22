"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import SvgSearch from "./icons/Search";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("Du plus récent au plus ancien");

  useEffect(() => {
    if (query.length > 2) {
      console.log("query", query);
    }
  }, [query]);

  const toggleSortOrder = (order: string) => {
    setSortOrder(order);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 py-2 w-full max-w-2xl">
      <div className="flex items-center gap-2 flex-1 border-b border-[#A5A4BF] pb-2 grow">
        <SvgSearch className="w-5 fill-[#BCBCCB]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher"
          className="flex-1 bg-transparent outline-none placeholder:text-primary text-sm font-[400] "
        />
      </div>

      <div className="w-full md:w-72">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between border-primary">
              <span>{sortOrder}</span>
              <ChevronDown className="h-4 w-4 color-primary transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 border border-primary rounded-md overflow-hidden">
            <Button
              variant="ghost"
              className="w-full justify-start rounded-none"
              onClick={() => toggleSortOrder("Du plus récent au plus ancien")}
            >
              Du plus récent au plus ancien
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-none"
              onClick={() => toggleSortOrder("Du plus ancien au plus récent")}
            >
              Du plus ancien au plus récent
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
