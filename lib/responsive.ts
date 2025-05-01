export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const MIN_WIDTH_QUERIES = {
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  "2xl": `(min-width: ${BREAKPOINTS["2xl"]}px)`,
};

export const MAX_WIDTH_QUERIES = {
  sm: `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  md: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  lg: `(max-width: ${BREAKPOINTS.lg - 1}px)`,
  xl: `(max-width: ${BREAKPOINTS.xl - 1}px)`,
  "2xl": `(max-width: ${BREAKPOINTS["2xl"] - 1}px)`,
};
