# Rock & Wall · web (demo)

Rediseño de [rockandwallclimbing.com](https://www.rockandwallclimbing.com/) con Astro.
La idea: cada elemento visual sale de algo que existe en la sala (rejilla de tornillos, presas,
cinta de salida, bandas azules, LEDs de la Kilter, colchoneta) y las fotos reales son las protagonistas.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:4321 (home) y /lab (sistema visual)
npm run build
```

## Versiones del home

Un selector flotante abajo permite saltar entre ellas.

| Ruta | Estilo |
|---|---|
| `/` | Base: la página es una pared con vías de fondo, presas como botones y cinta de rotulador |
| `/pro` | Profesional: fondos lisos en tinta y blanco, azul RW como único acento, fotos grandes |
| `/clasica` | Clásica, en la línea de Arkose y Sputnik: vídeo a pantalla completa, bloques foto/texto y tarjetas |
| `/mixta` | Mezcla de las dos, con la banda azul, la beta y los grados de las tarifas como firma de Rock & Wall |

## Estructura

| Ruta | Qué es |
|---|---|
| `src/pages/index.astro` | Home: la página entera es una pared, con el texto en una columna limpia |
| `src/components/ViasFondo.astro` | Vías de fondo en los márgenes (volúmenes, macros, regletas, pinzas). SVG estático generado al compilar |
| `src/scripts/videos.ts` | Vídeos diferidos: se cargan cerca de la pantalla y se pausan al salir |
| `src/pages/lab.astro` | «Del muro a la web»: sistema visual con todos los componentes |
| `src/components/Presa.astro` | Botón con forma de presa (magnesio al pasar, se hunde al pulsar) |
| `src/components/Cinta.astro` | Etiqueta de cinta escrita a rotulador |
| `src/components/Beta.astro` | Foto con presas marcadas y secuencia dibujada |
| `src/components/LedBoard.astro` | Tabla Moon/Kilter que se ilumina (interactiva) |
| `src/components/FichaVia.astro` | Tarifa como ficha de vía atornillada |
| `src/components/Colchoneta.astro` | Pie de página acolchado |
| `src/components/Autobelay.astro` | Indicador de scroll con forma de autoasegurador |
| `src/data/rw.ts` | Precios, horario y enlaces (de la web actual, verano 2026) |
| `src/styles/tokens.css` | Colores, tipografías y texturas |

## Recursos

- **Fotos**: `src/assets/img`. Astro genera AVIF/WebP en varios tamaños al compilar.
- **Vídeos**: `npm run videos` recorta y comprime los originales de `../Video` en `public/video`.
- **Logo**: `src/assets/brand/*.svg`, vectorizado desde el final del vídeo oficial con
  `scripts/trace-logo.mjs`. Si el rocódromo tiene el vector original, sustituir estos dos ficheros.

## Pendiente de confirmar con Rock & Wall

- Orden real de colores de los circuitos de bloque (`circuitos` en `src/data/rw.ts`).
- Si el bono mensual es de verdad «la más repetida».
