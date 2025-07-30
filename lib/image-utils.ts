export const isImagesDisabled = () => {
  return process.env.NEXT_PUBLIC_DEV_DISABLE_IMAGES === "true";
};

export const getImageSrc = (
  src: string | null | undefined,
  placeholder = "/placeholder.svg",
): string => {
  if (isImagesDisabled()) {
    return placeholder;
  }

  return src || placeholder;
};

export const getRestaurantImageUrl = (
  restaurantId: string,
  filename: string,
) => {
  if (process.env.NEXT_PUBLIC_DEV_DISABLE_IMAGES === "true") {
    return "/placeholder.svg";
  }

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/restaurant-images/${restaurantId}/${filename}`;
};
