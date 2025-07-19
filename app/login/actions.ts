"use server";

import { createSSRClient } from "@/lib/supabase/clients/ssr";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const login = async (formData: FormData) => {
  const supabase = await createSSRClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
};

export const signup = async (formData: FormData) => {
  const supabase = await createSSRClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
};
