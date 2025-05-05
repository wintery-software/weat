import type { CognitoUserGroup } from "@/types/index";
import type { JWT as DefaultJWT, DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    expires: Date;
  }

  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    groups?: CognitoUserGroup[];
  }

  interface User extends DefaultUser {
    groups?: CognitoUserGroup[];
  }
}
