export type LatLng = { lat: number; lng: number };

// Deterministic PRNG (mulberry32) seeded by store id, so each store always
// lands on the same dummy coordinate across reloads instead of jumping
// around the map on every render.
function seededRandom(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Scatters a store around a market center within `radiusMeters`, using the
 * store id as the seed. Not real geodata - real store coordinates (once
 * merchants can register their own location) would replace this call
 * entirely without touching any of the map rendering code, since callers
 * only ever deal in {lat, lng}.
 */
export function generateStoreCoordinate(
  center: LatLng,
  storeId: number,
  radiusMeters = 100,
): LatLng {
  const random = seededRandom(storeId * 9973 + 17);
  const angle = random() * 2 * Math.PI;
  const distance = Math.sqrt(random()) * radiusMeters;

  const metersPerDegreeLat = 111_320;
  const metersPerDegreeLng = 111_320 * Math.cos((center.lat * Math.PI) / 180);

  return {
    lat: center.lat + (distance * Math.sin(angle)) / metersPerDegreeLat,
    lng: center.lng + (distance * Math.cos(angle)) / metersPerDegreeLng,
  };
}
