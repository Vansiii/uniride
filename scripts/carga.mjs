// PB-06: pruebas de carga básicas, locales. Un solo comando desde la raíz: `node scripts/carga.mjs`.
// Corre `npm run test:carga` en backend (el arnés de los e2e: la API real, PostgreSQL local y la cadena simulada), toma las
// muestras en bruto, calcula p50, p95 y máximo, las compara con las metas de AGENTS.md §10 y escribe `informe.md`.
// Sale con error si el backend no responde (sin informe), si hay errores 5xx o si una meta no se cumple (CA-4: se informa
// «no cumple», nunca se cambia la meta). Opciones: --meta-busqueda-ms=2000 --meta-abordaje-ms=3000.
import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { arch, cpus, platform, tmpdir, totalmem } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = join(RAIZ, 'SPECS/features/sprint-4/PB-06-pruebas-carga');

/** Percentil por rango más cercano: el p95 de 1…100 es 95. */
export const percentil = (valores, p) => {
  const orden = [...valores].sort((a, b) => a - b);
  return orden[Math.max(0, Math.ceil((p / 100) * orden.length) - 1)];
};

export const resumen = (tiempos) => ({
  peticiones: tiempos.length,
  p50: percentil(tiempos, 50),
  p95: percentil(tiempos, 95),
  maximo: Math.max(...tiempos),
});

/** CA-1, CA-2, CA-4: cumple solo si el p95 está por debajo de la meta y no hubo errores 5xx. */
export const veredicto = (p95, metaMs, errores5xx) => (p95 < metaMs && errores5xx === 0 ? 'cumple' : 'no cumple');

/** CA-5: solo contra la base local; nunca contra la nube ni contra una cadena real. */
export const esLocal = (url) => {
  try {
    return ['localhost', '127.0.0.1', '::1', '[::1]'].includes(new URL(url).hostname);
  } catch {
    return false;
  }
};

const ms = (x) => `${Math.round(x)} ms`;

export function informeMarkdown({ meta, metas, busqueda, abordaje }) {
  const fila = (nombre, r, d, metaMs) =>
    `| ${nombre} | ${d.usuarios} | ${r.peticiones} | ${ms(r.p50)} | ${ms(r.p95)} | ${ms(r.maximo)} | ${d.errores5xx} | ${d.otrosErrores} | < ${metaMs} ms | **${veredicto(r.p95, metaMs, d.errores5xx)}** |`;
  const rb = resumen(busqueda.tiempos);
  const ra = resumen(abordaje.tiempos);
  return [
    '# PB-06 · Informe de pruebas de carga',
    '',
    `Fecha: ${meta.fecha}`,
    `Código: principal \`${meta.commits.principal}\` · backend \`${meta.commits.backend}\``,
    `Equipo: ${meta.equipo}`,
    `Node: ${meta.node}`,
    '',
    '| Prueba | Usuarios simultáneos | Peticiones | p50 | p95 | Máximo | Errores 5xx | Otros errores | Meta (p95) | Resultado |',
    '|---|---|---|---|---|---|---|---|---|---|',
    fila('Búsqueda de viajes', rb, busqueda, metas.busquedaMs),
    fila('Verificación de abordaje', ra, abordaje, metas.abordajeMs),
    '',
    '## Cómo se midió',
    '',
    `- **Búsqueda:** ${busqueda.usuarios} usuarios simultáneos durante ${Math.round(busqueda.duracionMs / 1000)} s sobre ${busqueda.viajesSembrados} viajes publicados en ${busqueda.organizaciones} organizaciones; cada petición busca en otra hora y algunas con destino. ${busqueda.sinResultados} de las ${rb.peticiones} respuestas salieron vacías (la hora o el destino no coincidía con un viaje): no son errores.`,
    `- **Abordaje:** ${abordaje.usuarios} usuarios simultáneos en ${abordaje.rondas} rondas (${ra.peticiones} abordajes); cada uno con su reserva confirmada y un código recién emitido (vive 30 s). Se mide el POST que valida en el servidor el desafío firmado, el GPS a ≤ 50 m y la integridad.`,
    '',
    '## Alcance y límites (RN-2, RN-3, RN-4)',
    '',
    '- Medición **local**: un solo equipo, PostgreSQL en Docker. La nube (AWS) puede variar.',
    '- El cliente de prueba y la API corren en el **mismo proceso**: el cliente consume parte de la CPU, así que las cifras son una cota pesimista del servidor.',
    '- Las firmas y los desafíos los genera el guion de pruebas, no un teléfono. La integridad del dispositivo usa la simulación de desarrollo (`MODO_EMULADOR_DEV`); Rekognition y la cadena son simulados. Sin servicios externos reales.',
    '- No se mide la red del teléfono, el mapa ni el panel web.',
    '',
    '## Cómo repetirla (CA-6)',
    '',
    '1. `docker compose up -d postgres hardhat` y `cd backend && npm ci && npx prisma migrate deploy`.',
    '2. Desde la raíz: `node scripts/carga.mjs`.',
    '3. Compara con esta tabla; las diferencias de unos cientos de ms entre equipos son normales.',
    '',
  ].join('\n');
}

function principal() {
  const arg = (nombre, defecto) =>
    Number(process.argv.find((a) => a.startsWith(`--${nombre}=`))?.split('=')[1] ?? defecto);
  const metas = { busquedaMs: arg('meta-busqueda-ms', 2000), abordajeMs: arg('meta-abordaje-ms', 3000) };
  try {
    process.loadEnvFile(join(RAIZ, '.env'));
  } catch {
    // las variables pueden venir del entorno
  }
  if (!esLocal(process.env.DATABASE_URL_MIGRACIONES ?? process.env.DATABASE_URL ?? '')) {
    console.error('PB-06 solo corre contra la base local (localhost o 127.0.0.1). No se mide nada.');
    return 2;
  }
  const crudo = join(tmpdir(), `carga-${process.pid}.json`);
  const corrida = spawnSync('npm', ['run', 'test:carga'], {
    cwd: join(RAIZ, 'backend'),
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, CARGA_SALIDA: crudo },
  });
  let datos;
  try {
    datos = JSON.parse(readFileSync(crudo, 'utf8'));
    rmSync(crudo);
  } catch {
    // sin muestras no hay informe (caso borde: el backend o la base no respondieron)
  }
  if (corrida.status !== 0 || !datos?.busqueda || !datos?.abordaje) {
    console.error('La prueba de carga no terminó (¿PostgreSQL local arriba y migrado?). No se escribe informe.');
    return 1;
  }
  const commit = (cwd) =>
    spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd, encoding: 'utf8' }).stdout.trim();
  const informe = informeMarkdown({
    meta: {
      fecha: new Date().toISOString(),
      commits: { principal: commit(RAIZ), backend: commit(join(RAIZ, 'backend')) },
      equipo: `${cpus()[0]?.model.trim()} · ${cpus().length} núcleos · ${Math.round(totalmem() / 2 ** 30)} GB · ${platform()} ${arch()}`,
      node: process.version,
    },
    metas,
    busqueda: datos.busqueda,
    abordaje: datos.abordaje,
  });
  writeFileSync(join(SALIDA, 'informe.md'), informe);
  console.log(informe);
  const cumple = [
    veredicto(resumen(datos.busqueda.tiempos).p95, metas.busquedaMs, datos.busqueda.errores5xx),
    veredicto(resumen(datos.abordaje.tiempos).p95, metas.abordajeMs, datos.abordaje.errores5xx),
  ].every((v) => v === 'cumple');
  return cumple ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(principal());
