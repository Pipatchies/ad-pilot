import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Typography from "@/components/typography";
import SvgEyeIcon from "@/components/icons/EyeIcon";
import SvgUploder from "@/components/icons/Uploder";


export interface DetailsCardProps {
  title: string;
  type: string;
  date: Date;
  icon: React.ReactNode;
  variant: "default" | "portrait" | "landscape";
};

export default function VisualsCard({
  title,
  type,
  date,
  icon,
  variant,
}: DetailsCardProps) {
  return (
      <Card className="text-primary bg-card/50 max-h-[431px] py-10 shadow-none border-none gap-y-4 w-full flex justify-center">
        <CardHeader>
          {variant === "default" && (
            <>
              <div className="bg-primary flex items-center justify-center h-40 w-40">
                {icon}
              </div>
              </>
          )}
          {variant === "portrait" && (
            <>
              <div className="bg-primary flex items-center justify-center h-[217] w-[157]">
                {icon}
              </div>
              </>
          )}
          {variant === "landscape" && (
            <>
              <div className="bg-primary flex items-center justify-center h-[154] w-[265]">
                {icon}
              </div>
              </>
          )}
        </CardHeader>
        <CardContent>
            <ul className="space-y-1">
              <li>
                <Typography variant="h4">{title}</Typography>
              </li>
              <li>
                <CardDescription className="italic">{type}</CardDescription>
              </li>
              <li>
                <span className="underline">Date :</span> {date.toLocaleDateString()}
              </li>
            </ul>
        </CardContent>

          <CardFooter className="flex flew-wrap gap-x-2">
            <SvgEyeIcon/>
            <SvgUploder/>
          </CardFooter>
      </Card>
  );
}
