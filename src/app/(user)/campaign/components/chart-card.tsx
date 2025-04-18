"use client";
import Typography from "@/components/typography";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface MediaItem {
  name: string;
  budget: number;
  color: string;
}

interface ChartCardProps {
  mediaData: MediaItem[];
  className?: string;
}

export default function ChartCard({ mediaData }: ChartCardProps) {
  const chartData = mediaData.map((item) => ({
    name: item.name,
    value: item.budget,
    color: item.color,
  }));

  return (
    <Card className="w-full h-auto rounded-sm shadow-around bg-white border-none text-primary px-8 py-6">
      <CardHeader className="p-0 pb-4">
        <Typography variant="h3">Médias / Budget</Typography>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Liste à gauche */}
          <div className="w-full md:w-1/2 space-y-2">
            {mediaData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="ml-auto text-sm font-semibold">
                  {item.budget}€
                </span>
              </div>
            ))}
          </div>

          {/* Camembert à droite */}
          <div className="w-full md:w-1/2 h-[200px] flex items-center justify-center">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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

