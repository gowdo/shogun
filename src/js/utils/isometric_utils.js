export function rotate(cx, cy, x, y, angle) {
  const radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
  return { x: nx, y: ny };
}

export function getAngleDeg(x, y) {
  const angleRad = Math.atan(x / y);
  const angDeg = toDegrees(angleRad);
  if (y <= 0) {
    return 180 + angDeg;
  } else if (x <= 0) {
    return 360 + angDeg;
  } else {
    return angDeg;
  }
}

export function toDegrees(angle) {
  return angle * (180 / Math.PI);
}

export function toRadians(angle) {
  return angle * (Math.PI / 180);
}

export function rotateXY(latitude, longitude) {
  // return { x: 180 - longitude, y: latitude + 90 };
  return { x: longitude, y: latitude};
}

export function convertIso(x, y) {
  const m = Math.sin(Math.PI / 6);
  return {
    x: (x * m - y * m),
    y: (x + y)
  };
}

export function convertIsoArray(x1, y1) {
  const { x, y } = convertIso(x1, y1);
  const r = rotateXY(x, y);
  return [r.x, r.y];
}

export function middlePoint1(lng1, lat1, lng2, lat2) {

  //-- Longitude difference
  const dLng = toRadians(lng2 - lng1);

  //-- Convert to radians
  lat1 = toRadians(lat1);
  lat2 = toRadians(lat2);
  lng1 = toRadians(lng1);

  const bX = Math.cos(lat2) * Math.cos(dLng);
  const bY = Math.cos(lat2) * Math.sin(dLng);
  const lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
  const lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

  //-- Return result
  return { x: toDegrees(lng3), y: toDegrees(lat3) };
}

export function middlePoint(latitude1, longitude1, latitude2, longitude2) {
  const DEG_TO_RAD = Math.PI / 180;     // To convert degrees to radians.

  // Convert latitude and longitudes to radians:
  const lat1 = latitude1 * DEG_TO_RAD;
  const lat2 = latitude2 * DEG_TO_RAD;
  const lng1 = longitude1 * DEG_TO_RAD;
  const dLng = (longitude2 - longitude1) * DEG_TO_RAD;  // Diff in longtitude.

  // Calculate mid-point:
  const bx = Math.cos(lat2) * Math.cos(dLng);
  const by = Math.cos(lat2) * Math.sin(dLng);
  const lat = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + by * by));
  const lng = lng1 + Math.atan2(by, Math.cos(lat1) + bx);

  return { x: lat / DEG_TO_RAD, y: lng / DEG_TO_RAD };
}
