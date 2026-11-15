# HU-25 · Detección de anomalías y bloqueo preventivo — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-15)` · Épica: E6 Verificación de presencia · Prioridad: Should · PHU: 5 · Sprint: S4
> **Orden en S4: 4.ª.** Requiere HU-24 (reservas *Pagadas*) y HU-23 (*Verificación fallida*); prepara HU-26 (Reserva).
> Requisito del docente que cubre: **2 — Verificación que no se pueda saltar**
> Amenazas que toca: **A-07** (GPS falso repetido), **A-08** (API sin la app), **A-10** (colusión para simular viajes), **A-13** (otra organización)

## 1. Historia

**Como** sistema
**quiero** detectar patrones de colusión y de verificación fallida repetida y bloquear de forma preventiva y temporal a quienes los muestran
**para** evitar que se simulen viajes o se insista en falsificar la ubicación.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | **ataque A-10 (P-1):** un mismo conductor y un mismo pasajero con **3** reservas *Pagadas* entre ellos cuyas salidas caen dentro de 24 h | se paga la tercera | queda una alerta «viajes repetidos» y el par queda bloqueado 7 días (RN-5) |
| CA-2 | ese par con 2 reservas *Pagadas* en 24 h (ida y vuelta) | se paga la segunda | no hay alerta ni bloqueo |
| CA-3 | **ataque A-10 (P-2):** una reserva *Pagada* cuyo abordaje y bajada están a **menos de 1 km** en línea recta, o con **menos de 3 min** entre ambos | se paga | queda una alerta «viaje sin desplazamiento»; si es la **segunda** del mismo par en 7 días, el par queda bloqueado 7 días |
| CA-4 | **ataque A-07 (P-3):** una persona (conductor o pasajero) con **3** reservas en *Verificación fallida* en 7 días | queda la tercera | queda una alerta «verificaciones fallidas repetidas» y su cuenta queda con bloqueo preventivo **72 h** |
| CA-5 | un par bloqueado | el pasajero intenta reservar un viaje de ese conductor, o el conductor uno del pasajero | se rechaza con «No puedes reservar este viaje por ahora.», sin decir el motivo |
| CA-6 | una cuenta con bloqueo preventivo | intenta publicar, reservar o recargar | se rechaza con «Tu cuenta tiene un bloqueo preventivo hasta el {día} a las {hora}. Si crees que es un error, contacta al administrador de tu organización.» |
| CA-7 | una cuenta o un par bloqueado | tiene reservas o viajes ya creados | puede consultar, cancelar (HU-20), abordar, bajar y cobrar como siempre; el bloqueo solo impide lo nuevo |
| CA-8 | un bloqueo vigente | llega su fecha de fin | se levanta solo, sin intervención; queda en auditoría |
| CA-9 | un bloqueo vigente | se detecta otro patrón que lo vuelve a disparar | el fin pasa a la fecha más lejana de los dos; no se acumulan bloqueos |
| CA-10 | la misma situación evaluada otra vez (reintento, dos procesos a la vez) | se evalúa | no se duplican alertas ni bloqueos |
| CA-11 | la detección falla (error interno) | se paga una reserva o queda una verificación fallida | el pago y los estados del viaje no se ven afectados; la falla queda en auditoría y la evaluación se reintenta |
| CA-12 | **ataque A-08:** un usuario bloqueado | llama a la API directamente para reservar, publicar o quitarse el bloqueo | se rechaza; no existe ninguna acción pública para levantar un bloqueo |
| CA-13 | **ataque A-13:** un patrón detectado sobre reservas de la organización A | se registra | la alerta queda solo en la organización de cada reserva involucrada; nada se escribe ni se muestra en otra organización |
| CA-14 | toda alerta o bloqueo | se registra | lleva fecha, organización, personas, patrón, reservas involucradas, cifras (cantidad, distancia en metros, minutos) y fin del bloqueo; nunca coordenadas |

## 3. Reglas de negocio

- RN-1: **Cuándo se evalúa:** al quedar una reserva *Pagada* (P-1, P-2) o en *Verificación fallida* (P-3), en menos de **1 min**. La evaluación nunca bloquea ni deshace el pago, la verificación ni la cancelación: el dinero ya se movió por sus propias reglas y, como los viajes no crean saldo, la colusión no genera ganancia (A-10).
- RN-2: **P-1 Viajes repetidos:** el mismo conductor y pasajero (en ese rol) con **≥ 3** reservas *Pagadas* cuyas horas de salida caen en una misma ventana de **24 h**. Ida y vuelta diaria (2) es normal.
- RN-3: **P-2 Viaje sin desplazamiento:** reserva *Pagada* con distancia en línea recta entre la posición del pasajero en el abordaje y en la bajada **< 1 km**, o con **< 3 min** entre abordaje y bajada. Una sola es alerta; **2** del mismo par en **7 días** bloquean el par.
- RN-4: **P-3 Verificaciones fallidas repetidas:** **≥ 3** reservas en *Verificación fallida* de una misma persona, como conductor o pasajero, en **7 días** (posible GPS falso, A-07; también frena el abuso de HU-20 RN-11).
- RN-5: **Bloqueo del par** (P-1, P-2): **7 días**; esas dos personas no pueden crear reservas entre sí, en ningún rol ni organización. El viaje sigue visible en la búsqueda; el rechazo llega al reservar.
- RN-6: **Bloqueo preventivo de cuenta** (P-3): **72 h**; la persona no publica, no reserva y no recarga, igual que una cuenta suspendida (D-27). Sí consulta, cancela y completa lo ya reservado.
- RN-7: **Temporal y automático:** todo bloqueo tiene fecha de fin y se levanta solo. En S4 nadie lo levanta antes; la revisión manual llega con HU-26 (Reserva).
- RN-8: **Las cuentas se cuentan por persona**, con sus reservas de todas sus organizaciones (las personas y sus billeteras son de la persona, D-07). La **alerta** lleva la organización de cada reserva que la originó (A-13).
- RN-9: **Sin pistas al usuario:** el rechazo por par bloqueado no dice el motivo; el de cuenta dice solo la fecha de fin.
- RN-10: **Privacidad** (HU-23 RN-8): las posiciones solo se leen para calcular P-2; alertas y logs guardan cifras, no coordenadas.
- RN-11: **Umbrales fijos** en v1 (3 en 24 h, 1 km, 3 min, 2 en 7 días, 3 en 7 días, 7 días, 72 h); cambiarlos es un cambio de spec.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Reserva con par bloqueado (CA-5) | Rechazo sin motivo | `reservas.confirmar.par_bloqueado` |
| Acción nueva con cuenta bloqueada (CA-6) | Rechazo con fecha de fin | `comun.errores.bloqueo_preventivo` |
| Patrón repetido con bloqueo vigente (CA-9) | Se extiende el fin | — |
| Evaluación repetida (CA-10) | Sin duplicados | — |
| Falla de la detección (CA-11) | Reintento; el viaje no se toca | — |
| Reserva sin posición de abordaje o bajada (P-2) | P-2 no se evalúa; P-1 sí | — |

## 5. Fuera de alcance de esta HU

- Panel para que el administrador revise alertas y levante bloqueos → HU-26 (Reserva).
- Ocultar de la búsqueda los viajes de un par bloqueado.
- Notificar por correo al bloqueado o al administrador.
- Detección con aprendizaje automático o umbrales configurables por organización.
- Suspensión definitiva de cuentas.

## 6. Dependencias

- HU / PB: HU-24 (reservas *Pagadas*), HU-23 (*Verificación fallida* y posiciones), HU-20 (RN-11 y la cancelación con bloqueo vigente), HU-19 RN-13 / D-27 (cuenta suspendida).
- Decisiones resueltas: **D-27** (qué impide un bloqueo de cuenta).
- Decisión que pide el PO: los umbrales de RN-11 son propuesta del equipo; no los fija ningún documento.
- Riesgo de calendario: es *Should*; el roadmap la manda a Reserva si la velocidad no alcanza (Reserva).

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde, con los bordes de cada umbral (2/3 viajes, 999/1000 m, 2:59/3:00 min, 71/72 h); cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque A-07, A-08, A-10 y A-13 en verde.
- [ ] PR revisado por otro integrante.
- [ ] CI en verde (lint, pruebas, build).
- [ ] Correctitud · Eficiencia · Fiabilidad · Facilidad de uso · Mantenimiento · Seguridad e integridad · Portabilidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Esta spec refleja lo realmente construido.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-15 | Creación (borrador) | 2026-11-15 · Specs del Sprint 4 en borrador y decisiones D-29 a D-31 |
| 2026-11-15 | Aprobada por el PO | 2026-11-15 · Specs del Sprint 4 aprobadas |
