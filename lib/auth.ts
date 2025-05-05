import { auth } from "@/lib/next-auth";

export const isAuthenticated = async () => {
  const session = await auth();

  if (!session) {
    return false;
  }

  const hasEmail = !!session.user?.email;
  const isExpired = new Date() > new Date(session.expires);
  const hasAccessToken = !!session.accessToken;

  return hasEmail && !isExpired && hasAccessToken;
};

export const isAuthorized = async (groups: string[]) => {
  const session = await auth();

  if (!session) {
    return false;
  }

  const userGroups = session.user?.groups;

  if (!userGroups) {
    return false;
  }

  return userGroups.some((group) => groups.includes(group));
};
