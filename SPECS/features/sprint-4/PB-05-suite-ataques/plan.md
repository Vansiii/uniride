# PB-05 · Suite consolidada de ataques — Plan técnico

> Fase SDD: **Plan** (Diseño). Cómo se construye lo que dice `spec.md`.
> Estado: `aprobado (2026-11-15, integrante autorizado)` · Rama: `feat/PB-05-suite-ataques` en raíz y, donde falte un ataque, en `backend`, `contracts` y `mobile`; se fusiona después de HU-20, HU-25, HU-27 y HU-28.
> **Orden en S4: 5.ª.**
> **Requiere confirmación humana (`AGENTS.md` §14):** ninguna prevista. Los workflows de CI no cambian: cada repositorio ya corre sus pruebas (con sus ataques) en cada PR (CA-6). Si al implementar hiciera falta tocar un workflow, se pide antes.

## 1. Módulos afectados

| Carpeta | Módulo / componente | Cambio |
|---|---|---|
| raíz | `scripts/suite-ataques.mjs` (nuevo) | Comando único (CA-3): corre las pruebas de backend (unitarias y e2e), contratos y app con salida JSON, junta las que nombran una amenaza y escribe el informe |
| raíz | `scripts/amenazas.json` (nuevo) | Las 13 filas de `AGENTS.md` §6 (id, ataque, contramedida, capa, historia) y los ataques mínimos de la spec RN-2, como lista verificable |
| raíz | `SPECS/features/sprint-4/PB-05-suite-ataques/manual.json` (nuevo) | Filas manuales del teléfono (RN-4): pasos, esperado, fecha, teléfono, persona, resultado |
| raíz | `SPECS/features/sprint-4/PB-05-suite-ataques/informe.md` | Generado (CA-4, CA-10); se versiona el del commit que se presenta |
| backend | `test/ataques/sin-cambios.ts` (nuevo) | `instantanea()` / `esperarSinCambios()`: estados de reservas y viajes, asientos, libro, saldos de la cadena simulada y bloqueos en garantía (CA-2) |
| backend | `test/ataques/*` | Usar `esperarSinCambios` en cada ataque de dinero, estado o verificación; completar los huecos de §3 |
| backend | `test/ataques/a-12-llaves.e2e-spec.ts` (nuevo) | Busca patrones de llave privada (hex de 64, PEM, frase semilla) en el repositorio versionado, en la base (columnas de texto) y en la salida de log de una sesión de prueba (CA-1, A-12) |
| backend | `test/ataques/a-13-rutas.e2e-spec.ts` (nuevo) | Catálogo de rutas con datos de organización: toda ruta registrada (como `catalogo-rutas.ts` de HU-29) que lea o escriba datos de organización lleva `OrganizacionGuard` o figura en una lista explícita de excepciones justificadas (CA-7) |
| contracts | `test/EscrowUniRide.ts` | Títulos con `A-09` y los casos que falten de CA-9 (reembolso doble, reserva inexistente, operador y relayer) |
| mobile | `src/__tests__/*` | Los ataques de la app (A-11 de HU-27 y HU-28) llevan `A-11` en el título |

**Regla de pertenencia (RN-6):** una prueba cuenta para `A-xx` si su archivo empieza con `a-xx-` o su título completo contiene `A-xx`. Así las que ya existen fuera de `test/ataques/` (por ejemplo, A-01 y A-02 en `identidad/verificacion.e2e-spec.ts`, A-12 en `billetera/creacion.e2e-spec.ts`) cuentan sin moverlas.

Reutiliza: los ~30 archivos `a-xx-*` existentes, `catalogo-rutas.ts` (A-11, HU-29 CA-7), `ayudas-*` de las pruebas, la cadena simulada de las e2e y la red Hardhat en memoria de `contracts`.

## 2. Cambios al modelo de datos

Ninguno.

## 3. Cobertura actual y huecos

| Id | Ya cubierto (archivo o título) | Hueco a cerrar en PB-05 |
|---|---|---|
| A-01 | `identidad/verificacion.e2e-spec.ts` (CA-2, CA-3) | — |
| A-02 | `identidad/verificacion.e2e-spec.ts` (CA-4, CA-5), `dispositivos/vinculacion.e2e-spec.ts`, `billetera/creacion.e2e-spec.ts` | — |
| A-03 | `a-03-abordaje`, `a-03-revinculacion` | Vincular con integridad inválida con título `A-03` |
| A-04 | `a-04-revinculacion` | Firma con llave de otro teléfono y con llave anulada en una acción de dinero; fila manual de huella ajena |
| A-05 | `a-05-repeticion-handshake` | Código de un tipo usado para el otro (si no está) |
| A-06 | `a-06-qr-lejos` | Lo mismo en la bajada |
| A-07 | `a-07-abordaje`, `a-07-trayecto`, HU-25 | Fila manual con app de ubicación falsa |
| A-08 | `a-08-*` (9 archivos), HU-20, HU-28 | — |
| A-09 | `a-09-*`, `contracts/test/EscrowUniRide.ts`, HU-20 | Títulos `A-09` en contratos; reembolso doble y reserva inexistente |
| A-10 | `a-10-*`, HU-20, HU-25 | — |
| A-11 | `a-11-catalogo-sensible`, HU-27, HU-28 | — |
| A-12 | `billetera/creacion.e2e-spec.ts`, `blockchain.service.spec.ts` | `a-12-llaves`: repositorio, base y log |
| A-13 | `a-13-*` (10 archivos), HU-20, HU-25, HU-28 | `a-13-rutas`: catálogo de rutas con organización |

El inventario exacto se rehace al empezar (SP199) con el propio guion; esta tabla es la línea de base del 15/11.

## 4. El comando

`node scripts/suite-ataques.mjs` desde la raíz, con el PostgreSQL del `docker compose` levantado y el `.env` de desarrollo:

1. `backend`: `prisma migrate deploy`; `vitest run --reporter=json` (unitarias) y `vitest run --config vitest.config.e2e.ts --reporter=json` (e2e).
2. `contracts`: `npm test` con salida legible por máquina (el formato exacto de Hardhat 3 se fija en SP199).
3. `mobile`: `jest --json`.
4. Junta los resultados por amenaza, agrega `manual.json` y escribe `informe.md` y `informe.json`.
5. Sale con error si una amenaza no tiene ninguna prueba que pase, si alguna prueba de amenaza falló o si un paso no corrió (CA-5). Nunca reintenta pruebas (RN-5).

Informe (CA-4): una fila por amenaza con id, ataque, contramedida, capa, historia, pruebas (archivo › título), resultado (*bloqueado* / *falló* / *sin prueba*), y para las manuales, fecha, teléfono y persona; cabecera con fecha, commit de cada repositorio y total «13 de 13 bloqueadas». A-03 dice *simulada en desarrollo* mientras no haya fila manual con la integridad real (RN-4). Sin secretos, tokens ni datos personales (RN-7): solo títulos de prueba y resultados.

## 5. Diagramas UML

- [ ] Despliegue: dónde corre la suite (local con Docker; CI por repositorio).
- [ ] No cambia otros diagramas.

## 6. Estrategia de pruebas

| Criterio / amenaza | Tipo | Archivo de prueba |
|---|---|---|
| CA-1, RN-2 cada amenaza con sus ataques mínimos | el guion compara contra `amenazas.json` | `scripts/suite-ataques.mjs` |
| CA-2 nada cambió | e2e con `esperarSinCambios` | `backend/test/ataques/*` |
| CA-3, CA-11 un comando, < 15 min | manual cronometrada (registrar en MEMORY) | — |
| CA-4, CA-5 informe y falla sin prueba | prueba del guion con resultados de ejemplo (`node --test`) | `scripts/suite-ataques.test.mjs` |
| CA-6 un PR que quita la firma de una acción sensible falla | ya cubierto por `a-11-catalogo-sensible`; se demuestra una vez en una rama de prueba descartable | — |
| CA-7 acción sensible o ruta con organización nueva sin su guard | e2e | `a-11-catalogo-sensible`, `a-13-rutas.e2e-spec.ts` |
| CA-8 filas manuales | lista en `manual.json` | — |
| CA-9 contrato | Hardhat | `contracts/test/EscrowUniRide.ts` |
| A-12 | ataque e2e | `a-12-llaves.e2e-spec.ts` |

Metas de rendimiento: la suite < 15 min (CA-11).

## 7. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| La e2e pasa de 600 s con la laptop a batería (MEMORY 14/11) | Alta | Medio | Correr con el cargador; la suite es la e2e completa más unitarias, no repite pruebas |
| Formato de salida de Hardhat 3 sin reportero JSON | Media | Bajo | SP199 lo resuelve primero; si no hay JSON, leer el resumen por prueba de la salida estándar |
| `a-12-llaves` con falsos positivos (hashes de transacción, direcciones) | Media | Bajo | Patrones de llave con contexto (`PRIVATE KEY`, `0x` + 64 hex fuera de `hash_tx`/fixtures conocidos) y lista corta de excepciones revisada |
| Un ataque prospera al consolidar | Baja | Alto | Se corrige en la historia dueña de la capa (spec §5) y se registra como hallazgo |

## 8. Tareas propuestas (se copian a backlog.md al aprobar)

| Tarea | Horas | Responsable |
|---|---|---|
| SP199 · Guion `suite-ataques.mjs`, `amenazas.json`, informe y su prueba; inventario real | 4 | @[POR DEFINIR] |
| SP200 · `esperarSinCambios` y su uso en los ataques de dinero, estado y verificación | 4 | @[POR DEFINIR] |
| SP201 · Huecos: `a-12-llaves`, `a-13-rutas`, A-03, A-04, A-05/A-06 en la bajada | 4 | @[POR DEFINIR] |
| SP202 · Contratos: casos y títulos `A-09` | 1 | @[POR DEFINIR] |
| SP203 · Lista manual en el teléfono (A-03 real si hay despliegue, A-04, A-07) e informe final versionado | 2 | @[POR DEFINIR] |
