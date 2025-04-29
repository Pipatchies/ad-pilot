import SvgMoneyBag from "@/components/icons/MoneyBag";
import Typography from "@/components/typography";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";

interface BudgetCardProps {
  price: number;
}

export default function BudgetCard({price}: BudgetCardProps) {
  return (
    <Card className="w-full h-[207] rounded-sm shadow-around bg-white border-none text-primary px-8 py-9">
        <CardHeader>
      <Typography variant="h3">Budget</Typography>
      </CardHeader>
      <CardContent>
      <div className="flex flex-wrap items-center gap-x-3 mt-0 mb-10">
        <SvgMoneyBag />
        <span className="text-5xl font-extrabold">{price} €</span>
      </div>
      </CardContent>
    </Card>
  );
}
