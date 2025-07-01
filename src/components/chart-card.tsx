"use client";
import Typography from "@/components/typography";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

function getColorFromMedia(type: string): string {
  switch (type.toLowerCase()) {
    case "affichage":
      return "#5ECEF9";
    case "tv":
      return "#FF7A6B";
    case "radio":
      return "#FFD572";
    case "digital":
      return "#A78BFA";
    case "cinéma":
      return "#B4E197";
    case "presse": 
      return "#FFC785";
    default:
      return "#CCCCCC";
  }
}

interface MediaItem {
  type: string;
  amount: number;
}

interface ChartCardProps {
  mediaData: MediaItem[];
  className?: string;
}

export default function ChartCard({ mediaData }: ChartCardProps) {

   const enrichedMediaData = mediaData.map((item) => ({
    ...item,
    color: getColorFromMedia(item.type),
  }));


  return (
    <Card className="w-full h-[244px] rounded-sm shadow-around bg-white border-none text-primary px-8 py-6 gap-0">
      <CardHeader className="p-0">
        <Typography variant="h3" className="mb-0">Médias / Budget</Typography>
      </CardHeader>

      <CardContent className="p-0 h-full">
        <div className="flex h-full items-center justify-between gap-6">

          <div className="space-y-3 w-1/2">
          {enrichedMediaData.map(({ type, amount, color }, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2 bg-white border-2"
                  style={{
                    borderColor: color,
                  }}
                />
                <span>{type}</span>
                <span className="ml-auto font-bold">
                  {amount}€
                </span>
              </div>
            ))}
          </div>

          <div className="w-1/2 h-[160px] flex items-center justify-center">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={mediaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="budget"
                >
                  {enrichedMediaData.map(({ color }, index) => (
                    <Cell key={index} fill={color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


