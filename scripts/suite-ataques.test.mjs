import assert from 'node:assert/strict';
import { test } from 'node:test';
import { construirInforme, informeMarkdown, pertenece, pruebasDeMocha } from './suite-ataques.mjs';

const amenazas = [
  { id: 'A-01', ataque: 'x', contramedida: 'y', capa: 'c', historia: 'HU-08' },
  { id: 'A-10', ataque: 'x', contramedida: 'y', capa: 'c', historia: 'HU-25' },
];
const meta = { fecha: '2026-11-17', commits: { principal: 'abc' } };
const ok = (archivo, titulo) => ({ archivo, titulo, paso: true });

test('RN-6: pertenece por archivo a-xx- o por título, sin confundir A-1 con A-10', () => {
  assert.equal(pertenece('A-10', 'test/ataques/a-10-colusion.e2e-spec.ts', 'cualquiera'), true);
  assert.equal(pertenece('A-01', 'a-10-colusion.e2e-spec.ts', 'sin id'), false);
  assert.equal(pertenece('A-01', 'identidad/verificacion.e2e-spec.ts', 'ataque A-01: foto'), true);
  assert.equal(pertenece('A-01', 'x.ts', 'ataque A-10: otra'), false);
});

test('CA-4: una fila por amenaza y el total «n de m»', () => {
  const i = construirInforme({
    amenazas,
    pruebas: [ok('a-01-x.ts', 't'), ok('a-10-y.ts', 't')],
    pasos: [{ nombre: 'backend', ok: true }],
    manuales: [],
    meta,
  });
  assert.equal(i.bloqueadas, 2);
  assert.equal(i.ok, true);
  assert.match(informeMarkdown(i), /2 de 2 amenazas bloqueadas/);
});

test('CA-5: una amenaza sin prueba falla la suite y el informe lo dice', () => {
  const i = construirInforme({ amenazas, pruebas: [ok('a-01-x.ts', 't')], pasos: [], manuales: [], meta });
  assert.equal(i.filas[1].resultado, 'sin prueba');
  assert.equal(i.ok, false);
  assert.match(informeMarkdown(i), /sin prueba/);
});

test('un ataque que prospera (prueba fallida) marca «falló»', () => {
  const i = construirInforme({
    amenazas,
    pruebas: [ok('a-01-x.ts', 't'), { archivo: 'a-10-y.ts', titulo: 't', paso: false }, ok('a-10-z.ts', 't2')],
    pasos: [],
    manuales: [],
    meta,
  });
  assert.equal(i.filas[1].resultado, 'falló');
  assert.equal(i.ok, false);
});

test('RN-5: una prueba omitida no cuenta como cobertura', () => {
  const i = construirInforme({
    amenazas,
    pruebas: [ok('a-01-x.ts', 't'), { archivo: 'a-10-y.ts', titulo: 't', paso: false, omitida: true }],
    pasos: [],
    manuales: [],
    meta,
  });
  assert.equal(i.filas[1].resultado, 'sin prueba');
  assert.equal(i.filas[1].omitidas, 1);
});

test('un paso que no corrió falla la suite aunque las 13 estén cubiertas', () => {
  const i = construirInforme({
    amenazas,
    pruebas: [ok('a-01-x.ts', 't'), ok('a-10-y.ts', 't')],
    pasos: [{ nombre: 'contratos', ok: false }],
    manuales: [],
    meta,
  });
  assert.equal(i.ok, false);
  assert.deepEqual(i.pasosFallidos, ['contratos']);
});

test('CA-8: las filas manuales sin resultado quedan «pendiente» y no se declaran bloqueadas', () => {
  const i = construirInforme({
    amenazas,
    pruebas: [ok('a-01-x.ts', 't'), ok('a-10-y.ts', 't')],
    pasos: [],
    manuales: [{ amenaza: 'A-01', prueba: 'huella ajena', resultado: null }],
    meta,
  });
  assert.equal(i.filas[0].manual[0].resultado, 'pendiente');
});

test('lee las pruebas de Hardhat (mocha) con su título', () => {
  const salida = '  EscrowUniRide\n    \u001b[32m✔\u001b[39m ataque A-09: no se cobra dos veces (43ms)\n    1) otra que falla\n';
  const p = pruebasDeMocha(salida, 'contracts');
  assert.deepEqual(
    p.map((x) => [x.titulo, x.paso]),
    [
      ['ataque A-09: no se cobra dos veces', true],
      ['otra que falla', false],
    ],
  );
});
