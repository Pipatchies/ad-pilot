"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

export default function Page() {
  const me = useQuery(api.queries.users.me);

  if (me === undefined) return <p>Chargement…</p>;
  if (me === null) return <p>Pas connecté</p>;

  return (
    <div>
      <p>Connecté en tant que {me?.email ?? me?.name}</p>
      <small>Session: {me.sessionId}</small>
    </div>
  );
}

