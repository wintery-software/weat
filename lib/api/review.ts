import { getTableCount } from "@/lib/api";

export const getReviewsCount = async () => getTableCount("reviews");
