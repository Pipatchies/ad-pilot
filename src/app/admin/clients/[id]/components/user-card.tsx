import React from "react";
import UpdateAccountModal from "@/components/modal/update/update-account-modal";
import SvgMail from "@/components/icons/Mail";
import SvgProfil from "@/components/icons/Profil";
import { Card, CardContent } from "@/components/ui/card";
import { Id } from "@/../convex/_generated/dataModel";

interface UserCardProps {
  user:
    | {
        _id: Id<"users">;
        name?: string;
        lastname?: string;
        email?: string;
      }
    | null
    | undefined;
}

export default function UserCard({ user }: UserCardProps) {
  if (!user) {
    return (
      <Card className="text-primary bg-card/50 max-h-[250px] py-10 shadow-none border-none gap-y-4 w-full flex justify-center gap-2">
        <CardContent className="flex flex-row justify-center items-center w-full">
          <p className="text-muted-foreground italic">
            Aucun utilisateur associé à cette organisation.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="text-primary bg-card/50 h-auto xl:max-h-[250px] py-6 xl:py-10 shadow-none border-none gap-y-4 w-full flex justify-center gap-2">
      <CardContent className="flex flex-col xl:flex-row justify-between items-center w-full gap-6 xl:gap-0">
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-8 items-center">
          <p className="font-semibold text-xl xl:text-2xl">Utilisateur :</p>
          <div className="flex flex-row gap-2 items-center">
            <SvgProfil />
            <p className="text-base xl:text-lg">
              {user.name} {user.lastname}
            </p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <SvgMail />
            <p className="text-base xl:text-lg">{user.email}</p>
          </div>
        </div>

        <UpdateAccountModal
          userId={user._id}
          firstname={user.name ?? ""}
          lastname={user.lastname ?? ""}
          email={user.email ?? ""}
          triggerType="button"
          triggerText="Modifier l'utilisateur"
        />
      </CardContent>
    </Card>
  );
}
