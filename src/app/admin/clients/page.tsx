import React from "react";

import SpaceClients from "./_sections/spaceClients";

type clientsProps = {
  onQueryChange: (q: string) => void;
};

export default function Clients({onQueryChange}:clientsProps) {
  return (
    <section className="flex flex-col gap-2">
      <SpaceClients/>
    </section>
  );
}
