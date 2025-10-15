import { tableFieldHeight, tableHeaderHeight, safetyMargin } from "../data/constants";

/**
 * Obstacle-aware path calculator. Tries to route an orthogonal polyline
 * around table rectangles (expanded by safetyMargin). Falls back to a
 * simple cubic curve when no collision-free orthogonal polyline is found.
 */
export function calcPath(r, tableWidth = 200, zoom = 1, tables = []) {
  if (!r) return "";

  const width = tableWidth * zoom;
  const x1 = r.startTable.x;
  const y1 =
    r.startTable.y +
    r.startFieldIndex * tableFieldHeight +
    tableHeaderHeight +
    tableFieldHeight / 2;
  const x2 = r.endTable.x;
  const y2 =
    r.endTable.y +
    r.endFieldIndex * tableFieldHeight +
    tableHeaderHeight +
    tableFieldHeight / 2;

  // Build obstacles from tables list (skip start/end)
  const obs = (tables || [])
    .filter((t) => t.id !== r.startTableId && t.id !== r.endTableId)
    .map((t) => ({
      x: t.x - safetyMargin,
      y: t.y - safetyMargin,
      w: tableWidth + 2 * safetyMargin,
      h: t.fields.length * tableFieldHeight + tableHeaderHeight + 2 * safetyMargin,
    }));

  const rectIntersectsSeg = (rx, ry, rw, rh, xA, yA, xB, yB) => {
    const rLeft = rx;
    const rRight = rx + rw;
    const rTop = ry;
    const rBottom = ry + rh;

    if (xA === xB) {
      const sx = xA;
      const sy1 = Math.min(yA, yB);
      const sy2 = Math.max(yA, yB);
      return sx >= rLeft && sx <= rRight && !(sy2 < rTop || sy1 > rBottom);
    }
    if (yA === yB) {
      const sy = yA;
      const sx1 = Math.min(xA, xB);
      const sx2 = Math.max(xA, xB);
      return sy >= rTop && sy <= rBottom && !(sx2 < rLeft || sx1 > rRight);
    }
    // fallback bbox intersection
    const sx1 = Math.min(xA, xB);
    const sx2 = Math.max(xA, xB);
    const sy1 = Math.min(yA, yB);
    const sy2 = Math.max(yA, yB);
    return !(sx2 < rLeft || sx1 > rRight || sy2 < rTop || sy1 > rBottom);
  };

  const polylineCollides = (sX, sY, mX, eX, eY) => {
    const segments = [
      [sX, sY, mX, sY],
      [mX, sY, mX, eY],
      [mX, eY, eX, eY],
    ];
    for (const seg of segments) {
      for (const o of obs) {
        if (rectIntersectsSeg(o.x, o.y, o.w, o.h, seg[0], seg[1], seg[2], seg[3])) return true;
      }
    }
    return false;
  };

  const startConnX = x1 + width; // by default connect at right edge of start
  const endConnX = x2 + (x2 + width < x1 ? width : 0); // connect left or right edge depending on position

  const baseMid = (startConnX + endConnX) / 2;
  const step = Math.max(width, safetyMargin * 2);
  const tries = [0, step, -step, step * 2, -step * 2];
  for (const t of tries) {
    const candidateMid = baseMid + t;
    if (!polylineCollides(startConnX, y1, candidateMid, endConnX, y2)) {
      return `M ${startConnX} ${y1} L ${candidateMid} ${y1} L ${candidateMid} ${y2} L ${endConnX} ${y2}`;
    }
  }

  // fallback cubic curve
  const midX = (startConnX + endConnX) / 2;
  return `M ${startConnX} ${y1} C ${midX} ${y1} ${midX} ${y2} ${endConnX} ${y2}`;
}

import { tableFieldHeight, tableHeaderHeight, safetyMargin } from "../data/constants";

/**
 * Generates an SVG path string to visually represent a relationship between two fields.
 *
 * @param {{
 *   startTable: { x: number, y: number },
 *   endTable: { x: number, y: number },
 *   startFieldIndex: number,
 *   endFieldIndex: number
 * }} r - Relationship data.
 * @param {number} tableWidth - Width of each table (used to calculate horizontal offsets).
 * @param {number} zoom - Zoom level (used to scale vertical spacing).
 * @returns {string} SVG path "d" attribute string.
 */
export function calcPath(r, tableWidth = 200, zoom = 1, tables = []) {
  if (!r) {
    return "";
  }
  
  const width = tableWidth * zoom;
  let x1 = r.startTable.x;
  let y1 =
    r.startTable.y +
    r.startFieldIndex * tableFieldHeight +
    tableHeaderHeight +
    tableFieldHeight / 2;
  let x2 = r.endTable.x;
  let y2 =
    r.endTable.y +
    r.endFieldIndex * tableFieldHeight +
    tableHeaderHeight +
    tableFieldHeight / 2;

  let radius = 10 * zoom;
  const midX = (x2 + x1 + width) / 2;
  const endX = x2 + width < x1 ? x2 + width : x2;

  // Check for intersections with other tables
  for (const table of tables) {
    if (table.id === r.startTableId || table.id === r.endTableId) {
      continue;
    }

    const tableBox = {
      x: table.x - safetyMargin,
      y: table.y - safetyMargin,
      width: tableWidth + 2 * safetyMargin,
      height: table.fields.length * tableFieldHeight + tableHeaderHeight + 2 * safetyMargin,
    };

    // Check for intersection between the line (x1, y1) -> (x2, y2) and the tableBox
    if (
      x1 < tableBox.x + tableBox.width &&
      x1 + width > tableBox.x &&
      y1 < tableBox.y + tableBox.height &&
      y1 > tableBox.y
    ) {
      // Simple avoidance logic: create a detour around the table
      const detourX = tableBox.x + tableBox.width / 2;
      const detourY1 = tableBox.y - safetyMargin;
      const detourY2 = tableBox.y + tableBox.height + safetyMargin;

      if (y1 < tableBox.y) {
        return `M ${x1} ${y1} L ${detourX} ${y1} L ${detourX} ${detourY2} L ${x2} ${detourY2} L ${x2} ${y2}`;
      } else {
        return `M ${x1} ${y1} L ${detourX} ${y1} L ${detourX} ${detourY1} L ${x2} ${detourY1} L ${x2} ${y2}`;
      }
    }
  }

  if (Math.abs(y1 - y2) <= 36 * zoom) {
    radius = Math.abs(y2 - y1) / 3;
    if (radius <= 2) {
      if (x1 + width <= x2) return `M ${x1 + width} ${y1} L ${x2} ${y2 + 0.1}`;
      else if (x2 + width < x1)
        return `M ${x1} ${y1} L ${x2 + width} ${y2 + 0.1}`;
    }
  }

  if (y1 <= y2) {
    if (x1 + width <= x2) {
      return `M ${x1 + width} ${y1} L ${
        midX - radius
      } ${y1} A ${radius} ${radius} 0 0 1 ${midX} ${y1 + radius} L ${midX} ${
        y2 - radius
      } A ${radius} ${radius} 0 0 0 ${midX + radius} ${y2} L ${endX} ${y2}`;
    } else if (x2 <= x1 + width && x1 <= x2) {
      return `M ${x1 + width} ${y1} L ${
        x2 + width
      } ${y1} A ${radius} ${radius} 0 0 1 ${x2 + width + radius} ${
        y1 + radius
      } L ${x2 + width + radius} ${y2 - radius} A ${radius} ${radius} 0 0 1 ${
        x2 + width
      } ${y2} L ${x2 + width} ${y2}`;
    } else if (x2 + width >= x1 && x2 + width <= x1 + width) {
      return `M ${x1} ${y1} L ${
        x2 - radius
      } ${y1} A ${radius} ${radius} 0 0 0 ${x2 - radius - radius} ${
        y1 + radius
      } L ${x2 - radius - radius} ${y2 - radius} A ${radius} ${radius} 0 0 0 ${
        x2 - radius
      } ${y2} L ${x2} ${y2}`;
    } else {
      return `M ${x1} ${y1} L ${
        midX + radius
      } ${y1} A ${radius} ${radius} 0 0 0 ${midX} ${y1 + radius} L ${midX} ${
        y2 - radius
      } A ${radius} ${radius} 0 0 1 ${midX - radius} ${y2} L ${endX} ${y2}`;
    }
  } else {
    if (x1 + width <= x2) {
      return `M ${x1 + width} ${y1} L ${
        midX - radius
      } ${y1} A ${radius} ${radius} 0 0 0 ${midX} ${y1 - radius} L ${midX} ${
        y2 + radius
      } A ${radius} ${radius} 0 0 1 ${midX + radius} ${y2} L ${endX} ${y2}`;
    } else if (x1 + width >= x2 && x1 + width <= x2 + width) {
      return `M ${x1} ${y1} L ${
        x1 - radius - radius
      } ${y1} A ${radius} ${radius} 0 0 1 ${x1 - radius - radius - radius} ${
        y1 - radius
      } L ${x1 - radius - radius - radius} ${
        y2 + radius
      } A ${radius} ${radius} 0 0 1 ${
        x1 - radius - radius
      } ${y2} L ${endX} ${y2}`;
      return `M ${x1 + width} ${y1} L ${
        x1 + width + radius
      } ${y1} A ${radius} ${radius} 0 0 0 ${x1 + width + radius + radius} ${
        y1 - radius
      } L ${x1 + width + radius + radius} ${

    // Build obstacle rectangles from tables, expanded by safetyMargin. Skip start/end tables.
    const obstacles = tables
      .filter((t) => t.id !== r.startTableId && t.id !== r.endTableId)
      .map((t) => ({
        x: t.x - safetyMargin,
        y: t.y - safetyMargin,
        w: tableWidth + 2 * safetyMargin,
        h: t.fields.length * tableFieldHeight + tableHeaderHeight + 2 * safetyMargin,
      }));

    // Helper to test axis-aligned segment intersection with a rect
    const segIntersectsRect = (xA, yA, xB, yB, rect) => {
      const rx1 = rect.x;
      const ry1 = rect.y;
      const rx2 = rect.x + rect.w;
      const ry2 = rect.y + rect.h;

      if (xA === xB) {
        const sx = xA;
        const sy1 = Math.min(yA, yB);
        const sy2 = Math.max(yA, yB);
        return sx >= rx1 && sx <= rx2 && !(sy2 < ry1 || sy1 > ry2);
      } else if (yA === yB) {
        const sy = yA;
        const sx1 = Math.min(xA, xB);
        const sx2 = Math.max(xA, xB);
  
        return sy >= ry1 && sy <= ry2 && !(sx2 < rx1 || sx1 > rx2);
      }
      // fallback bbox check
      const sx1 = Math.min(xA, xB);
      const sx2 = Math.max(xA, xB);
      const sy1 = Math.min(yA, yB);
      const sy2 = Math.max(yA, yB);
      return !(sx2 < rx1 || sx1 > rx2 || sy2 < ry1 || sy1 > ry2);
    };

    const isCollisionForPolyline = (sx, sy, midX, ex, ey) => {
      const segments = [
        [sx + width, sy, midX, sy],
        [midX, sy, midX, ey],
        [midX, ey, ex, ey],
      ];
      for (const seg of segments) {
        for (const obs of obstacles) {
          if (segIntersectsRect(seg[0], seg[1], seg[2], seg[3], obs)) return true;
        }
      }
      return false;
    };

    // try multiple midpoints to find a collision-free orthogonal polyline
    const baseMidX = (x1 + x2 + width) / 2;
    const delta = Math.max(width, safetyMargin * 2);
    const attempts = [0, delta, -delta, delta * 2, -delta * 2];
    for (const a of attempts) {
      const candidateMid = baseMidX + a;
      if (!isCollisionForPolyline(x1, y1, candidateMid, x2 + (x2 < x1 ? width : 0), y2)) {
        return `M ${x1 + width} ${y1} L ${candidateMid} ${y1} L ${candidateMid} ${y2} L ${x2 + (x2 < x1 ? width : 0)} ${y2}`;
      }
    }
