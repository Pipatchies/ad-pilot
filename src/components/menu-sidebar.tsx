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
import SvgConfiguration from "./icons/Configuration";

const organizationId: Id<"organizations"> =
  "kx7ee0k4v7v16x8b28adt9dr7n7kefs4" as Id<"organizations">;

type UserRole = "admin" | "user";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  url: string;
  subItems?: SubItem[];
}

interface SubItem {
  label: string;
  icon: React.ReactNode;
  url: string;
};

interface SidebarProps {
  variant: UserRole;
}

export default function MenuSidebar({ variant }: SidebarProps) {
  const campaigns = useQuery(api.queries.campaigns.getCampaignsByOrganization, {
    organizationId,
  });

  const adminMenuItemsTop: MenuItem[] = [
    {
      label: "Clients",
      icon: <SvgProfil />,
      url: "/admin/clients",
    },
    {
      label: "Campagnes",
      icon: <SvgFusee />,
      url: "/admin/campaigns",
    },
    {
      label: "Factures",
      icon: <SvgFacture />,
      url: "/admin/invoices",
    },
    {
      label: "Documents",
      icon: <SvgDocument />,
      url: "/admin/documents",
    },
  ];

  const adminMenuItemsBottom: MenuItem = {
    label: "Comptes",
    icon: <SvgConfiguration />,
    url: "/admin/accounts",
  };

  const userStaticItems: MenuItem[] = [
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

  const userMenuItems: MenuItem[] = [
    ...(campaigns?.map((campaign) => ({
      label: campaign.title,
      icon: <SvgDocument />,
      url: `/campaign/${campaign._id}`,
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
    } as MenuItem)) ?? []),
    ...userStaticItems,
  ];

  const getDashboardUrl = (variant: UserRole): string => {
  return variant === 'admin' ? '/adminDashboard' : '/dashboard';
};

const getBottomMenuItem = (variant: UserRole): MenuItem | null => {
    return variant === 'admin' ? adminMenuItemsBottom : null;
  };

const menuItems = variant === 'admin' 
    ? adminMenuItemsTop : userMenuItems;
  
  const bottomMenuItem = getBottomMenuItem(variant);
  const dashboardUrl = getDashboardUrl(variant);

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
          <Link href={dashboardUrl}>
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

        {bottomMenuItem && (
          <SidebarMenu className="py-2 border-t border-white/20 mt-auto">
                    <SidebarMenuItem className="py-1">
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "whitespace-nowrap p-8",
                          isActive(bottomMenuItem.url)
                            ? "bg-black/40 border-l-4 border-destructive rounded-none"
                            : "bg-black/20 rounded-none"
                        )}
                      >
                        <Link href={bottomMenuItem.url}>
                          <span
                            className={cn(
                              isActive(bottomMenuItem.url)
                                ? "fill-destructive"
                                : "fill-[#A5A4BF]"
                            )}
                          >
                            {bottomMenuItem.icon}
                          </span>
                          <Typography variant="h5">{bottomMenuItem.label}</Typography>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
