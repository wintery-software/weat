import type { MapProps } from "@vis.gl/react-google-maps";

export const LOCAL_STORAGE_KEY_BASE = "io.wintery.weat";

export const DEFAULT_MAP_CAMERA_PROPS: Required<Pick<MapProps, "defaultCenter" | "defaultZoom">> = {
  defaultCenter: { lat: 37.3346438, lng: -122.0115523 },
  defaultZoom: 14,
};

export enum PlaceTypes {
  FOOD = "food",
}

export const DEFAULT_DEBOUNCE_DELAY = 500;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_TOAST_DURATION = 5000;
