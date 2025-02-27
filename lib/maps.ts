export const getCurrentPosition = async (
  options?: PositionOptions,
): Promise<google.maps.LatLngLiteral> => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported.");
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });

  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
};
