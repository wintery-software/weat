import { redirect } from "next/navigation";

export const GET = async () =>
  redirect(process.env.GOOGLE_SUGGEST_FORM_URL || "#");
