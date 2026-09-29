/**
 * POST /api/chat — el asistente de la web.
 * Recibe la conversación y devuelve la respuesta en texto, poco a poco (streaming).
 * Sin ANTHROPIC_API_KEY responde con respuestas fijas (modo demo), así la web nunca se rompe.
 *
 * Variables de entorno:
 *   ANTHROPIC_API_KEY   clave de la API de Claude (sin ella: modo demo)
 *   CHAT_MODEL          modelo (por defecto Claude Haiku 4.5: rápido y barato para preguntas cortas)
 *   CHAT_DAILY_LIMIT    tope de mensajes al día para toda la web (por defecto 1500), para controlar el gasto
 */
import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { systemPrompt, respuestaSinIA } from '../../lib/chat-conocimiento';

export const prerender = false;

const MAX_TURNOS = 12; // mensajes de historial que se envían
const MAX_CHARS = 600; // largo máximo de cada mensaje del usuario
const POR_IP = 20; // mensajes por persona…
const VENTANA = 10 * 60_000; // …cada 10 minutos

const env = (k: string) => process.env[k] ?? import.meta.env[k];
const apiKey = env('ANTHROPIC_API_KEY');
const model = env('CHAT_MODEL') || 'claude-haiku-4-5-20251001';
const limiteDia = Number(env('CHAT_DAILY_LIMIT')) || 1500;
const client = apiKey ? new Anthropic({ apiKey }) : null;

/* ---------- Límites de uso (en memoria: se reinician si se reinicia el servidor) ---------- */
const porIp = new Map<string, number[]>();
let dia = '';
let usadosHoy = 0;

const dentroDeLimites = (ip: string) => {
  const hoy = new Date().toISOString().slice(0, 10);
  if (hoy !== dia) {
    dia = hoy;
    usadosHoy = 0;
    porIp.clear();
  }
  if (usadosHoy >= limiteDia) return false;
  const ahora = Date.now();
  const recientes = (porIp.get(ip) ?? []).filter((t) => ahora - t < VENTANA);
  if (recientes.length >= POR_IP) return false;
  recientes.push(ahora);
  porIp.set(ip, recientes);
  usadosHoy++;
  return true;
};

type Msg = { role: 'user' | 'assistant'; content: string };

const limpiar = (raw: unknown): Msg[] | null => {
  if (!Array.isArray(raw)) return null;
  const msgs = raw
    .filter((m): m is Msg => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, m.role === 'user' ? MAX_CHARS : 2000) }))
    .filter((m) => m.content)
    .slice(-MAX_TURNOS);
  // La API exige empezar por el usuario y terminar con una pregunta suya
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  return msgs.length && msgs.at(-1)!.role === 'user' ? msgs : null;
};

const texto = (body: string, status = 200, modo = 'ia') =>
  new Response(body, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Chat-Mode': modo },
  });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let msgs: Msg[] | null = null;
  try {
    msgs = limpiar((await request.json())?.messages);
  } catch {}
  if (!msgs) return texto('Mensaje no válido.', 400);

  const ip = request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() || clientAddress || 'desconocida';
  if (!dentroDeLimites(ip)) {
    return texto('Has hecho muchas preguntas seguidas. Espera unos minutos o escríbenos por WhatsApp.', 429);
  }

  if (!client) return texto(respuestaSinIA(msgs.at(-1)!.content), 200, 'demo');

  const stream = client.messages.stream({
    model,
    max_tokens: 500,
    system: systemPrompt(),
    messages: msgs,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let enviado = false;
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
            enviado = true;
          }
        }
      } catch (err) {
        console.error('[chat]', err);
        // Si la API falla antes de empezar (clave mal puesta, sin saldo…), mejor una respuesta fija que nada
        const aviso = enviado
          ? '\n\nPerdona, se ha cortado la respuesta. Prueba otra vez o escríbenos por WhatsApp.'
          : respuestaSinIA(msgs!.at(-1)!.content);
        controller.enqueue(encoder.encode(aviso));
      }
      controller.close();
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
      'X-Chat-Mode': 'ia',
    },
  });
};
