import { headers } from "next/headers";

export const getCurrentUrl = async () => {
  return new URL((await headers()).get("x-url") || "/");
};
