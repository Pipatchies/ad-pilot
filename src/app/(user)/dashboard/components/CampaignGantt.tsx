"use client";

import React, { useState } from "react";
import {
  format,
  startOfWeek,
  subWeeks,
  addWeeks,
  parseISO,
  endOfWeek,
  endOfDay,
  eachDayOfInterval,
  differenceInDays,
  isSameDay,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MediaBudget {
  type: string;
  periodFrom?: string;
  periodTo?: string;
  pourcent: number | string;
  amount: number;
}

interface Campaign {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  budgetMedia: MediaBudget[];
}

interface CampaignGanttProps {
  campaigns: Campaign[];
}

export default function CampaignGantt({ campaigns }: CampaignGanttProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek,
  });

  const weekNumber = format(startOfCurrentWeek, "w", { locale: fr });

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  // Helper to get media dates
  const getMediaDates = (
    media: MediaBudget,
    campaignStart: string,
    campaignEnd: string
  ) => {
    const start = media.periodFrom || campaignStart;
    const end = media.periodTo || campaignEnd;
    return {
      start: parseISO(start),
      end: endOfDay(parseISO(end)),
    };
  };

  const getBarPosition = (start: Date, end: Date) => {
    const weekStart = startOfCurrentWeek;
    const weekEnd = endOfCurrentWeek;

    if (end < weekStart || start > weekEnd) return null;

    const displayStart = start < weekStart ? weekStart : start;
    const displayEnd = end > weekEnd ? weekEnd : end;

    const startDiff = differenceInDays(displayStart, weekStart);
    const duration = differenceInDays(displayEnd, displayStart) + 1;

    return {
      gridColumnStart: startDiff + 1,
      gridColumnEnd: `span ${duration}`,
    };
  };

  const gridTemplate = "grid-cols-[150px_200px_1fr]";

  return (
    <Card className="w-full overflow-hidden border-none rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] bg-white p-0 gap-0">
      {/* Header */}
      <div className={`grid ${gridTemplate} border-b divide-x text-primary`}>
        {/* Col 1: Empty (above Title) */}
        <div className="bg-white" />

        {/* Col 2: Week Nav (above Media Types) */}
        <div className="p-4 flex items-center justify-between bg-white">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handlePrevWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-sm">Semaine {weekNumber}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleNextWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Col 3: Days (above Timeline) */}
        <div className="grid grid-cols-7 divide-x h-full">
          {daysOfWeek.map((day) => (
            <div
              key={day.toString()}
              className={cn(
                "p-3 text-center flex flex-col justify-center h-full",
                isSameDay(day, new Date()) && "bg-primary/6"
              )}
            >
              <span className="text-xs text-muted-foreground capitalize">
                {format(day, "EEEE", { locale: fr })}
              </span>
              <span className="text-sm font-medium">
                {format(day, "dd/MM")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="divide-y text-sm">
        {campaigns.map((campaign) => (
          <div
            key={campaign._id}
            className={`grid ${gridTemplate} divide-x group hover:bg-slate-50/20 transition-colors`}
          >
            {/* Col 1: Campaign Title */}
            <div className="p-6 flex flex-col justify-center bg-white">
              <span className="font-bold text-primary leading-tight">
                {campaign.title}
              </span>
            </div>

            {/* Col 2: Media Labels */}
            <div className="flex flex-col py-4 gap-3 bg-white">
              {campaign.budgetMedia.map((media, idx) => (
                <div
                  key={idx}
                  className="px-4 h-6 flex items-center font-medium text-primary truncate"
                >
                  {media.type === "ooh"
                    ? "Affichage"
                    : media.type === "tv"
                    ? "TV"
                    : media.type.charAt(0).toUpperCase() + media.type.slice(1)}
                </div>
              ))}
            </div>

            {/* Col 3: Timeline */}
            <div className="relative">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-7 divide-x pointer-events-none z-0">
                {daysOfWeek.map((day, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-full",
                      isSameDay(day, new Date()) ? "bg-primary/6" : ""
                    )}
                  />
                ))}
              </div>

              {/* Media Rows */}
              <div className="flex flex-col py-4 gap-3 relative z-10 px-0.5">
                {campaign.budgetMedia.map((media, idx) => {
                  const { start, end } = getMediaDates(
                    media,
                    campaign.startDate,
                    campaign.endDate
                  );
                  const now = new Date();

                  // Calculate segment boundaries (displayed part of the bar)
                  const weekStart = startOfCurrentWeek;
                  const weekEnd = endOfCurrentWeek;
                  const displayStart = start < weekStart ? weekStart : start;
                  const displayEnd = end > weekEnd ? weekEnd : end;

                  // Calculate progress relative to this specific segment
                  let segmentWidth = 0;
                  if (now > displayEnd) {
                    segmentWidth = 100;
                  } else if (now < displayStart) {
                    segmentWidth = 0;
                  } else {
                    const segmentDuration =
                      displayEnd.getTime() - displayStart.getTime();
                    const segmentElapsed =
                      now.getTime() - displayStart.getTime();
                    segmentWidth = (segmentElapsed / segmentDuration) * 100;
                  }

                  // Global progress for text
                  const totalDuration = end.getTime() - start.getTime();
                  const globalElapsed = now.getTime() - start.getTime();
                  const globalTimeProgress = Math.min(
                    100,
                    Math.max(0, (globalElapsed / totalDuration) * 100)
                  );

                  const isContinuesLeft = start < weekStart;
                  const isContinuesRight = end > weekEnd;

                  // Show text if the "progress head" is within this segment
                  const progressHead = Math.min(now.getTime(), end.getTime());
                  const showText =
                    progressHead >= displayStart.getTime() &&
                    progressHead <= displayEnd.getTime();
                  const position = getBarPosition(start, end);

                  return (
                    <div
                      key={idx}
                      className="grid grid-cols-7 h-6 items-center"
                    >
                      {position && (
                        <div
                          className={cn(
                            "flex items-center justify-between px-1 text-xs font-medium text-secondary h-6 mx-1 shadow-sm overflow-hidden relative",
                            "bg-destructive/20",
                            !isContinuesLeft && "rounded-l-full",
                            !isContinuesRight && "rounded-r-full"
                          )}
                          style={{
                            ...position,
                          }}
                        >
                          {segmentWidth > 0 && (
                            <div
                              className={cn(
                                "h-full bg-destructive absolute top-0 left-0 bottom-0 z-0 flex items-center justify-end px-4",
                                !isContinuesLeft && "rounded-l-full",
                                !isContinuesRight &&
                                  segmentWidth === 100 &&
                                  "rounded-r-full"
                              )}
                              style={{
                                width: `${segmentWidth}%`,
                                maxWidth: "100%",
                              }}
                            >
                              {showText && (
                                <span className="text-white text-[10px] font-bold drop-shadow-sm whitespace-nowrap">
                                  {Math.round(globalTimeProgress)}%
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
