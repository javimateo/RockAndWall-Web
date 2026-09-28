// Vectoriza el logo RW a partir de fotogramas del vídeo oficial (binarizados, negro sobre blanco).
// Uso: node scripts/trace-logo.mjs <monograma.png> <lettering.png>
// Salida: src/assets/brand/rw-monogram.svg y rw-wordmark.svg, con fill="currentColor".
import potrace from 'potrace';
import { writeFile } from 'node:fs/promises';

const [mono, word] = process.argv.slice(2);

const trace = (file, opts = {}) =>
  new Promise((ok, ko) =>
    potrace.trace(
      file,
      { turdSize: 60, alphaMax: 1, optCurve: true, optTolerance: 0.8, threshold: 128, ...opts },
      (err, svg) => (err ? ko(err) : ok(svg))
    )
  );

// Redondea coordenadas y ajusta el viewBox al contenido real.
function clean(svg, pad = 8) {
  const d = svg.match(/ d="([^"]+)"/)[1];
  const nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  const minX = Math.min(...xs) - pad, minY = Math.min(...ys) - pad;
  const w = Math.max(...xs) + pad - minX, h = Math.max(...ys) + pad - minY;
  const round = d.replace(/-?\d+\.\d+/g, (n) => (+n).toFixed(1).replace(/\.0$/, ''));
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${w} ${h}">` +
    `<path fill="currentColor" fill-rule="evenodd" d="${round}"/></svg>\n`
  );
}

await writeFile('src/assets/brand/rw-monogram.svg', clean(await trace(mono)));
await writeFile('src/assets/brand/rw-wordmark.svg', clean(await trace(word, { turdSize: 30 })));
console.log('ok');
