import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";
import SvgOpenFolder from "./icons/OpenFolder";
import Typography from "./typography";
import Link from "next/link";

interface FolderCardProps {
  title: string;
  icon?: React.ReactNode;
  url: string;
}

export default function FolderCard({ title, icon, url }: FolderCardProps) {
  return (
    <Link href={url} className="w-full basis-1/4 grow">
      <Card
        className={cn(
          "text-primary bg-card/50 h-[330px] shadow-none border-none w-full basis-1/4 grow flex items-center p-25"
        )}
      >
        <CardContent>
          <div className="flex flex-col justify-center items-center gap-10">
            <SvgOpenFolder className="fill-primary" />
            <Typography variant="h2" className="mb-0 whitespace-nowrap">
              {title}
            </Typography>
          </div>
          {icon && <span>{icon}</span>}
        </CardContent>
      </Card>
    </Link>
  );
}
