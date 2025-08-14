import SearchBar from "@/components/search-bar";
import Typography from "@/components/typography";
import React from "react";
import AccountModal from "./_sections/accountModal";
import SpaceAccountsTable from "./_sections/spaceAccountsTable";



export default function Accounts() {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between">
        <Typography variant="h1" className="mb-0">Comptes</Typography>
        <AccountModal />
        </div>
      <p className="text-primary/80">6 comptes</p>
      <div className="flex justify-end">
      <SearchBar variant="minimal" />
      </div>
      <div>
        <SpaceAccountsTable/>
      </div>
    </section>
  );
}
