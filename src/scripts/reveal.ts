// Marca con .is-in los elementos [data-reveal] cuando entran en pantalla (una sola vez).
const els = document.querySelectorAll<HTMLElement>('[data-reveal]');

if (!('IntersectionObserver' in window)) {
  els.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -18% 0px', threshold: 0.15 }
  );
  els.forEach((el) => io.observe(el));
}
