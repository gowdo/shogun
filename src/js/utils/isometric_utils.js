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
