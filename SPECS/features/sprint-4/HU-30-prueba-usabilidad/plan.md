# HU-30 · Prueba de usabilidad (SUS) — Plan técnico

> Fase SDD: **Plan** (Diseño). Cómo se hace lo que dice `spec.md`.
> Estado: `aprobado (2026-11-15, integrante autorizado)` · Rama: `feat/HU-30-prueba-usabilidad` en la raíz (solo documentos).
> **Orden en S4: 6.ª y última:** las sesiones corren sobre la versión con HU-20, HU-27 y HU-28 fusionadas.
> **Requiere confirmación humana (`AGENTS.md` §14):** ninguna. No cambia código, datos de producción ni configuración. El estado inicial de cada sesión se prepara con la API y la app, sin escribir en la base a mano.

## 1. Artefactos

| Carpeta | Archivo | Contenido |
|---|---|---|
| raíz | `SPECS/features/sprint-4/HU-30-prueba-usabilidad/protocolo.md` | Objetivo, entorno (RN-1), perfil y reclutamiento (RN-2), guion del facilitador palabra por palabra, tareas T1–T4 con destino y hora concretos (RN-3), regla de ayuda (RN-8), manejo de la huella (RN-6) y casos borde de la spec §4 |
| raíz | `…/consentimiento.md` | Consentimiento informado de una página (propósito, qué se anota, que no hay grabaciones, anonimato P1–P5, derecho a retirarse; `constitution.md` Art. 6.5) |
| raíz | `…/cuestionario-sus.md` | Las 10 afirmaciones SUS en español con la escala 1–5 (RN-4) |
| raíz | `…/hoja-registro.md` | Una tabla por participante: tarea, completada sin ayuda (sí/no), tiempo, pasos, errores, repreguntas de voz, uso del teclado en T4, comentarios |
| raíz | `…/sus.mjs` | Calcula el puntaje de cada persona y el promedio desde `respuestas.json` con la fórmula de RN-4; con su prueba `node --test` (bordes: todo 3 = 50, mejor caso = 100, peor caso = 0) |
| raíz | `…/respuestas.json` | Respuestas SUS y resultados por tarea de P1–P5, anonimizados |
| raíz | `…/informe.md` | Resultado (CA-8): participantes anonimizados, SUS por persona y promedio, resultados por tarea, problemas con severidad (RN-5) y conclusión |

Las hojas en papel firmadas (consentimiento) las guarda el equipo; no se suben al repositorio.

Reutiliza: la app y la API tal como quedan en S4; `formato.ts` no aplica. Nada de la plataforma se modifica para la prueba.

## 2. Preparación del entorno (antes de cada sesión, RN-1 y RN-2)

1. Teléfono Android físico del equipo con la app de la versión candidata y la huella de un integrante registrada.
2. Una cuenta de prueba verificada y vinculada a ese teléfono, con la sesión iniciada.
3. Estado inicial: sin reservas activas (si quedó una de la sesión anterior, se cancela desde la app con HU-20; el 100 % vuelve si faltan más de 30 min) y **40,00 URC** disponibles (recarga simulada de HU-13 hasta completar).
4. Otro integrante, desde su teléfono, publica para la hora de la sesión al menos 3 viajes que cumplen T1 y 1 que cumple T4 (destino y hora distintos), con precio ≤ 15 URC para que T2 y T4 quepan en 40 URC.
5. Comprobar con una búsqueda que T1 y T4 dan resultados; el reconocedor de voz responde.

## 3. Desarrollo de la sesión (≈ 20 min por persona)

1. Bienvenida y consentimiento firmado (3 min).
2. Tareas T1 → T4 leídas tal cual; el facilitador anota y no indica dónde tocar (12 min). En la huella, el participante lo indica y el integrante apoya el dedo (RN-6).
3. Cuestionario SUS en papel, sin que el facilitador lo mire mientras se completa (3 min).
4. Dos preguntas abiertas: qué fue lo más difícil y qué cambiaría (2 min).

## 4. Análisis

- `node sus.mjs` calcula los 5 puntajes y el promedio (CA-4).
- Tasa de éxito sin ayuda por tarea y pasos del flujo buscar → reservar (CA-5, ≤ 4).
- Cada problema observado con su severidad (RN-5), cuántas personas lo tuvieron y la pantalla; los de severidad alta se cargan primero.
- Cada problema entra al backlog: una línea en `.agents/STEERING/backlog.md` (sección «Hallazgos de HU-30») y su tarjeta en Trello, con id (CA-7). Si un hallazgo cambia un patrón, también se refleja en `DESIGN_SYSTEM.md` (punto 8 de su mantenimiento, «Validación con usuarios»).
- Si el promedio es < 75, se informa tal cual (CA-9) y el PO decide repetir con 5 personas nuevas tras corregir los problemas altos.

## 5. Diagramas UML

No aplica.

## 6. Estrategia de verificación

| Criterio | Evidencia |
|---|---|
| CA-1 | `protocolo.md`, `consentimiento.md`, `cuestionario-sus.md`, `hoja-registro.md` revisados y aprobados por el PO antes de la primera sesión |
| CA-2, CA-3 | 5 hojas de registro y 5 cuestionarios completos → `respuestas.json` |
| CA-4 | salida de `sus.mjs` en `informe.md`; prueba `node --test` de la fórmula |
| CA-5, CA-6 | tabla de tareas en `informe.md` |
| CA-7 | ids de los hallazgos en `backlog.md` y Trello |
| CA-8 | `informe.md` versionado, revisado por otro integrante |
| CA-9 | si aplica, decisión del PO en MEMORY |

## 7. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| No se consiguen 5 personas antes de la Review del 17/11 | Alta | Alto | Reclutar desde la aprobación del plan (compañeros de otras carreras); sesiones cortas el mismo día |
| HU-27/HU-28 no llegan a la versión candidata | Media | Alto | Sin voz, T4 no se puede hacer: se informa así y se decide con el PO si se hace solo T1–T3 (el doc técnico §6 pide buscar, reservar y saldo) |
| La red o el servidor fallan en una sesión | Media | Medio | Hardhat local como respaldo (R-04); la sesión no cuenta y se repite (spec §4) |
| El integrante de la huella condiciona al participante | Baja | Medio | Solo apoya el dedo cuando se lo piden; no habla durante las tareas |

## 8. Tareas propuestas (se copian a backlog.md al aprobar)

| Tarea | Horas | Responsable |
|---|---|---|
| SP204 · Protocolo, consentimiento, cuestionario y hoja de registro; aprobación del PO | 2 | @[POR DEFINIR] |
| SP205 · `sus.mjs` con su prueba | 1 | @[POR DEFINIR] |
| SP206 · Reclutar 5 personas y preparar el entorno | 2 | @[POR DEFINIR] |
| SP207 · 5 sesiones | 2 | @[POR DEFINIR] |
| SP208 · Informe y hallazgos en el backlog y Trello | 2 | @[POR DEFINIR] |
