/**
 * Vías y bloques montados ahora mismo, de EJEMPLO para la demo (generados, no son los reales).
 * En producción saldrían de una hoja de cálculo que rellenan los equipadores o de un servicio
 * como Vertical-Life, que es el que usa Sharma Climbing.
 * `dias` = hace cuántos días se montó; la página calcula la fecha a partir de hoy.
 */
import { rng } from '../lib/draw';
import { circuitos, misterioso } from './rw';

export const paredEsEjemplo = true;

export interface Linea {
  tipo: 'via' | 'bloque';
  n: string;
  color: string;
  colorLabel: string;
  grado: string;
  zona: string;
  equipador: string;
  dias: number;
  encadenes: number;
}

const equipadores = ['Ana', 'Dani', 'Marta', 'Pablo', 'Lucía', 'Sergio'];
const zonasVias = ['Muro del autobelay', 'Zona de vías', 'Desplome grande'];
const zonasBloque = ['Desplomes', 'Muro de colores', 'Placa', 'Volúmenes', 'Cueva'];
const gradosVia = ['5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', '7b+', '7c', '8a'];
/** Cuántas vías hay de cada grado (más en la zona media, como en cualquier rocódromo) */
const pesoVia = [3, 4, 5, 7, 7, 8, 7, 6, 5, 5, 4, 3, 2, 2, 1];
const coloresCinta = [
  ['green', 'Verde'],
  ['blue', 'Azul'],
  ['yellow', 'Amarillo'],
  ['orange', 'Naranja'],
  ['pink', 'Rosa'],
  ['red', 'Rojo'],
  ['black', 'Negro'],
  ['white', 'Blanco'],
  ['purple', 'Morado'],
] as const;
const bloques = [...circuitos, misterioso];
const pesoBloque = [16, 18, 17, 14, 11, 8, 5, 6];

const rand = rng(2026);
const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)];

/** Cada semana se renueva una zona: los días reparten las líneas en tandas semanales */
const tanda = (i: number, zonas: string[]) => {
  const semana = i % 6;
  return { zona: zonas[semana % zonas.length], dias: 1 + semana * 7 + Math.floor(rand() * 3) };
};

const vias: Linea[] = [];
gradosVia.forEach((grado, g) => {
  for (let k = 0; k < pesoVia[g]; k++) {
    const { zona, dias } = tanda(vias.length, zonasVias);
    const [color, colorLabel] = pick(coloresCinta);
    vias.push({
      tipo: 'via',
      n: '',
      color,
      colorLabel,
      grado,
      zona,
      equipador: pick(equipadores),
      dias,
      encadenes: Math.max(0, Math.round((14 - g) * rand() * 2.2 * Math.min(1, dias / 10))),
    });
  }
});

const bloquesList: Linea[] = [];
bloques.forEach((b, i) => {
  for (let k = 0; k < pesoBloque[i]; k++) {
    const { zona, dias } = tanda(bloquesList.length + 3, zonasBloque);
    bloquesList.push({
      tipo: 'bloque',
      n: '',
      color: b.color,
      colorLabel: b.label,
      grado: b.label,
      zona,
      equipador: pick(equipadores),
      dias,
      encadenes: Math.max(0, Math.round((9 - i) * rand() * 3 * Math.min(1, dias / 10))),
    });
  }
});

/** Numeración por zona, como en las plaquitas de la sala: 12.1, 12.2… */
const numerar = (list: Linea[]) => {
  const porZona = new Map<string, number>();
  list
    .sort((a, b) => a.zona.localeCompare(b.zona) || a.dias - b.dias)
    .forEach((l) => {
      const k = (porZona.get(l.zona) ?? 0) + 1;
      porZona.set(l.zona, k);
      l.n = `${Math.ceil(k / 2)}.${((k - 1) % 2) + 1}`;
    });
  return list.sort((a, b) => a.dias - b.dias);
};

export const lineas = [...numerar(vias), ...numerar(bloquesList)];
export const ordenGrados = gradosVia;
export const ordenColores = bloques.map((b) => b.label);
