// PB-06: cálculo de percentiles, veredicto y guarda de la base local. Se corre con `node --test scripts/carga.test.mjs`.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { esLocal, informeMarkdown, percentil, resumen, veredicto } from './carga.mjs';

const del1al100 = Array.from({ length: 100 }, (_, i) => i + 1);

test('el percentil 95 de 1…100 es 95, y el 50 es 50', () => {
  assert.equal(percentil(del1al100, 95), 95);
  assert.equal(percentil(del1al100, 50), 50);
  assert.equal(percentil([7], 95), 7);
  assert.equal(percentil([3, 1, 2], 100), 3);
});

test('el resumen no depende del orden de las muestras', () => {
  assert.deepEqual(resumen([...del1al100].reverse()), { peticiones: 100, p50: 50, p95: 95, maximo: 100 });
});

test('CA-4: sin cambiar la meta, un p95 que la pasa es «no cumple»', () => {
  assert.equal(veredicto(95, 2000, 0), 'cumple');
  assert.equal(veredicto(95, 1, 0), 'no cumple'); // --meta-busqueda-ms=1
  assert.equal(veredicto(2000, 2000, 0), 'no cumple'); // la meta es «menor que»
});

test('CA-1, CA-2: un solo error 5xx basta para no cumplir, aunque sea rápido', () => {
  assert.equal(veredicto(10, 2000, 1), 'no cumple');
});

test('CA-5: solo acepta la base local', () => {
  assert.equal(esLocal('postgresql://u:p@localhost:5433/uniride'), true);
  assert.equal(esLocal('postgresql://u:p@127.0.0.1:5433/uniride'), true);
  assert.equal(esLocal('postgresql://u:p@uniride.abc.us-east-1.rds.amazonaws.com:5432/uniride'), false);
  assert.equal(esLocal(''), false);
  assert.equal(esLocal('no es una url'), false);
});

test('CA-3: el informe trae fecha, código, equipo, cantidades y el veredicto de cada prueba', () => {
  const informe = informeMarkdown({
    meta: { fecha: '2026-11-18', commits: { principal: 'abc123', backend: 'def456' }, equipo: 'PC', node: 'v24' },
    metas: { busquedaMs: 2000, abordajeMs: 1 },
    busqueda: {
      usuarios: 20,
      duracionMs: 30000,
      viajesSembrados: 222,
      organizaciones: 2,
      sinResultados: 5,
      errores5xx: 0,
      otrosErrores: 0,
      tiempos: del1al100,
    },
    abordaje: { usuarios: 10, rondas: 3, errores5xx: 0, otrosErrores: 0, tiempos: del1al100 },
  });
  for (const texto of ['2026-11-18', 'abc123', 'def456', 'PC', 'v24', '| Búsqueda de viajes | 20 | 100 | 50 ms | 95 ms | 100 ms |'])
    assert.ok(informe.includes(texto), texto);
  assert.match(informe, /Búsqueda de viajes[^\n]*\*\*cumple\*\*/);
  assert.match(informe, /Verificación de abordaje[^\n]*\*\*no cumple\*\*/); // meta de 1 ms: se informa, no se oculta
});
