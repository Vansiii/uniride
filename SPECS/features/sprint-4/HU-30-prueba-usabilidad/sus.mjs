// HU-30 RN-4: puntaje SUS de cada persona y promedio, desde `respuestas.json`.
// Uso: node SPECS/features/sprint-4/HU-30-prueba-usabilidad/sus.mjs
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/** (Σ(impares − 1) + Σ(5 − pares)) × 2,5. `respuestas` son 10 enteros de 1 a 5, en el orden del cuestionario. */
export function puntajeSus(respuestas) {
  if (!Array.isArray(respuestas) || respuestas.length !== 10 || !respuestas.every((r) => Number.isInteger(r) && r >= 1 && r <= 5))
    throw new Error('Cuestionario incompleto o inválido: no se calcula a medias (HU-30 §4)');
  const suma = respuestas.reduce((s, r, i) => s + (i % 2 === 0 ? r - 1 : 5 - r), 0);
  return suma * 2.5;
}

/** CA-4: promedio de las personas; la meta es 75 o más. Se informa tal cual, sin descartar a nadie (CA-9). */
export function resumenSus(participantes) {
  const puntajes = participantes.map((p) => ({ id: p.id, sus: puntajeSus(p.sus) }));
  const promedio = puntajes.reduce((s, p) => s + p.sus, 0) / puntajes.length;
  return { puntajes, promedio, cumple: promedio >= 75 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const archivo = join(dirname(fileURLToPath(import.meta.url)), 'respuestas.json');
  const { participantes } = JSON.parse(readFileSync(archivo, 'utf8'));
  const r = resumenSus(participantes);
  for (const p of r.puntajes) console.log(`${p.id}: ${p.sus}`);
  console.log(`Promedio: ${r.promedio.toFixed(1)} → ${r.cumple ? 'cumple (≥ 75)' : 'no cumple (< 75)'}`);
}
