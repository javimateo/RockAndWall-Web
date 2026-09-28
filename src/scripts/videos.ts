// Vídeos sin coste inicial: solo se descargan cerca de la pantalla y se pausan al salir.
// El de portada espera a que la página haya cargado; mientras tanto se ve su imagen.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const start = (v: HTMLVideoElement) => {
  if (!v.src) {
    const small = v.dataset.srcSm && matchMedia('(max-width: 760px)').matches;
    v.src = (small ? v.dataset.srcSm : v.dataset.src) ?? '';
  }
  v.play().catch(() => {});
};

const videos = [...document.querySelectorAll<HTMLVideoElement>('video[data-src]')];
for (const v of videos) {
  v.addEventListener('playing', () => v.classList.add('is-playing'), { once: true });
}

if (!reduced) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) {
          if (v.dataset.poster && !v.poster) v.poster = v.dataset.poster;
          start(v);
        } else if (v.src) {
          v.pause();
        }
      }
    },
    { rootMargin: '300px 0px' }
  );

  const observe = (list: HTMLVideoElement[]) => list.forEach((v) => io.observe(v));
  observe(videos.filter((v) => !('hero' in v.dataset)));

  const hero = videos.filter((v) => 'hero' in v.dataset);
  const later = () => ('requestIdleCallback' in window ? requestIdleCallback(() => observe(hero)) : setTimeout(() => observe(hero), 200));
  if (document.readyState === 'complete') later();
  else addEventListener('load', later, { once: true });
} else {
  for (const v of videos) if (v.dataset.poster) v.poster = v.dataset.poster;
}
