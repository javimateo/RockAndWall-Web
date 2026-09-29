/**
 * Lo que sabe el asistente del chat. Sale de los mismos datos que la web (src/data/rw.ts),
 * así que si cambia un precio en la web, el chat lo sabe sin tocar nada más.
 */
import { info, tarifas, circuitos, misterioso } from '../data/rw';

const precios = tarifas
  .map((t) => {
    const unidad = 'unit' in t && t.unit ? ` ${t.unit}` : '';
    const nota = 'note' in t && t.note ? ` ${t.note}` : '';
    return `- ${t.name}: ${t.price} €${unidad}. ${t.desc} Incluye: ${t.items.join('; ')}.${nota}`;
  })
  .join('\n');

const fichas = `
# Rock & Wall Climbing (Sevilla)
Rocódromo de escalada en ${info.direccion}. Varias zonas con vías y bloques bajo el mismo techo.
- Más de 500 m² de bloque y más de 80 vías con cuerda, también con autobelay (se asegura solo).
- Dos tablas de entrenamiento: Moon Board y Kilter Board.
- Zona de gimnasio y entrenamiento.
- Barra y terraza para el "tardeo" después de escalar.
- Cada semana se cambian varios bloques y vías; las novedades se anuncian en Instagram.

## Horario
${info.horario.map((h) => `- ${h}`).join('\n')}
Festivos o cierres puntuales: se avisan en Instagram (${info.instagram}).

## Tarifas (verano 2026)
${precios}
- Alquiler de material: pies de gato 3 € y arnés 3 €.
- Tabla completa de tarifas: ${info.tarifas}

## Primera visita
1. Regístrate online antes de venir: ${info.registro}
2. Reserva día y hora: ${info.reservar}
3. Ven con ropa cómoda. Pies de gato y arnés se alquilan en la sala (3 € cada uno).
No hace falta experiencia: el bloque tiene circuitos para todos los niveles.

## Niveles del bloque (circuitos por colores)
De más fácil a más difícil: ${circuitos.map((c) => c.label.toLowerCase()).join(', ')}.
Los bloques blancos son "nivel misterioso": no tienen nivel asignado, lo decides tú al escalarlos.
Las vías de cuerda usan grados franceses (5a, 6a, 6b…).

## Cursos y grupos
Clases de escalada con monitor (técnica y seguridad), cursos y salidas para colegios e institutos, y escuela infantil.
Horarios y precios de los cursos: se preguntan por WhatsApp (${info.whatsapp}).

## Contacto y enlaces
- Reservar: ${info.reservar}
- Tarjeta regalo: ${info.regalo}
- WhatsApp: ${info.whatsapp}
- Instagram: ${info.instagram}
- Cómo llegar (mapa): ${info.mapa}
`.trim();

/** Fecha de hoy en Sevilla, para preguntas como "¿abrís hoy?" */
const hoy = () =>
  new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date());

export const systemPrompt = () =>
  `
Eres el asistente de la web de Rock & Wall Climbing, un rocódromo en Sevilla. Respondes dudas de clientes y de gente que quiere probar la escalada.

Cómo responder:
- En el idioma en que te escriban (normalmente español). Tono cercano y directo, como el personal de recepción.
- Breve: 1 a 4 frases, o una lista corta si hay varios datos. Sin saludos largos ni despedidas.
- Usa solo la información de abajo. Si algo no está (por ejemplo horarios de cursos, eventos concretos, festivos, disponibilidad de un día), dilo con naturalidad y ofrece el WhatsApp o Instagram. Nunca inventes precios, horarios, nombres ni fechas.
- No puedes hacer reservas ni pagos: da el enlace de reserva. No pidas datos personales.
- Enlaces en formato markdown: [texto](url). Puedes usar **negrita** para precios u horas.
- Si preguntan algo que no tiene nada que ver con el rocódromo o la escalada, reconduce amablemente.

Ahora mismo en Sevilla es: ${hoy()}.

${fichas}
`.trim();

/* ---------- Respuestas sin IA (cuando no hay clave de API configurada) ----------
 * Respuestas fijas por palabras clave: si cambian los precios u horarios, hay que revisarlas a mano. */

const normal = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

const faq: { keys: RegExp; answer: string }[] = [
  {
    keys: /precio|cuesta|cuanto|tarifa|bono|entrada|pagar|mensual|anual/,
    answer: `El **pase de día** cuesta 10 € (8 € menores de 18). Hay **bono de 10 sesiones** por 75 €, **mensual** por 50 € (40 € solo de lunes a viernes) y **anual** por 450 €. Los bonos llevan 5 € de tarjeta al empezar. [Ver todas las tarifas](${info.tarifas})`,
  },
  {
    keys: /horario|hora|abr|cierr|abierto|domingo|sabado|finde/,
    answer: `Abrimos **${info.horario[0].toLowerCase()}** y **${info.horario[1].toLowerCase()}**. Los festivos y cierres puntuales se avisan en [Instagram](${info.instagram}).`,
  },
  {
    keys: /primera|empezar|nunca|principiante|probar|novato|experiencia/,
    answer: `Para tu primer día: 1) [regístrate online](${info.registro}), 2) [reserva día y hora](${info.reservar}) y 3) ven con ropa cómoda. No hace falta experiencia: hay bloques para todos los niveles.`,
  },
  {
    keys: /alquil|pies de gato|gato|arnes|material|zapatill|magnesio/,
    answer: 'Sí, en la sala se alquilan **pies de gato por 3 €** y **arnés por 3 €**. Solo tienes que traer ropa cómoda.',
  },
  {
    keys: /donde|direccion|llegar|ubicacion|mapa|aparcar|parking/,
    answer: `Estamos en **${info.direccion}**. [Ver en el mapa](${info.mapa})`,
  },
  {
    keys: /curso|clase|monitor|nino|nina|infantil|colegio|instituto|escuela|aprender/,
    answer: `Hay clases de escalada con monitor, cursos para colegios e institutos y escuela infantil. Para horarios y precios, escríbenos por [WhatsApp](${info.whatsapp}).`,
  },
  {
    keys: /color|nivel|grado|circuito|dificil|facil|blanco/,
    answer:
      'Los bloques van por colores, de más fácil a más difícil: verde, azul, amarillo, naranja, rosa, rojo y negro. Los **blancos** son "nivel misterioso": sin nivel, lo decides tú. Las vías usan grado francés (5a, 6a, 6b…).',
  },
  {
    keys: /reserv|cita|turno/,
    answer: `Puedes reservar día y hora aquí: [Reservar](${info.reservar}). Si es tu primera vez, antes haz el [registro online](${info.registro}).`,
  },
  {
    keys: /regalo|regalar|tarjeta regalo/,
    answer: `Hay tarjeta regalo: [cómprala aquí](${info.regalo}).`,
  },
  {
    keys: /moon|kilter|tabla|entrenar|gimnasio|fuerza/,
    answer: 'Tenemos **Moon Board** y **Kilter Board** para entrenar, además de zona de gimnasio.',
  },
];

export const respuestaSinIA = (pregunta: string) => {
  const q = normal(pregunta);
  const hit = faq.find((f) => f.keys.test(q));
  return (
    hit?.answer ??
    `Puedo ayudarte con precios, horarios, tu primera visita, alquiler de material, niveles o cursos. Para cualquier otra cosa, escríbenos por [WhatsApp](${info.whatsapp}).`
  );
};
