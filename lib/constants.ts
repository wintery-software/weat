import { Constants } from "@/types/supabase";
import { type SortOption, type ViewMode } from "@/types/types";

export const APP_NAME = "Weat";

export const COMPANY_NAME = "Wintery Software";

export const AI_NAME = `${APP_NAME} AI`;

export const DEFAULT_FETCH_LIMIT = 20;

export const VIEW_MODES = ["grid", "list", "map"] as const;

export const RESTAURANT_SORT_OPTIONS: SortOption[] = [
  "default",
  "distance:asc",
  "distance:desc",
  "rating:asc",
  "rating:desc",
  "review_count:asc",
  "review_count:desc",
] as const;

export const DEFAULT_VIEW: ViewMode = "grid";

export const DEFAULT_DEBOUNCE_DELAY = 300;

// Filter defaults
export const DEFAULT_RESTAURANT_QUERY = "";

export const DEFAULT_RESTAURANT_SORT_BY: SortOption = "default";

export const DATABASE_ALL_TASK_STATUSES = Constants.public.Enums.task_status;

export const DATABASE_USER_ROLES = Constants.public.Enums.user_role;

export const SELECTED_TAG_BADGE_COLOR =
  "bg-blue-100 hover:bg-blue-50 text-blue-900";

export const SELECTED_SUGGESTED_TAG_BADGE_COLOR =
  "bg-yellow-100 hover:bg-yellow-50 text-yellow-900";

export const MIN_PASSWORD_LENGTH = 8;
