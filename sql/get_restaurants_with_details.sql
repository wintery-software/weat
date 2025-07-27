create or replace function get_restaurants_user_view (
  lat float, 
  lng float
) returns table (
  id uuid,
  name_zh character varying,
  name_en character varying,
  phone_number character varying,
  updated_at timestamp with time zone,
  is_blocked boolean,
  place jsonb,
  summary jsonb,
  distance double precision
) as $$
begin
  return query
  select
    r.id,
    r.name_zh,
    r.name_en,
    r.phone_number,
    r.updated_at,
    r.is_blocked,
    jsonb_build_object(
      'address_1', p.address_1,
      'address_2', p.address_2,
      'city', p.city,
      'state', p.state,
      'zip_code', p.zip_code,
      'google_maps_place_id', p.google_maps_place_id
    ) as place,
    jsonb_build_object(
      'average_rating', rs.average_rating,
      'review_count', rs.review_count,
      'summary', rs.summary,
      'top_tags', rs.top_tags,
      'updated_at', rs.updated_at
    ) as summary,
    gis.ST_Distance(
      p.location,
      gis.ST_SetSRID(gis.ST_MakePoint(lng, lat), 4326)::gis.geography
    ) as distance
  from
    restaurants as r
    join places as p on r.place_id = p.id
    left join restaurant_summaries as rs on r.id = rs.restaurant_id;
end;
$$ language plpgsql; 