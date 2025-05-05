import type { MapProps } from "@vis.gl/react-google-maps";

export const LOCAL_STORAGE_KEY_BASE = "io.wintery.weat";
export const LOCAL_STORAGE_MAP_MAP_TYPE_ID = `${LOCAL_STORAGE_KEY_BASE}.map.mapTypeId`;

export const DEFAULT_MAP_CAMERA_PROPS: Required<Pick<MapProps, "defaultCenter" | "defaultZoom">> = {
  defaultCenter: { lat: 37.3346438, lng: -122.0115523 },
  defaultZoom: 14,
};

export enum PlaceTypes {
  FOOD = "food",
}
