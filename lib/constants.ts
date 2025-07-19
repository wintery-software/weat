import { Constants } from "@/types/db";
import { ViewMode } from "@/types/types";

export const APP_NAME = "Weat";

export const COMPANY_NAME = "Wintery Software";

export const AI_NAME = `${APP_NAME} AI`;

// Database enum constants
export const ALL_TASK_STATUSES = Constants.public.Enums.task_status;

export const USER_ROLES = Constants.public.Enums.user_role;

export const VIEW_MODES = ["grid", "list", "map"] as const;

export const DEFAULT_VIEW = "grid" as ViewMode;

export const DEFAULT_DEBOUNCE_DELAY = 300;
