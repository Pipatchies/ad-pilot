"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import Typography from "./typography";
import SvgFusee from "./icons/Fusee";
import { cn } from "@/lib/utils";
import SvgProfil from "./icons/Profil";
import SvgImageSmall from "./icons/ImageSmall";
import SvgStatistiques from "./icons/Statistiques";
import SvgFacture from "./icons/Facture";
import SvgDocument from "./icons/Document";
import Link from "next/link";
import { Fusee } from "./icons";

const menuItems = [
  {
    label: "Campagne titre 1",
    subItems: [
      { label: "La campagne", icon: <SvgFusee />, url: "/campaign" },
      { label: "Les cibles", icon: <SvgProfil />, url: "#" },
      { label: "Bibliothèque", icon: <SvgImageSmall />, url: "#" },
      { label: "Analyse digitale", icon: <SvgStatistiques />, url: "#" },
      { label: "Factures", icon: <SvgFacture />, url: "#" },
      { label: "Documents", icon: <SvgDocument />, url: "#" },
    ],
  },
  {
    label: "Campagne titre 2",
    subItems: [
      { label: "La campagne", icon: <SvgFusee />, url: "/campaign" },
      { label: "Les cibles", icon: <SvgProfil />, url: "#" },
      { label: "Bibliothèque", icon: <SvgImageSmall />, url: "#" },
      { label: "Analyse digitale", icon: <SvgStatistiques />, url: "#" },
      { label: "Factures", icon: <SvgFacture />, url: "#" },
      { label: "Documents", icon: <SvgDocument />, url: "#" },
    ],
  },
  {
    label: "Campagne titre 3",
    subItems: [
      { label: "La campagne", icon: <SvgFusee />, url: "/campaign" },
      { label: "Les cibles", icon: <SvgProfil />, url: "#" },
      { label: "Bibliothèque", icon: <SvgImageSmall />, url: "#" },
      { label: "Analyse digitale", icon: <SvgStatistiques />, url: "#" },
      { label: "Factures", icon: <SvgFacture />, url: "#" },
      { label: "Documents", icon: <SvgDocument />, url: "#" },
    ],
  },
  {
    label: "Campagne archivées",
    icon: "/icons/picto-archive.svg",
    url: "#",
  },
  {
    label: "Facture",
    icon: "/icons/facture.svg",
    url: "#",
  },
];

export default function MenuSidebar() {
  const pathname = usePathname();

  const isActive = (url: string) => pathname === url;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-sidebar px-4 my-3">
        <div className="flex items-center">
          <Image
            src="/logo-ad-pilot.png"
            alt="ADPILOT"
            width={163}
            height={46}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar-primary overflow-y-auto scrollbar-none">
        <SidebarMenu className="py-2">
          {menuItems.map((item, index) =>
            item.subItems ? (
              <Collapsible
                key={index}
                defaultOpen
                className="group/collapsible"
              >
                <SidebarMenuItem className="py-1">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between w-full bg-black/20 rounded-none p-8">
                      <Typography variant="h5">{item.label}</Typography>
                      <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="p-0 ml-8 mr-0 my-2 border-none">
                      {item.subItems.map((sub, subIndex) => (
                        <SidebarMenuSubItem key={subIndex} className="py-1">
                          <SidebarMenuButton
                            asChild
                            className={
                              isActive(sub.url)
                                ? "bg-black/40 border-l-4 rounded-none p-8 border-destructive"
                                : "bg-black/20 rounded-none p-8"
                            }
                          >
                            <Link
                              href={sub.url}
                              className="flex items-center gap-2"
                            >
                              {sub.icon && (
                                <span
                                  className={cn(
                                    isActive(sub.url)
                                      ? "fill-destructive"
                                      : "fill-[#A5A4BF]"
                                  )}
                                >
                                  {sub.icon}
                                </span>
                              )}
                              <Typography variant="h6">{sub.label}</Typography>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={index} className="py-1">
                <SidebarMenuButton
                  asChild
                  className={
                    isActive(item.url)
                      ? "bg-black/40 border-l-4 border[--destructive]"
                      : "bg-black/20 p-8"
                  }
                >
                  <a href={item.url} className="flex items-center gap-2">
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={16}
                      height={16}
                    />
                    <Typography variant="h5">{item.label}</Typography>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
