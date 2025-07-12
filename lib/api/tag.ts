import { getTableCount } from "@/lib/supabase";
import { createSSRClient } from "@/lib/supabase/clients/ssr";
import { Tag } from "@/types/types";

export const getTags = async (asObject: boolean = false) => {
  const supabase = await createSSRClient();
  const { data, error } = await supabase.from("tags").select("id, name");

  if (error) {
    throw error;
  }

  if (!asObject) {
    return data as Tag[];
  }

  return Object.fromEntries(data.map((tag) => [tag.id, tag.name])) as Record<
    string,
    string
  >;
};

export const getTagsCount = async () => {
  return getTableCount("tags");
};
