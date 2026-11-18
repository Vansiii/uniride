// PB-05: suite consolidada de ataques. Un solo comando desde la raíz: `node scripts/suite-ataques.mjs`.
// Corre las pruebas de backend (unitarias y e2e), contratos y app; junta las que nombran una amenaza A-xx
// (archivo `a-xx-*` o título con `A-xx`, RN-6) y escribe el informe. Sale con error si una amenaza queda sin prueba,
// si una prueba de amenaza falla o si un paso no corrió (CA-5). Nunca reintenta pruebas (RN-5).
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = join(RAIZ, 'SPECS/features/sprint-4/PB-05-suite-ataques');
const ANSI = /\u001b\[[0-9;]*m/g;

/** RN-6: una prueba cuenta para `A-xx` si su archivo empieza con `a-xx-` o su título completo contiene `A-xx`. */
export function pertenece(id, archivo, titulo) {
  const base = basename(archivo ?? '').toLowerCase();
  return base.startsWith(`${id.toLowerCase()}-`) || new RegExp(`\\b${id}(?!\\d)`).test(titulo);
}

/** Resultados de vitest o jest (`--json`): una fila por prueba. */
export function pruebasDeJson(json, origen) {
  return json.testResults.flatMap((archivo) =>
    archivo.assertionResults.map((r) => ({
      origen,
      archivo: archivo.name.replaceAll('\\', '/').split('/').slice(-2).join('/'),
      titulo: r.fullName ?? [...r.ancestorTitles, r.title].join(' '),
      paso: r.status === 'passed',
      omitida: r.status !== 'passed' && r.status !== 'failed',
    })),
  );
}

/** Salida legible de Hardhat (mocha, spec): `✔ título` por cada prueba que pasa. */
export function pruebasDeMocha(salida, origen) {
  const limpia = salida.replace(ANSI, '');
  const pasan = [...limpia.matchAll(/^\s*[✔✓]\s+(.+?)(?:\s+\(\d+ms\))?$/gmu)].map((m) => m[1]);
  const fallan = [...limpia.matchAll(/^\s*\d+\)\s+(.+)$/gm)].map((m) => m[1]);
  return [
    ...pasan.map((titulo) => ({ origen, archivo: 'test/EscrowUniRide.ts', titulo, paso: true })),
    ...fallan.map((titulo) => ({ origen, archivo: 'test/EscrowUniRide.ts', titulo, paso: false })),
  ];
}

/**
 * Informe por amenaza (CA-4). `pasos` es lo que corrió: `{ nombre, ok }`; `manuales`, las filas del teléfono (CA-8).
 * Una prueba omitida (skip/only) no cuenta como cobertura (RN-5).
 */
export function construirInforme({ amenazas, pruebas, pasos, manuales, meta }) {
  const filas = amenazas.map((a) => {
    const propias = pruebas.filter((p) => pertenece(a.id, p.archivo, p.titulo));
    const validas = propias.filter((p) => !p.omitida);
    const falla = validas.some((p) => !p.paso);
    const resultado = falla ? 'falló' : validas.some((p) => p.paso) ? 'bloqueado' : 'sin prueba';
    const manual = manuales.filter((m) => m.amenaza === a.id);
    return {
      ...a,
      resultado,
      pruebas: validas.map((p) => `${p.archivo} › ${p.titulo}`),
      omitidas: propias.length - validas.length,
      manual: manual.map((m) => ({
        prueba: m.prueba,
        fecha: m.fecha,
        telefono: m.telefono,
        persona: m.persona,
        resultado: m.resultado ?? 'pendiente',
      })),
    };
  });
  const bloqueadas = filas.filter((f) => f.resultado === 'bloqueado').length;
  const pasosFallidos = pasos.filter((p) => !p.ok).map((p) => p.nombre);
  return {
    meta,
    pasos,
    total: filas.length,
    bloqueadas,
    ok: bloqueadas === filas.length && pasosFallidos.length === 0,
    pasosFallidos,
    filas,
  };
}

export function informeMarkdown(i) {
  const l = [
    '# PB-05 · Informe de la suite de ataques',
    '',
    `Fecha: ${i.meta.fecha}`,
    `Commits: ${Object.entries(i.meta.commits)
      .map(([k, v]) => `${k} \`${v}\``)
      .join(' · ')}`,
    '',
    `**${i.bloqueadas} de ${i.total} amenazas bloqueadas.**${i.pasosFallidos.length ? ` Pasos que no corrieron o fallaron: ${i.pasosFallidos.join(', ')}.` : ''}`,
    '',
    '| Id | Ataque | Contramedida | Capa | Historia | Pruebas | Resultado |',
    '|---|---|---|---|---|---|---|',
  ];
  for (const f of i.filas) {
    const nota = f.nota ? ` (${f.nota})` : '';
    l.push(
      `| ${f.id} | ${f.ataque} | ${f.contramedida} | ${f.capa} | ${f.historia} | ${f.pruebas.length} | **${f.resultado}**${nota} |`,
    );
  }
  l.push('', '## Pruebas por amenaza', '');
  for (const f of i.filas) {
    l.push(`### ${f.id} · ${f.ataque}`, '');
    if (f.omitidas) l.push(`- ⚠ ${f.omitidas} prueba(s) omitida(s): no cuentan.`);
    for (const p of f.pruebas) l.push(`- ${p}`);
    if (!f.pruebas.length) l.push('- _sin prueba_');
    for (const m of f.manual)
      l.push(
        `- Manual (teléfono): ${m.prueba} — ${m.resultado}${m.fecha ? `, ${m.fecha}, ${m.telefono}, ${m.persona}` : ''}`,
      );
    l.push('');
  }
  return l.join('\n');
}

function ejecutar(nombre, orden, args, cwd, extra = {}) {
  console.log(`\n== ${nombre}`);
  const r = spawnSync(orden, args, { cwd, shell: true, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, ...extra });
  return { r, ok: r.status === 0 };
}

const git = (carpeta) =>
  spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: join(RAIZ, carpeta), encoding: 'utf8' }).stdout.trim() ||
  'desconocido';

function principal() {
  const tmp = join(tmpdir(), `suite-ataques-${Date.now()}`);
  mkdirSync(tmp, { recursive: true });
  const pasos = [];
  let pruebas = [];
  const paso = (nombre, ok) => pasos.push({ nombre, ok });
  const leer = (archivo, origen) => {
    try {
      pruebas = pruebas.concat(pruebasDeJson(JSON.parse(readFileSync(archivo, 'utf8')), origen));
      return true;
    } catch {
      return false; // el paso no produjo resultados: cuenta como que no corrió (CA-5)
    }
  };

  const back = join(RAIZ, 'backend');
  paso('backend: migraciones', ejecutar('backend: prisma migrate deploy', 'npx', ['prisma', 'migrate', 'deploy'], back).ok);
  const unit = join(tmp, 'backend-unit.json');
  ejecutar('backend: unitarias', 'npx', ['vitest', 'run', '--reporter=json', `--outputFile=${unit}`], back);
  paso('backend: unitarias', leer(unit, 'backend'));
  const e2e = join(tmp, 'backend-e2e.json');
  ejecutar('backend: e2e', 'npx', ['vitest', 'run', '--config', 'vitest.config.e2e.ts', '--reporter=json', `--outputFile=${e2e}`], back);
  paso('backend: e2e', leer(e2e, 'backend'));

  const hh = ejecutar('contratos: hardhat test', 'npx', ['hardhat', 'test'], join(RAIZ, 'contracts'));
  const delContrato = pruebasDeMocha(`${hh.r.stdout ?? ''}`, 'contracts');
  pruebas = pruebas.concat(delContrato);
  paso('contratos', hh.ok && delContrato.length > 0);

  const app = join(tmp, 'mobile.json');
  ejecutar('app: jest', 'npx', ['jest', '--json', `--outputFile=${app}`], join(RAIZ, 'mobile'));
  paso('app', leer(app, 'mobile'));

  const manuales = JSON.parse(readFileSync(join(SALIDA, 'manual.json'), 'utf8'));
  const amenazas = JSON.parse(readFileSync(join(RAIZ, 'scripts/amenazas.json'), 'utf8'));
  const informe = construirInforme({
    amenazas,
    pruebas,
    pasos,
    manuales,
    meta: {
      fecha: new Date().toISOString(),
      commits: { principal: git('.'), backend: git('backend'), contracts: git('contracts'), mobile: git('mobile') },
    },
  });
  writeFileSync(join(SALIDA, 'informe.json'), JSON.stringify(informe, null, 2));
  writeFileSync(join(SALIDA, 'informe.md'), informeMarkdown(informe));
  console.log(`\n${informe.bloqueadas} de ${informe.total} amenazas bloqueadas · informe en ${SALIDA}`);
  process.exit(informe.ok ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) principal();
