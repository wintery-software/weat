import {
  LucideCakeSlice,
  LucideCupSoda,
  LucideGamepad2,
  LucideTreePine,
  LucideUtensils,
} from "lucide-react";

export const PLACE_ICONS = {
  restaurant: LucideUtensils,
  drink: LucideCupSoda,
  snack: LucideCakeSlice,
  trail: LucideTreePine,
  entertainment: LucideGamepad2,
};

/**
 * @see https://ui.shadcn.com/colors
 */
export const PLACE_COLORS = {
  restaurant: "#fb923c", // orange-400
  drink: "#a16207", // yellow-700
  snack: "#facc15", // yellow-400
  trail: "#16a34a", // green-600
  entertainment: "#a78bfa", // violet-400
};
