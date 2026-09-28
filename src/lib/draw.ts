/** Utilidades para dibujar a mano alzada (rotulador sobre foto) de forma determinista. */

export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

/** Círculo imperfecto de rotulador: se pasa un poco del cierre, como al marcar una presa. */
export function markerCircle(cx: number, cy: number, r: number, seed = 1) {
  const rand = rng(seed * 97 + 13);
  const start = rand() * Math.PI * 2;
  const sweep = Math.PI * 2 * (1.08 + rand() * 0.08);
  const steps = 26;
  const squash = 0.86 + rand() * 0.12;
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = start + sweep * t;
    const wobble = 1 + (rand() - 0.5) * 0.07 + t * 0.06;
    pts.push([cx + Math.cos(a) * r * wobble, cy + Math.sin(a) * r * wobble * squash]);
  }
  return smooth(pts);
}

/** Curva suave (Catmull-Rom → Bézier) que pasa por los puntos. */
export function smooth(pts: [number, number][]) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Línea de vía entre presas, ligeramente curvada como un croquis dibujado. */
export function routeLine(pts: [number, number][], seed = 3) {
  const rand = rng(seed);
  const out: [number, number][] = [];
  pts.forEach((p, i) => {
    out.push(p);
    const n = pts[i + 1];
    if (!n) return;
    const mx = (p[0] + n[0]) / 2;
    const my = (p[1] + n[1]) / 2;
    const len = Math.hypot(n[0] - p[0], n[1] - p[1]);
    const bend = (rand() - 0.5) * len * 0.18;
    const nx = -(n[1] - p[1]) / len;
    const ny = (n[0] - p[0]) / len;
    out.push([mx + nx * bend, my + ny * bend]);
  });
  return smooth(out);
}
