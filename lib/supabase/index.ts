import { createSSRClient } from "@/lib/supabase/clients/ssr";

export const getTableCount = async (table: string) => {
  const supabase = await createSSRClient();

  const { count, error } = await supabase.from(table).select("*", {
    count: "exact",
    head: true,
  });

  if (error) {
    throw error;
  }

  return count;
};
