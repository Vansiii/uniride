import assert from 'node:assert/strict';
import { test } from 'node:test';
import { puntajeSus, resumenSus } from './sus.mjs';

const todos = (n) => Array(10).fill(n);
// Mejor caso: impares 5 y pares 1. Peor caso: impares 1 y pares 5.
const mejor = [5, 1, 5, 1, 5, 1, 5, 1, 5, 1];
const peor = [1, 5, 1, 5, 1, 5, 1, 5, 1, 5];

test('todo 3 = 50, mejor caso = 100, peor caso = 0', () => {
  assert.equal(puntajeSus(todos(3)), 50);
  assert.equal(puntajeSus(mejor), 100);
  assert.equal(puntajeSus(peor), 0);
});

test('un cuestionario incompleto o fuera de escala no se calcula', () => {
  assert.throws(() => puntajeSus([3, 3, 3]));
  assert.throws(() => puntajeSus([...todos(3).slice(1), 6]));
  assert.throws(() => puntajeSus(null));
});

test('promedio de cinco personas y la meta de 75', () => {
  const r = resumenSus([mejor, mejor, mejor, todos(3), todos(3)].map((sus, i) => ({ id: `P${i + 1}`, sus })));
  assert.equal(r.promedio, 80);
  assert.equal(r.cumple, true);
  const bajo = resumenSus([todos(3), todos(3), todos(3), todos(3), mejor].map((sus, i) => ({ id: `P${i + 1}`, sus })));
  assert.equal(bajo.promedio, 60);
  assert.equal(bajo.cumple, false);
});
