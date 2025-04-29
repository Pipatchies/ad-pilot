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
import SvgPictoArchive from "./icons/PictoArchive";

const menuItems = [
  {
    label: "Campagne titre 1",
    icon: <SvgDocument />,
    subItems: [
      { label: "La campagne", icon: <SvgFusee />, url: "/campaign/1/campaign-details" },
      { label: "Les cibles", icon: <SvgProfil />, url: "/campaign/1/targets" },
      { label: "Bibliothèque", icon: <SvgImageSmall />, url: "/campaign/1/librairy" },
      { label: "Analyse digitale", icon: <SvgStatistiques />, url: "/campaign/1/digital" },
      { label: "Factures", icon: <SvgFacture />, url: "/campaign/1/invoices" },
      { label: "Documents", icon: <SvgDocument />, url: "/campaign/1/documents" },
    ],
  },
  {
    label: "Campagne titre 2",
    icon: <SvgDocument />,
    subItems: [
      { label: "La campagne", icon: <SvgFusee />, url: "#" },
      { label: "Les cibles", icon: <SvgProfil />, url: "#" },
      { label: "Bibliothèque", icon: <SvgImageSmall />, url: "#" },
      { label: "Analyse digitale", icon: <SvgStatistiques />, url: "#" },
      { label: "Factures", icon: <SvgFacture />, url: "#" },
      { label: "Documents", icon: <SvgDocument />, url: "#" },
    ],
  },
  {
    label: "Campagne titre 3",
    icon: <SvgDocument />,
    subItems: [
      { label: "La campagne", icon: <SvgFusee />, url: "#" },
      { label: "Les cibles", icon: <SvgProfil />, url: "#" },
      { label: "Bibliothèque", icon: <SvgImageSmall />, url: "#" },
      { label: "Analyse digitale", icon: <SvgStatistiques />, url: "#" },
      { label: "Factures", icon: <SvgFacture />, url: "#" },
      { label: "Documents", icon: <SvgDocument />, url: "#" },
    ],
  },
  {
    label: "Campagne archivées",
    icon: <SvgPictoArchive />,
    url: "/archived",
  },
  {
    label: "Factures",
    icon: <SvgFacture />,
    url: "/invoices",
  },
];

export default function MenuSidebar() {
  const pathname = usePathname();

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url);
  };

  const isGroupActive = (subItems: (typeof menuItems)[0]["subItems"]) => {
    return subItems?.some((sub) => isActive(sub.url));
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-sidebar px-4 py-3.25">
        <div>
          <Link href="/dashboard">
            <Image
              src="/logo-ad-pilot.png"
              alt="ADPILOT"
              width={163}
              height={46}
            />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar-primary overflow-y-auto scrollbar-none">
        <SidebarMenu className="py-2">
          {menuItems.map((item, index) =>
            item.subItems ? (
              <Collapsible key={index} className="group/collapsible">
                <SidebarMenuItem className="py-1">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        "flex items-center justify-between w-full rounded-none p-8 bg-black/20 transition-all",
                        isGroupActive(item.subItems) &&
                          "bg-black/40 border-l-4 border-destructive"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && (
                          <span
                            className={cn(
                              isGroupActive(item.subItems)
                                ? "fill-destructive"
                                : "fill-[#A5A4BF]"
                            )}
                          >
                            {item.icon}
                          </span>
                        )}
                        <Typography
                          variant="h5"
                          className="transition-all duration-200"
                        >
                          {item.label}
                        </Typography>
                      </div>
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
                                ? "bg-black/40 rounded-none p-8"
                                : "bg-black/20 rounded-none p-8"
                            }
                          >
                            <Link href={sub.url}>
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
                  className={cn(
                    "whitespace-nowrap p-8",
                    isActive(item.url)
                      ? "bg-black/40 border-l-4 rounded-none border-destructive"
                      : "bg-black/20 rounded-none"
                  )}
                >
                  <Link href={item.url}>
                    {item.icon && (
                      <span
                        className={cn(
                          isActive(item.url)
                            ? "fill-destructive"
                            : "fill-[#A5A4BF]"
                        )}
                      >
                        {item.icon}
                      </span>
                    )}
                    <Typography variant="h5">{item.label}</Typography>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
