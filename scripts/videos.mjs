// Recorta y comprime los vídeos originales (../Video) para la web: sin audio, H.264 y con portada.
// Uso: npm run videos
import ffmpeg from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const SRC = '../Video';
const OUT = 'public/video';
mkdirSync(OUT, { recursive: true });

// La portada se ve en un marco 4:5, así que se recorta ya en el vídeo
const PORTRAIT = 'crop=ih*4/5:ih,';

const encode = (input, output, { from, duration, width, crf, crop = '' }) => [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-ss', String(from), '-t', String(duration), '-i', `${SRC}/${input}`,
  '-vf', `${crop}scale=${width}:-2`, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf),
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${OUT}/${output}`,
];

const poster = (input, output, { at, width, crop = '', dir = OUT }) => [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-ss', String(at), '-i', `${SRC}/${input}`, '-frames:v', '1', '-vf', `${crop}scale=${width}:-2`, '-q:v', '2', `${dir}/${output}`,
];

const general = 'Video general Rocodromo.mp4';
const jobs = [
  // Portada: 12 s del vídeo general a partir del 30 (muros, muro RW del autobelay, gente escalando)
  encode(general, 'hero-800.mp4', { from: 30, duration: 12, width: 800, crf: 29, crop: PORTRAIT }),
  encode(general, 'hero-560.mp4', { from: 30, duration: 12, width: 560, crf: 29, crop: PORTRAIT }),
  // Primer fotograma como imagen: Astro la sirve en AVIF/WebP mientras llega el vídeo
  poster(general, 'hero-poster.jpg', { at: 30, width: 1000, crop: PORTRAIT, dir: 'src/assets/img' }),
  // Panorámica para las portadas a pantalla completa (en móvil se usa la vertical)
  encode(general, 'hero-wide.mp4', { from: 30, duration: 12, width: 1600, crf: 31 }),
  poster(general, 'hero-wide.jpg', { at: 30, width: 1920, dir: 'src/assets/img' }),
  encode('Nuevo Bloque.mp4', 'nuevo-bloque.mp4', { from: 0, duration: 23, width: 540, crf: 27 }),
  poster('Nuevo Bloque.mp4', 'nuevo-bloque-poster.jpg', { at: 3, width: 540 }),
  encode('Video Tardeo.mp4', 'tardeo.mp4', { from: 0, duration: 9, width: 1280, crf: 28 }),
  poster('Video Tardeo.mp4', 'tardeo-poster.jpg', { at: 1, width: 1280 }),
];

for (const args of jobs) {
  const out = args.at(-1);
  const { status } = spawnSync(ffmpeg, args, { stdio: 'inherit' });
  console.log(status === 0 ? `✓ ${out}` : `✗ ${out}`);
}
