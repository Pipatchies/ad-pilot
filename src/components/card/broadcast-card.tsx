import SvgSablier from "@/components/icons/Sablier";
import Typography from "@/components/typography";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";

interface BroadcastData {
  daysRemaining: number;
  startDate: string;
  endDate: string;
  progress: number;
}

interface BroadcastCardProps {
  broadcastData: BroadcastData;
}

export default function BroadcastCard({
  broadcastData
}: BroadcastCardProps) {
  return (
      <Card className="w-full h-[244] rounded-sm shadow-around bg-white border-none text-primary px-8 py-9">
        <CardHeader className="flex items-center justify-between">
          <Typography variant="h3">Diffusion</Typography>
          <div className="flex items-center gap-2 font-bold mb-4">
            <SvgSablier className="h-4 w-4" />
            <span>{broadcastData.progress === 100 ? "Terminée" : `${broadcastData.daysRemaining} jours restants`}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-8 bg-gray-100 rounded-full mb-4 flex items-center p-2">
            <div
              className="h-4 bg-destructive rounded-full flex"
              style={{ width: `${broadcastData.progress}%` }}
            />
          </div>

          <div className="flex justify-between font-[400]">
            <div>
              <p className="mb-1 underline">Date de lancement :</p>
              <p>{broadcastData.startDate}</p>
            </div>
            <div className="text-right">
              <p className="mb-1 underline">Date de fin :</p>
              <p>{broadcastData.endDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
