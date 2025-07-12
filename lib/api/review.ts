import { getTableCount } from "@/lib/supabase";

export const getReviewsCount = async () => getTableCount("reviews");
