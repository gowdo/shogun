"use strict";

// var intersect = require("lines-intersect");
// var inside = require("point-inside-polygon");

function inside(p, poly) {
  var i, j, c = false, nvert = poly.length;
  for (i = 0, j = nvert - 1; i < nvert; j = i++) {
    if (((poly[i][1] > p[1]) !== (poly[j][1] > p[1])) &&
      (p[0] < (poly[j][0] - poly[i][0]) * (p[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])) {
      c = !c;
    }
  }
  return c;
}

function on_seg(xi, yi, xj, yj, xk, yk) {
  return (xi <= xk || xj <= xk) && (xk <= xi || xk <= xj) &&
    (yi <= yk || yj <= yk) && (yk <= yi || yk <= yj);
}

function dir(xi, yi, xj, yj, xk, yk) {
  var a = (xk - xi) * (yj - yi);
  var b = (xj - xi) * (yk - yi);
  return a < b ? -1 : a > b ? 1 : 0;
}

function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  var d1 = dir(x3, y3, x4, y4, x1, y1);
  var d2 = dir(x3, y3, x4, y4, x2, y2);
  var d3 = dir(x1, y1, x2, y2, x3, y3);
  var d4 = dir(x1, y1, x2, y2, x4, y4);
  return (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
    ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) ||
    (d1 === 0 && on_seg(x3, y3, x4, y4, x1, y1)) ||
    (d2 === 0 && on_seg(x3, y3, x4, y4, x2, y2)) ||
    (d3 === 0 && on_seg(x1, y1, x2, y2, x3, y3)) ||
    (d4 === 0 && on_seg(x1, y1, x2, y2, x4, y4));
}

function polygon_points_inside(p0, p1) {
  var i;
  for (i = 0; i < p0.length; i += 1) {
    if (inside(p0[i], p1)) {
      return true;
    }
  }
  for (i = 0; i < p1.length; i += 1) {
    if (inside(p1[i], p0)) {
      return true;
    }
  }
  return false;
}

function polygon_edges_overlap(p0, p1) {
  for (var i = 0; i < p0.length - 1; i += 1) {
    for (var j = 0; j < p1.length - 1; j += 1) {
      if (intersect(p0[i][0], p0[i][1], p0[i + 1][0], p0[i + 1][1],
        p1[j][0], p1[j][1], p1[j + 1][0], p1[j + 1][1])) {
        return true;
      }
    }
  }
  return false;
}

export function overlap(p0, p1) {

  // polygons overlap if either

  // 1. one of the points of one polygon is inside the other polygon polygon
  if (polygon_points_inside(p0, p1)) {
    return true;
  }

  // 2. one of the edges overlap
  if (polygon_edges_overlap(p0, p1)) {
    return true;
  }

  return false;
}


