import SvgCible from "@/components/icons/Cible";
import SvgMegaphone from "@/components/icons/Megaphone";
import { Card } from "@/components/ui/card";
import React from "react";
import SvgUsers from "@/components/icons/Users";
import SvgGrandeTelevision from "@/components/icons/GrandeTelevision";

interface ReportCardProps {
    grp: number;
    coverage: number;
    contacts: number;
    repetitions: number;
}

export default function ReportCard({grp, coverage, contacts, repetitions}: ReportCardProps) {
  return (
    <section>
      <Card className="w-full rounded-sm shadow-around bg-white border-none text-primary px-8 py-15">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
          <div className="flex items-center space-x-4">
            <SvgGrandeTelevision className="h-[46] w-[59] fill-[#a5a4bf]" />
            <div>
              <div className="text-3xl font-[800]">{grp}</div>
              <div className="text-xl">GRP</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
              <SvgCible />
            <div>
              <div className="text-3xl font-[800]">{coverage} %</div>
              <div className="text-xl">Couverture</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
              <SvgUsers />
            <div>
              <div className="text-3xl font-[800]">{contacts} M</div>
              <div className="text-xl">Contacts</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
              <SvgMegaphone />
            <div>
              <div className="text-3xl font-[800]">{repetitions}</div>
              <div className="text-xl">Répétitions</div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
