"use client";

import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type UserData =
  | {
      _id: Id<"users">;
      _creationTime: number;
      name?: string;
      email?: string;
      image?: string;
      roleId?: Id<"roles">;
      organizationId?: Id<"organizations">;
      lastname?: string;
      lastConnectionTime?: number;
      role: string | "unknown";
      sessionId: string | null | undefined;
    }
  | null
  | undefined;

type UserContextType = {
  user: UserData;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const user = useQuery(api.queries.users.me);
  const isLoading = user === undefined;

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
