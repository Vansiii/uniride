# HU-30 · Prueba de usabilidad (SUS) — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-15)` · Épica: E7 Interfaz y voz · Prioridad: Must · PHU: 3 · Sprint: S4
> **Orden en S4: 6.ª y última.** Requiere HU-27 y HU-28 en un teléfono físico; se ejecuta sobre la versión que se presenta en la Review.
> Requisito del docente que cubre: **4 — Interfaz muy navegable e intuitiva, con comandos de voz**
> Amenazas que toca: ninguna (no cambia código; las sesiones no debilitan ninguna capa, RN-6)

## 1. Historia

**Como** equipo
**queremos** medir la usabilidad de la app con cinco personas reales ajenas al equipo
**para** demostrar con un dato estándar que la interfaz es intuitiva y saber qué mejorar.

## 2. Criterios de aceptación

Esta historia se verifica con evidencia documental (protocolo, hojas de registro e informe), no con pruebas automatizadas.

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | el protocolo de la prueba (RN-1 a RN-7) | se revisa antes de la primera sesión | está escrito, con las tareas, el guion del facilitador, el consentimiento y la hoja de registro, y lo aprobó el PO |
| CA-2 | **5** participantes que cumplen RN-2 | hacen las tareas T1 a T4 (RN-3) sin ayuda | se registra por persona y tarea: completada o no, tiempo, pasos usados, errores y comentarios |
| CA-3 | cada participante | termina las tareas | responde el cuestionario SUS de 10 preguntas en español (RN-4) |
| CA-4 | los 5 cuestionarios | se calculan con la fórmula estándar (RN-4) | el **promedio es 75 o más** |
| CA-5 | las tareas T1 a T3 | se observan | al menos 4 de 5 participantes las completan sin ayuda, y el flujo buscar → reservar se completa en **4 pasos o menos** (DESIGN_SYSTEM §10) |
| CA-6 | la tarea por voz T4 | se observa | se registra si se completó, cuántas repreguntas hubo y si la persona recurrió al teclado |
| CA-7 | cada problema observado | termina la última sesión | queda en el informe con su severidad (RN-5) y entra al backlog como ítem con su id; los de severidad alta se priorizan en el Product Backlog |
| CA-8 | el informe | se entrega | contiene participantes anonimizados (P1 a P5), puntaje SUS por persona y promedio, resultados por tarea, problemas y conclusión, y queda versionado en el repositorio |
| CA-9 | un promedio menor que 75 | se calcula | se informa tal cual, sin descartar participantes ni repetir preguntas; el equipo corrige los problemas altos y el PO decide repetir la prueba con **5 personas nuevas** |

## 3. Reglas de negocio

- RN-1: **Entorno:** la versión candidata de la Review en un teléfono Android físico del equipo, contra el entorno de pruebas (o producción si ya está desplegada), con la red local o Amoy. Viajes publicados por un integrante para la hora de la sesión.
- RN-2: **Participantes:** 5 personas mayores de edad, ajenas al equipo, que no hayan visto la app, idealmente estudiantes o trabajadores de una organización. Todas usan la misma **cuenta de prueba**, ya verificada y vinculada a ese teléfono (una cuenta por teléfono, HU-09). Antes de cada sesión el equipo deja el mismo estado inicial: sesión iniciada, sin reservas activas, **40,00 URC** disponibles y al menos 3 viajes publicados que cumplen T1.
- RN-3: **Tareas** (se leen al participante tal cual; el facilitador no indica dónde tocar):
  - T1 — «Busca un viaje que salga cerca de aquí hacia {destino} a las {hora}.»
  - T2 — «Reserva un asiento en el viaje que más te convenga.»
  - T3 — «Averigua cuánto saldo te queda y cuánto está en garantía.»
  - T4 — «Ahora, sin escribir, pide por voz un viaje a {destino} a las {hora} y reserva el primero.» (destino y hora distintos de T1, con viajes publicados para ellos, así no choca con la reserva de T2).
- RN-4: **SUS:** las 10 afirmaciones estándar de Brooke (1996) en español, escala de 1 (muy en desacuerdo) a 5 (muy de acuerdo). Puntaje por persona = (Σ(impares − 1) + Σ(5 − pares)) × 2,5, de 0 a 100. Meta: promedio de los 5 ≥ 75 (documento técnico §2.9).
- RN-5: **Severidad:** *alta* (impide completar la tarea), *media* (la completa con error o demora notable), *baja* (molestia o comentario).
- RN-6: **Biometría y seguridad intactas:** la huella del teléfono de prueba es la de un integrante. Cuando la app la pide, el participante lo indica y el integrante apoya el dedo; ese paso cuenta como completado por el participante y no como ayuda. No se usa ningún modo que salte la biometría ni la verificación.
- RN-7: **Datos personales** (`constitution.md` Art. 6.5): consentimiento informado firmado; el informe solo guarda P1 a P5, edad aproximada y ocupación; sin nombres, correos, fotos ni grabaciones de audio o video.
- RN-8: **Ayuda:** cualquier indicación del facilitador sobre cómo hacer la tarea cuenta como «con ayuda». Repetir la consigna no cuenta.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Falla técnica que impide seguir (red, servidor) | Se anota; la sesión se repite con otra persona y no cuenta entre las 5 | — |
| Participante abandona | Se anota; se busca otra persona | — |
| Cuestionario incompleto | No se calcula a medias; se reemplaza al participante | — |
| Ruido que impide la voz | Se anota en T4; no anula T1 a T3 | — |

## 5. Fuera de alcance de esta HU

- Prueba de accesibilidad con TalkBack (pendiente en HEARTBEAT).
- Usabilidad del panel web de administración.
- Corregir los problemas encontrados: entran al backlog como ítems propios.

## 6. Dependencias

- HU / PB: HU-27 y HU-28 (T4), HU-18, HU-19 y HU-14 (T1 a T3), PB-03 (prototipo y DESIGN_SYSTEM).
- Requiere: un teléfono Android físico y cinco personas disponibles antes de la Review del 17/11.
- Decisiones abiertas que la afectan: ninguna.

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Protocolo aprobado por el PO.
- [ ] 5 sesiones válidas registradas.
- [ ] Promedio SUS ≥ 75 y flujo principal ≤ 4 pasos.
- [ ] Problemas en el backlog con su severidad.
- [ ] Informe versionado y revisado por otro integrante.
- [ ] Esta spec refleja lo realmente hecho.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-15 | Creación (borrador) | 2026-11-15 · Specs del Sprint 4 en borrador y decisiones D-29 a D-31 |
| 2026-11-15 | Aprobada por el PO | 2026-11-15 · Specs del Sprint 4 aprobadas |
