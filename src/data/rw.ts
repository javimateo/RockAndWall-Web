/**
 * Contenido de Rock & Wall.
 * Precios, horario y datos tomados de rockandwallclimbing.com (tarifas verano 2026).
 * Lo marcado como PROVISIONAL hay que confirmarlo con el rocódromo.
 */

export const info = {
  reservar: 'https://rockandwallclimbing.simplybook.it/v2/#book',
  regalo: 'https://rockandwallclimbing.simplybook.it/v2/#gift-card',
  tarifas: 'https://www.rockandwallclimbing.com/tarifas-y-horarios/',
  registro: 'https://www.rockandwallclimbing.com/registrorw/',
  horario: ['Lunes a viernes · 9:30 – 22:00', 'Sábados y domingos · 9:30 – 18:00'],
  direccion: 'Calle Labrador 8, Sevilla',
  mapa: 'https://www.google.com/maps/search/?api=1&query=Rock%20%26%20Wall%20Climbing%20Sevilla',
  instagram: 'https://www.instagram.com/rockandwallclimbing',
  facebook: 'https://www.facebook.com/rockandwallclimbing',
  whatsapp: 'https://wa.me/message/7ZFD6GW3YPDOG1',
};

/** PROVISIONAL: orden real de colores de los circuitos de bloque. */
export const circuitos = [
  { color: 'green', label: 'Muy fácil' },
  { color: 'yellow', label: 'Fácil' },
  { color: 'blue', label: 'Medio' },
  { color: 'orange', label: 'Difícil' },
  { color: 'red', label: 'Muy difícil' },
  { color: 'black', label: 'Nivel galáctico' },
] as const;

const tarjeta = 'Los bonos llevan 5 € de suplemento por la tarjeta al empezar.';

export const tarifas = [
  {
    n: '01',
    grade: 'IV+',
    color: 'white',
    name: 'Pase de día',
    price: '10',
    unit: '/ día',
    desc: 'Para probar la pared o escalar un día suelto.',
    items: ['Acceso libre a bloque y vías', 'Menores de 18: 8 €', 'Pies de gato y arnés: 3 € cada uno'],
    cta: { href: info.reservar, label: 'Reservar' },
    rot: -0.8,
  },
  {
    n: '02',
    grade: '6a',
    color: 'green',
    name: 'Bono 10 sesiones',
    price: '75',
    desc: 'Diez entradas para cuando te venga bien, sin prisa.',
    items: ['10 entradas de acceso libre', 'Sale a 7,50 € la sesión', 'Personal e intransferible'],
    note: tarjeta,
    cta: { href: info.tarifas, label: 'Lo quiero' },
    rot: 0.6,
  },
  {
    n: '03',
    grade: '7a',
    color: 'orange',
    name: 'Bono mensual',
    price: '50',
    unit: '/ mes',
    desc: 'Para quien viene a por su proyecto varias veces por semana.',
    items: ['Acceso libre todos los días', 'Solo de lunes a viernes: 40 €', 'Menores de 18: 45 €'],
    note: tarjeta,
    featured: true,
    badge: 'La más repetida', // PROVISIONAL: confirmar que es el bono más vendido
    cta: { href: info.tarifas, label: 'Empezar mi proyecto' },
    rot: -0.4,
  },
  {
    n: '04',
    grade: '8a',
    color: 'black',
    name: 'Bono anual',
    price: '450',
    unit: '/ año',
    desc: 'Un año entero de pared. El proyecto largo.',
    items: ['Acceso libre todo el año', 'Sale a 37,50 € al mes', 'Trimestral 135 € · Semestral 250 €'],
    note: tarjeta,
    cta: { href: info.tarifas, label: 'A por el 8a' },
    rot: 0.9,
  },
] as const;

/** Problemas de ejemplo para la tabla de LEDs (no son problemas reales de la Kilter). */
export const problems = [
  {
    name: 'Triana',
    grade: '6B+',
    holds: { start: ['D5', 'F6'], foot: ['C2', 'G3'], hand: ['E9', 'G11', 'E13', 'G15'], top: ['F18'] },
  },
  {
    name: 'La Giralda',
    grade: '7A',
    holds: { start: ['B6'], foot: ['A3', 'D4'], hand: ['D8', 'C11', 'F12', 'H14', 'G16'], top: ['J18'] },
  },
  {
    name: 'Calle Labrador',
    grade: '6C',
    holds: { start: ['H5', 'J6'], foot: ['I2', 'G4'], hand: ['H9', 'F10', 'G13', 'D15'], top: ['E18'] },
  },
];
