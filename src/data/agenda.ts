/**
 * Agenda de EJEMPLO para la demo: cursos, actividades y eventos inventados para enseñar cómo quedaría.
 * Para usarla de verdad, sustituir por los datos reales o leerlos de un calendario (Google Calendar, Notion…).
 */
export const agendaEsEjemplo = true;

export type Tipo = 'curso' | 'actividad' | 'evento';

export const tipos: Record<Tipo, { label: string; color: string }> = {
  curso: { label: 'Cursos', color: '#1a6cbd' },
  actividad: { label: 'Actividades', color: '#e0651a' },
  evento: { label: 'Eventos', color: '#d62f5b' },
};

/** Se repiten cada semana. dias: 0 = domingo … 6 = sábado. */
export interface Recurrente {
  t: string;
  tipo: Tipo;
  dias: number[];
  hora: string;
}

export const recurrentes: Recurrente[] = [
  { t: 'Técnica de bloque', tipo: 'curso', dias: [1], hora: '19:30 – 21:00' },
  { t: 'Escuela infantil', tipo: 'curso', dias: [2, 4], hora: '17:30 – 18:30' },
  { t: 'Entreno en Moon y Kilter', tipo: 'actividad', dias: [3], hora: '20:00 – 21:30' },
  { t: 'Tardeo en la terraza', tipo: 'actividad', dias: [5], hora: 'Desde las 19:00' },
  { t: 'Iniciación a la escalada', tipo: 'curso', dias: [6], hora: '10:30 – 12:30' },
];

export interface Evento {
  fecha: string;
  t: string;
  tipo: Tipo;
  hora: string;
  desc: string;
  /** Aparece en el tablón de grandes eventos */
  destacado?: boolean;
  foto?: 'bloque' | 'desplome' | 'vias' | 'autobelay';
}

export const eventos: Evento[] = [
  { fecha: '2026-10-10', t: 'Taller de nudos y aseguramiento', tipo: 'curso', hora: '11:00 – 13:00', desc: 'Aprende a encordarte y a asegurar con garantías.' },
  { fecha: '2026-10-17', t: 'Liga interna de bloque · Jornada 1', tipo: 'evento', hora: '17:00', desc: 'Bloques nuevos y puntuación por encadenes. Para todos los niveles.', destacado: true, foto: 'bloque' },
  { fecha: '2026-10-31', t: 'Escalada de Halloween', tipo: 'actividad', hora: '18:00', desc: 'Bloques temáticos y premio al mejor disfraz.' },
  { fecha: '2026-11-14', t: 'Open de bloque Rock & Wall', tipo: 'evento', hora: '10:00', desc: 'Competición abierta con categorías por edad y final por la tarde.', destacado: true, foto: 'desplome' },
  { fecha: '2026-11-21', t: 'Liga interna de bloque · Jornada 2', tipo: 'evento', hora: '17:00', desc: 'Segunda jornada de la liga con bloques nuevos.' },
  { fecha: '2026-12-05', t: 'Maratón de vías', tipo: 'evento', hora: '09:30', desc: 'Por parejas: encadena todas las vías que puedas en un día.', destacado: true, foto: 'vias' },
  { fecha: '2026-12-19', t: 'Fiesta de Navidad', tipo: 'actividad', hora: '19:00', desc: 'Última sesión del año con tardeo largo.' },
  { fecha: '2027-01-23', t: 'Contest de autobelay', tipo: 'evento', hora: '11:00', desc: 'Velocidad y resistencia en el muro del autobelay.', destacado: true, foto: 'autobelay' },
];
