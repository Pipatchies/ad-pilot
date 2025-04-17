import SvgMoneyBag from "@/components/icons/MoneyBag";
import Typography from "@/components/typography";
import { Card } from "@/components/ui/card";
import React from "react";

interface BudgetCardProps {
  price: number;
}

export default function BudgetCard({price}: BudgetCardProps) {
  return (
    <Card className="w-full h-[207] rounded-sm shadow-around bg-white border-none text-primary px-14 py-9">
      <Typography variant="h3">Budget</Typography>
      <div className="flex flex-wrap items-center gap-x-3 mt-0 mb-10">
        <SvgMoneyBag />
        <span className="text-5xl font-[800]">{price} €</span>
      </div>
    </Card>
  );
}
