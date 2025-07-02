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
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const clientBusinessId: Id<"clientBusinesses"> =
  "k979mgpmypy7r4nrnbgpfmyep17jtkqc" as Id<"clientBusinesses">;

type SubItem = {
  label: string;
  icon: React.ReactNode;
  url: string;
};

export default function MenuSidebar() {
  const campaigns = useQuery(api.queries.users.readCampaigns, {
    clientBusinessId,
  });

  const staticItems = [
    {
      label: "Campagnes archivées",
      icon: <SvgPictoArchive />,
      url: "/archived",
    },
    {
      label: "Factures",
      icon: <SvgFacture />,
      url: "/invoices",
    },
  ];

  const menuItems = [
    ...(campaigns?.map((campaign) => ({
      label: campaign.title,
      icon: <SvgDocument />,
      subItems: [
        {
          label: "La campagne",
          icon: <SvgFusee />,
          url: `/campaign/${campaign._id}/campaign-details`,
        },
        {
          label: "Les cibles",
          icon: <SvgProfil />,
          url: `/campaign/${campaign._id}/targets`,
        },
        {
          label: "Bibliothèque",
          icon: <SvgImageSmall />,
          url: `/campaign/${campaign._id}/librairy`,
        },
        {
          label: "Analyse digitale",
          icon: <SvgStatistiques />,
          url: `/campaign/${campaign._id}/digital`,
        },
        {
          label: "Factures",
          icon: <SvgFacture />,
          url: `/campaign/${campaign._id}/invoices`,
        },
        {
          label: "Documents",
          icon: <SvgDocument />,
          url: `/campaign/${campaign._id}/documents`,
        },
      ],
    })) ?? []),
    ...staticItems,
  ];

  const pathname = usePathname();

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url);
  };

  const isGroupActive = (subItems: SubItem[]) => {
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
            "subItems" in item ? (
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
