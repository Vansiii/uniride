# HU-17 · Publicar viaje — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-02)` · Épica: E5 Viajes · Prioridad: Must · PHU: 5 · Sprint: S2
> Requisito del docente que cubre: **1 — Multi-organización** y **2 — Verificación que no se pueda saltar**
> Amenazas que toca: **A-08** (Llamar a la API sin la app / firma) y **A-13** (Aislamiento entre organizaciones)

## 1. Historia

**Como** conductor verificado
**quiero** publicar un viaje indicando origen, destino, hora de salida, precio por asiento y cupos
**para** compartir mi trayecto con miembros de mi organización y coordinar los traslados diarios.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | un conductor con identidad verificada (HU-08), dispositivo vinculado (HU-09), vehículo registrado (HU-11) y membresía aprobada | ingresa origen, destino, fecha/hora futura, precio válido y cupos permitidos | el viaje se crea con éxito en estado `Publicado` y queda disponible para reservas |
| CA-2 | un conductor | intenta ofrecer más cupos que la capacidad de pasajeros de su vehículo registrado (HU-11 CA-5) | el sistema rechaza la publicación indicando el tope máximo permitido |
| CA-3 | un conductor | ingresa un precio por asiento superior al tope fijado por su organización (ej. 20 URC) o menor a 1 URC | el sistema rechaza la solicitud indicando los límites de tarifa |
| CA-4 | un conductor | ingresa una fecha u hora de salida pasada o con menos de 15 minutos de anticipación | el sistema rechaza la publicación exigiendo una hora válida |
| CA-5 | un conductor que ya tiene un viaje activo en el mismo rango de horario | intenta publicar otro viaje | el sistema lo rechaza para evitar solapamiento de horarios (margen mínimo de 2 horas) |
| CA-6 | un usuario sin identidad verificada (HU-08) o sin vehículo registrado (HU-11 CA-6) | intenta publicar un viaje | el servidor rechaza la acción con código 403 y le indica qué requisito le falta completar |
| CA-7 | una petición de publicación (Amenaza A-08) | se envía sin la firma del teléfono vinculado del conductor | el servidor responde 401 con firma inválida |

## 3. Reglas de negocio

- RN-1: **Máquina de estados oficial:** El viaje inicia obligatoriamente en estado `Publicado`. Transiciones permitidas: `Publicado → Reservado → En_curso → Verificado → Pagado` (o `Cancelado` / `Expirado`).
- RN-2: **Aislamiento institucional (A-13):** El viaje se publica bajo la organización activa del conductor (`organizacion_id`). Solo los miembros aprobados de dicha organización podrán buscarlo y reservarlo.
- RN-3: **Límite físico del vehículo:** Los cupos ofrecidos son como máximo la capacidad registrada en `vehiculos.capacidad` (1 a 6 pasajeros).
- RN-4: **Georreferenciación:** Origen y destino guardan nombre descriptivo, latitud y longitud numéricas (WGS84).
- RN-5: **Anticipación mínima:** Los viajes deben publicarse con al menos **15 minutos de anticipación** y como máximo con **7 días de antelación**.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Cupos superan la capacidad del auto (CA-2) | Rechazo indicando el límite del vehículo | `viajes.publicar.cupos_exceden_capacidad` |
| Precio fuera del rango permitido (CA-3) | Rechazo indicando tarifa mínima/máxima | `viajes.publicar.precio_invalido` |
| Horario inválido o pasado (CA-4) | Rechazo exigiendo horario futuro | `viajes.publicar.horario_invalido` |
| Solapamiento con otro viaje del conductor (CA-5) | Rechazo por conflicto de horario | `viajes.publicar.viaje_solapado` |
| Conductor sin vehículo o no verificado (CA-6) | Rechazo 403 con redirección | `viajes.publicar.requisito_incompleto` |

## 5. Fuera de alcance de esta HU

- Búsqueda de viajes por parte del pasajero → HU-18.
- Reserva de asientos y bloqueo de dinero en escrow → HU-19 (Sprint 3).
- Definición dinámica de tarifas entre organizaciones → HU-04 (en Sprint 4).
- Cálculo automático de desvíos y paradas intermedias múltiples (fuera de alcance v1).

## 6. Dependencias

- **HU-08:** Verificación de identidad aprobada.
- **HU-09:** Dispositivo móvil vinculado.
- **HU-11:** Vehículo registrado.
- **HU-12:** Billetera activa para cobrar viajes.

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Criterios CA-1 a CA-7 cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura en backend ≥ 70 %.
- [ ] Pruebas de ataque A-08 (sin firma) y A-13 (filtro estricto por organización) en verde.
- [ ] PR revisado · CI en verde.
- [ ] Documentado en Swagger.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-02 | Creación (borrador) | — |
| 2026-11-02 | Aprobación de spec y plan; máquina de estados, tope de cupos por auto y RLS | 2026-11-02 · HU-17 Publicar viaje: spec y plan técnico aprobados |

