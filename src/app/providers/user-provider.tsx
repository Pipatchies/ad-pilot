"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";

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
  isImpersonating: boolean;
  stopImpersonating: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Use a state to store the impersonated ID so we can update it and trigger re-renders
  const [impersonatedUserId, setImpersonatedUserId] =
    useState<Id<"users"> | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize from localStorage on mount
    const stored = localStorage.getItem("convex_impersonating_user");
    if (stored) {
      setImpersonatedUserId(stored as Id<"users">);
    }

    // Listen for storage events to sync across tabs or when set elsewhere
    const handleStorage = () => {
      const current = localStorage.getItem("convex_impersonating_user");
      setImpersonatedUserId(current as Id<"users"> | null);
    };

    window.addEventListener("storage", handleStorage);
    // Custom event for same-tab updates
    window.addEventListener("impersonation-change", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("impersonation-change", handleStorage);
    };
  }, []);

  const user = useQuery(
    api.queries.users.getEffectiveUser,
    impersonatedUserId ? { impersonatedUserId } : {}
  );

  const isLoading = user === undefined;

  const stopImpersonating = () => {
    localStorage.removeItem("convex_impersonating_user");
    setImpersonatedUserId(null);
    window.dispatchEvent(new Event("impersonation-change"));
    router.push("/admin/dashboard");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isImpersonating: !!impersonatedUserId,
        stopImpersonating,
      }}
    >
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
