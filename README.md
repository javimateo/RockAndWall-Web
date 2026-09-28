# Rock & Wall · web (demo)

Rediseño de [rockandwallclimbing.com](https://www.rockandwallclimbing.com/) con Astro.
La idea: cada elemento visual sale de algo que existe en la sala (rejilla de tornillos, presas,
cinta de salida, bandas azules, LEDs de la Kilter, colchoneta) y las fotos reales son las protagonistas.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:4321/lab
npm run build
```

## Estructura

| Ruta | Qué es |
|---|---|
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
