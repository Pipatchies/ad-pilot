import React from "react";
import { Card } from "@/components/ui/card";
import Typography from "@/components/typography";
import SvgCheckRose from "@/components/icons/CheckRose";
import SvgEnCours from "@/components/icons/EnCours";
import { cn } from "@/lib/utils";

type StepStatus = "completed" | "current" | "upcoming";

interface Step {
  id: number;
  label: string;
  status: StepStatus;
}

interface StepCardProps {
  steps: Step[];
}

export default function StepCard({ steps }: StepCardProps) {
  return (
    <Card className="w-full h-[207] rounded-sm shadow-around bg-white border-none text-primary px-8 py-9">
      <Typography variant="h3">Etape du projet</Typography>

      <div className="flex justify-between items-start w-full">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";

          const nextStep = steps[index + 1];
          const showLine = !isLast;

          const isLineActive =
            step.status === "completed" ||
            (step.status === "current" && nextStep?.status !== "upcoming");

          return (
            <div
              key={step.id}
              className="flex-1 flex flex-col items-center relative"
            >
              {showLine && (
                <div
                  className={cn(
                    "relative top-5 left-1/2 h-[1px] ",
                    isLineActive ? "bg-destructive w-20" : "bg-[#E1DFE6] w-20"
                  )}
                />
              )}

              <div className="mb-2">
                {isCompleted ? (
                  <SvgCheckRose />
                ) : isCurrent ? (
                  <SvgEnCours />
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-[#A5A4BF] flex items-center justify-center text-sm text-[#A5A4BF] font-bold">
                    {step.id}
                  </div>
                )}
              </div>

              <span
                className={cn(
                  "text-sm",
                  isCompleted && "text-primary",
                  isCurrent && "text-primary font-bold",
                  step.status === "upcoming" && "text-[#A5A4BF]"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
