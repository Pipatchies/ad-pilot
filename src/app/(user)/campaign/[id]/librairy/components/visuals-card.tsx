import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Typography from "@/components/typography";
import SvgEyeIcon from "@/components/icons/EyeIcon";
import SvgUploder from "@/components/icons/Uploder";

export interface DetailsCardProps {
  title: string;
  type: string;
  date: Date;
  icon: React.ReactNode;
}

export default function VisualsCard({
  title,
  type,
  date,
  icon,
}: DetailsCardProps) {
  return (
    <Card className="text-primary bg-card/50 min-h-[450px] py-10 shadow-none border-none w-full flex flex-col">
      <div className="flex-1 flex justify-center items-center">
        {/* {variant === "default" && ( */}
          <div className="bg-primary flex items-center justify-center h-40 w-40 fill-white">
            {icon}
          </div>
        {/* )} */}
        {/* {variant === "portrait" && (
          <div className="bg-primary flex items-center justify-center h-[217px] w-[157px] fill-white">
            {icon}
          </div>
        )}
        {variant === "landscape" && (
          <div className="bg-primary flex items-center justify-center h-[154px] w-[265px] fill-white">
            {icon}
          </div>
        )} */}
      </div>

      <div className="flex flex-col items-center w-full px-4">
        <CardContent className="flex flex-col items-center w-full px-0">
          <ul className="space-y-2 flex flex-col items-center">
            <li>
              <Typography variant="h3" className="mb-0">
                {title}
              </Typography>
            </li>
            <li>
              <span className="italic text-primary">{type}</span>
            </li>
            <li>
              <span className="underline">Date :</span>{" "}
              {date.toLocaleDateString()}
            </li>
          </ul>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-x-4 mt-4 justify-center">
          <SvgEyeIcon />
          <SvgUploder />
        </CardFooter>
      </div>
    </Card>
  );
}
