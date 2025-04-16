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

const menuItems = [
  {
    label: "Campagne titre 1",
    subItems: [
      { label: "La campagne", icon: "/icons/fusee.svg", url: "#" },
      { label: "Les cibles", icon: "/icons/profil.svg", url: "#" },
      { label: "Bibliothèque", icon: "/icons/Image Small.svg", url: "#" },
      { label: "Analyse digitale", icon: "/icons/statistiques.svg", url: "#" },
      { label: "Factures", icon: "/icons/facture.svg", url: "#" },
      { label: "Documents", icon: "/icons/document.svg", url: "#" },
    ],
  },
  {
    label: "Campagne titre 2",
    subItems: [
      { label: "La campagne", icon: "/icons/fusee.svg", url: "#" },
      { label: "Les cibles", icon: "/icons/profil.svg", url: "#" },
      { label: "Bibliothèque", icon: "/icons/Image Small.svg", url: "#" },
      { label: "Analyse digitale", icon: "/icons/statistiques.svg", url: "#" },
      { label: "Factures", icon: "/icons/facture.svg", url: "#" },
      { label: "Documents", icon: "/icons/document.svg", url: "#" },
    ],
  },
  {
    label: "Campagne titre 3",
    subItems: [
      { label: "La campagne", icon: "/icons/fusee.svg", url: "#" },
      { label: "Les cibles", icon: "/icons/profil.svg", url: "#" },
      { label: "Bibliothèque", icon: "/icons/Image Small.svg", url: "#" },
      { label: "Analyse digitale", icon: "/icons/statistiques.svg", url: "#" },
      { label: "Factures", icon: "/icons/facture.svg", url: "#" },
      { label: "Documents", icon: "/icons/document.svg", url: "#" },
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
                                ? "bg-black/40 border-l-4 border[--destructive]"
                                : "bg-black/20 rounded-none p-8"
                            }
                          >
                            <a
                              href={sub.url}
                              className="flex items-center gap-2"
                            >
                              <Image
                                src={sub.icon}
                                alt={sub.label}
                                width={16}
                                height={16}
                              />
                              <Typography variant="h6">{sub.label}</Typography>
                            </a>
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
