# HU-21 · Calificación mutua — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-17)` · Épica: E6 Confianza · Prioridad: Should · PHU: 3 · Sprint: S4 (hasta vie 20/11/2026)
> Requisito del docente que cubre: **2 — Verificación** (confianza entre personas) y **4 — Interfaz navegable**
> Amenazas que toca: **A-10** (calificaciones infladas por colusión), **A-08** (API sin la app), **A-13** (otra organización)

## 1. Historia

**Como** conductor o pasajero
**quiero** calificar a la otra parte al terminar un viaje pagado
**para** construir confianza y que los demás vean quién es fiable.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | una reserva *Pagada* en la que participé | abro el viaje en «Mis viajes» | veo «Calificar a {nombre}» |
| CA-2 | elijo de 1 a 5 estrellas y, opcional, un comentario de hasta 140 caracteres | envío | la calificación queda guardada y veo «Gracias por calificar» |
| CA-3 | ya califiqué esa reserva | intento calificar otra vez | se rechaza; la calificación no se cambia ni se duplica (idempotente) |
| CA-4 | pasaron más de **7 días** desde el pago | intento calificar | se rechaza: «Ya pasó el plazo para calificar.» |
| CA-5 | una reserva que no está *Pagada* (cancelada, expirada, fallida, en curso) | intento calificar | se rechaza |
| CA-6 | un conductor con al menos **3** calificaciones recibidas | un pasajero busca viajes (HU-18) | ve su promedio con 1 decimal y la cantidad; con menos de 3 sigue viendo «Nuevo» (D-17) |
| CA-7 | la otra parte | todavía no me calificó | no veo lo que me puso hasta calificarla yo o vencer el plazo de 7 días (calificación ciega) |
| CA-8 | **ataque A-13:** una persona de la organización A | intenta calificar una reserva en la que no participó, o de otra organización | se rechaza; nada se escribe |
| CA-9 | **ataque A-08:** alguien sin sesión, o sin ser parte de la reserva | llama a la API de calificar | se rechaza (401 / 403) |
| CA-10 | **ataque A-10:** un par bloqueado por HU-25 (colusión) | sus calificaciones mutuas | no cuentan en el promedio público; se guardan |
| CA-11 | una calificación | se muestra a terceros | solo el promedio y la cantidad; nunca quién calificó ni el comentario |
| CA-12 | dos envíos a la vez de la misma calificación | llegan | queda una sola |

## 3. Reglas de negocio

- RN-1: Solo se califica **una vez por reserva y por persona**: el pasajero califica al conductor y el conductor a cada pasajero de esa reserva.
- RN-2: Solo reservas *Pagadas*; plazo de **7 días** desde el pago (RN de CA-4).
- RN-3: Escala de **1 a 5** enteros. Comentario opcional de máximo 140 caracteres; el comentario lo ve solo la persona calificada, nunca terceros.
- RN-4: El promedio público se calcula a nivel de **persona**, con las calificaciones de todas sus organizaciones, y se muestra desde **3** calificaciones (RN de CA-6).
- RN-5: Una calificación **no se edita ni se borra**; no crea saldo ni mueve dinero (A-10, principio 5 de `AGENTS.md`).
- RN-6: Calificación ciega (CA-7): se revela cuando ambos calificaron o al vencer el plazo.
- RN-7: Las calificaciones de pares bloqueados por HU-25 se guardan pero se excluyen del promedio público mientras el bloqueo del par exista o haya existido en los 7 días previos al pago.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje (clave es-BO) |
|---|---|---|
| Ya calificó (CA-3) | Rechazo, sin duplicar | `calificaciones.crear.ya_calificada` |
| Plazo vencido (CA-4) | Rechazo | `calificaciones.crear.plazo_vencido` |
| Reserva no pagada (CA-5) | Rechazo | `calificaciones.crear.no_pagada` |
| Comentario largo | 400 | `calificaciones.crear.comentario_largo` |
| Falla la API | «Reintentar»; nada a medias | `calificaciones.crear.error` |
| Persona sin calificaciones suficientes | Insignia «Nuevo» | — |

## 5. Fuera de alcance de esta HU

- Reportar o denunciar a una persona.
- Editar o responder una calificación.
- Reputación que bloquee o cambie permisos de una cuenta.
- Mostrar quién calificó o los comentarios a terceros.
- Calificar en el panel web.

## 6. Dependencias

- HU-24 (reserva *Pagada*), HU-18 (búsqueda: reemplaza la insignia «Nuevo» de D-17 cuando hay ≥ 3), HU-25 (pares bloqueados).
- Decisiones abiertas: ninguna. D-17 queda resuelta con esta HU.

## 7. Definition of Done

- [ ] Todos los criterios cumplidos, incluidos los bordes (3.ª calificación, día 7 del plazo).
- [ ] Pruebas automatizadas del plan en verde; cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque A-08, A-10 y A-13 en verde.
- [ ] PR revisado; CI en verde en `backend/` y `mobile/`.
- [ ] Documentada en Swagger; spec refleja lo construido.
- [ ] Aceptada por el PO.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-17 | Creación (borrador) | pendiente |
| 2026-11-17 | Aprobada por el PO | pendiente |
