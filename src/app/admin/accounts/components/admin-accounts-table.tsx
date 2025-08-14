"use client";
import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SvgCorbeille from "@/components/icons/Corbeille";
import SvgCrayonBig from "@/components/icons/CrayonBig";
import SvgSmallDown from "@/components/icons/SmallDown";

type adminAccount = {
  name: string;
  lastname: string;
  email: string;
  role: string;
  id: string;
};

interface adminAccountsProps {
  adminAccounts: adminAccount[];
}

type SortKey = keyof adminAccount;
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <SvgSmallDown
      className={`w-4 h-4 transition-transform duration-200 ${
        active ? (dir === "asc" ? "rotate-0" : "rotate-180") : "opacity-40"
      }`}
    />
  );
}

export default function AdminAccountsTable({
  adminAccounts,
}: adminAccountsProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(nextKey);
      setSortDir("asc");
    }
  }

  const sorted = useMemo(() => {
    const copy = [...adminAccounts];
    copy.sort((a, b) => {
      const av = (a[sortKey] ?? "").toString();
      const bv = (b[sortKey] ?? "").toString();
      const cmp = av.localeCompare(bv, "fr", {
        sensitivity: "base",
        numeric: true,
      });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [adminAccounts, sortKey, sortDir]);

  const thButton =
    "flex items-center gap-1 w-[100px] text-base font-bold text-primary cursor-pointer select-none";

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow className="border-none">
            <TableHead>
              <div onClick={() => handleSort("name")} className={thButton}>
                Prénom <SortIcon active={sortKey === "name"} dir={sortDir} />
              </div>
            </TableHead>
            <TableHead>
              <div onClick={() => handleSort("lastname")} className={thButton}>
                Nom <SortIcon active={sortKey === "lastname"} dir={sortDir} />
              </div>
            </TableHead>
            <TableHead>
              <div onClick={() => handleSort("email")} className={thButton}>
                Email <SortIcon active={sortKey === "email"} dir={sortDir} />
              </div>
            </TableHead>
            <TableHead>
              <div onClick={() => handleSort("role")} className={thButton}>
                Rôle <SortIcon active={sortKey === "role"} dir={sortDir} />
              </div>
            </TableHead>
            <TableHead>
              <div onClick={() => handleSort("id")} className={thButton}>
                Identifiant{" "}
                <SortIcon active={sortKey === "id"} dir={sortDir} />
              </div>
            </TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((adminAccount, index) => (
            <TableRow className="text-lg h-15 border-[#A5A4BF]" key={index}>
              <TableCell>{adminAccount.name}</TableCell>
              <TableCell>{adminAccount.lastname}</TableCell>
              <TableCell>{adminAccount.email}</TableCell>
              <TableCell>{adminAccount.role}</TableCell>
              <TableCell>{adminAccount.id}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-4">
                  <SvgCrayonBig />
                  <SvgCorbeille />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
