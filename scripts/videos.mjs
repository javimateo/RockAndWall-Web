// Recorta y comprime los vídeos originales (../Video) para la web: sin audio, H.264 y con portada.
// Uso: npm run videos
import ffmpeg from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const SRC = '../Video';
const OUT = 'public/video';
mkdirSync(OUT, { recursive: true });

const encode = (input, output, { from, duration, width, crf }) => [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-ss', String(from), '-t', String(duration), '-i', `${SRC}/${input}`,
  '-vf', `scale=${width}:-2`, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf),
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${OUT}/${output}`,
];

const poster = (input, output, { at, width }) => [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-ss', String(at), '-i', `${SRC}/${input}`, '-frames:v', '1', '-vf', `scale=${width}:-2`, '-q:v', '4', `${OUT}/${output}`,
];

const general = 'Video general Rocodromo.mp4';
const jobs = [
  // Portada: 30–50 s del vídeo general (muros, muro RW del autobelay, gente escalando)
  encode(general, 'hero-1600.mp4', { from: 30, duration: 20, width: 1600, crf: 30 }),
  encode(general, 'hero-960.mp4', { from: 30, duration: 20, width: 960, crf: 29 }),
  poster(general, 'hero-poster.jpg', { at: 30.2, width: 1600 }),
  encode('Nuevo Bloque.mp4', 'nuevo-bloque.mp4', { from: 0, duration: 23, width: 540, crf: 27 }),
  poster('Nuevo Bloque.mp4', 'nuevo-bloque-poster.jpg', { at: 3, width: 540 }),
  encode('Video Tardeo.mp4', 'tardeo.mp4', { from: 0, duration: 9, width: 1280, crf: 28 }),
  poster('Video Tardeo.mp4', 'tardeo-poster.jpg', { at: 1, width: 1280 }),
  encode('Rock-And-Wall-AutoBelay_V2-2.mov', 'autobelay.mp4', { from: 4, duration: 8, width: 1280, crf: 28 }),
];

for (const args of jobs) {
  const out = args.at(-1);
  const { status } = spawnSync(ffmpeg, args, { stdio: 'inherit' });
  console.log(status === 0 ? `✓ ${out}` : `✗ ${out}`);
}
