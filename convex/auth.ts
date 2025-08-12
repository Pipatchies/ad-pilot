import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        return {
          email: params.email as string,
          lastname: params.lastname as string,
          phone: params.phone as string,
          roleId: params.roleId as string,
          organizationId: params.organizationId as string,
          image: params.image as string,
          name: params.name as string,
        };
      },
    }),
  ],
});
