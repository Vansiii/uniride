# PB-06 · Pruebas de carga básicas (reducida) — Plan técnico

> Fase SDD: **Plan** (Diseño). Estado: `aprobado (2026-11-17, PO)` · Rama: `feat/PB-06-pruebas-carga` (raíz)
> Spec aprobada por el PO el 2026-11-17.

## 1. Módulos afectados

| Carpeta | Módulo / componente | Cambio |
|---|---|---|
| raíz | `scripts/carga.mjs` (nuevo) | guion de medición; sin dependencias |
| raíz | `SPECS/features/sprint-4/PB-06-pruebas-carga/informe.md` | resultado de las corridas |
| raíz | `package.json` / `scripts/amenazas.json` | solo si ya existe un script de entrada; si no, se corre con `node scripts/carga.mjs` |
| backend / web / mobile / contracts | — | sin cambios |

Reutiliza: `scripts/suite-ataques.mjs` (cómo levanta datos de prueba, inicia sesión y firma el desafío del abordaje). Se copia el modo de firmar, no se duplica la lógica del servidor.

## 2. Cambios al modelo de datos

Ninguno. Los datos de prueba se crean por la API y quedan marcados con el prefijo `carga-` en el correo y el nombre, para limpiarlos (`DELETE` por prefijo en la base local). Nunca se corre contra producción: el guion se niega si `URL_API` no es `localhost` o `127.0.0.1` (CA-5). Sin migración ni dependencias.

## 3. Diseño del guion

- **Herramienta:** `fetch` y `performance.now()` de Node 24, concurrencia con un bucle de `Promise.all` por oleada; sin k6 ni autocannon (RN-5, regla de no añadir dependencias).
- **Búsqueda:** 20 usuarios simultáneos, 30 s, `GET /viajes` con filtros de destino y hora variados; datos: ≥ 200 viajes en 2 organizaciones, sembrados por la API si faltan.
- **Abordaje:** 10 usuarios simultáneos, cada uno con su viaje y reserva; mide el POST que valida el desafío firmado (las firmas las genera el guion, RN-3); desafíos de 30 s: se emite uno nuevo por petición.
- **Salida:** p50, p95, máximo, total y errores por prueba; compara con la meta (2 s / 3 s) y escribe `informe.md` con fecha, hash de commit (`git rev-parse HEAD`), versión de Node y equipo (CA-3). Código de salida ≠ 0 si el backend no responde (sin informe) o si hay 5xx.
- Una meta incumplida se escribe como **no cumple** (CA-4); no se ajusta la meta.
- El percentil se calcula con una función de 5 líneas y una prueba (`carga.test.mjs`, estilo `sus.test.mjs`) con datos conocidos (p95 de 1…100 = 95).

## 4. Pantallas

Ninguna.

## 5. Estrategia de pruebas

| Criterio | Tipo | Archivo |
|---|---|---|
| Cálculo de percentiles y veredicto | unitaria (`node --test`) | `scripts/carga.test.mjs` |
| CA-1, CA-2 | corrida real local, resultado en el informe | `informe.md` |
| CA-3, CA-4 | revisión del informe generado, incluye un caso «no cumple» simulado con `--meta-busqueda-ms=1` | `carga.test.mjs` |
| CA-5 | unitaria: rechaza una URL no local | `carga.test.mjs` |
| CA-6 | un compañero repite los pasos del informe | revisión del PR |

Metas de rendimiento aplicables: búsqueda < 2 s, abordaje < 3 s (p95).

## 6. Riesgos

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| La búsqueda no cumple 2 s | Media | Medio | Se informa tal cual; se abre defecto aparte (fuera de alcance) |
| Limitador de intentos o antiabuso de la API frena a los usuarios de prueba | Media | Medio | Usar usuarios distintos por hilo; si aún frena, documentarlo en el informe sin desactivar el limitador |
| La PC del equipo distorsiona la medición | Alta | Bajo | El informe declara el equipo y que es una medición local (RN-2) |

Requiere confirmación humana (§14): **no**.

## 7. Tareas propuestas

| Tarea | Horas | Responsable |
|---|---|---|
| Guion: siembra, búsqueda, abordaje, percentiles, informe, guardas | 4 | por asignar |
| Prueba unitaria del guion | 1 | por asignar |
| Corridas reales, informe y PR | 1 | por asignar |
