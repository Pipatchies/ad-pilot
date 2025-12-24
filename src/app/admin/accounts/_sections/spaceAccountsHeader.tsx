import Typography from "@/components/typography";
import React, { useState } from "react";
import AccountModal from "../../../../components/modal/account-modal";
import SearchBar from "@/components/search-bar";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

type accountsHeaderProps = {
  onQueryChange: (q: string) => void;
};

export default function SpaceAccountsHeader({
  onQueryChange,
}: accountsHeaderProps) {
      const adminAccounts = useQuery(api.queries.users.getAdmin) ?? [];
      const count = adminAccounts.length;
  return (
    <section>
      <div className="flex flex-wrap items-center justify-between">
        <Typography variant="h1" className="mb-0">
          Comptes
        </Typography>
        <AccountModal />
      </div>
      <p className="text-primary/80">
        {`${count} comptes`}
      </p>
      <div className="flex justify-end">
        <SearchBar variant="minimal" onQueryChange={onQueryChange} />
      </div>
    </section>
  );
}
