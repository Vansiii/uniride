# HU-19 · Reserva con escrow — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-08)` · Épica: E5 Viajes · Prioridad: Must · PHU: 8 · Sprint: S3
> **Orden en S3: 2.ª.** Requiere HU-18, HU-13 y HU-29; alimenta HU-22.
> Requisito del docente que cubre: **3 — Billetera blockchain que acredita y descuenta saldo** y **1 — Multi-organización**
> Amenazas que toca: **A-08** (API sin la app), **A-09** (cobrar dos veces), **A-10** (los viajes no crean saldo), **A-11** (voz sin biometría), **A-13** (otra organización)

## 1. Historia

**Como** pasajero verificado
**quiero** reservar un asiento en un viaje y que mi pasaje quede en garantía
**para** pagar solo si el viaje realmente ocurre.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | un pasajero verificado, con saldo disponible ≥ precio, y un viaje de su organización con asientos libres que todavía no salió | toca «Reservar y pagar {precio} URC» y confirma con biometría (HU-29) | la reserva se crea, el viaje tiene un asiento libre menos y el precio pasa de su saldo disponible a «En garantía»; el movimiento aparece *Pendiente* y luego *Confirmado* con su hash |
| CA-2 | un saldo disponible menor que el precio | abre la confirmación | el botón cambia a «Recargar saldo» con el faltante («Te faltan 4,00 URC»); la reserva no se crea ni se toca el asiento; tras recargar vuelve a la misma confirmación |
| CA-3 | un viaje con **un** asiento libre | dos pasajeros confirman a la vez | solo uno obtiene la reserva; el otro recibe «Ya no quedan asientos» y no se le bloquea nada |
| CA-4 | **ataque A-09:** una reserva ya enviada | la misma petición se repite (reintento, doble toque o red lenta) | existe una sola reserva y un solo bloqueo en garantía |
| CA-5 | un mismo pasajero con dos reservas simultáneas en viajes distintos cuyo total supera su saldo | ambas se confirman a la vez | solo se aceptan las que su saldo cubre; ninguna queda a medias |
| CA-6 | **ataque A-08 / A-11:** una petición de reserva sin la firma biométrica válida del teléfono vinculado | llega al servidor | responde 401 y no reserva nada |
| CA-7 | **ataque A-08:** una petición que incluye un monto, un conductor o un estado elegidos por el cliente | llega al servidor | el servidor los ignora: cobra siempre el precio publicado del viaje y paga siempre a su conductor |
| CA-8 | **ataque A-13:** un viaje de una organización a la que el pasajero no pertenece | intenta reservarlo conociendo su identificador | responde «Viaje no encontrado», igual que si no existiera |
| CA-9 | el conductor del viaje | intenta reservar su propio viaje | se rechaza |
| CA-10 | un pasajero que ya tiene una reserva activa en ese viaje | intenta reservar otra vez | se rechaza («Ya tienes una reserva en este viaje») |
| CA-11 | un viaje cancelado, en curso, terminado o cuya hora de salida ya pasó | se intenta reservar | se rechaza indicando que ya no admite reservas |
| CA-12 | la red blockchain no responde al reservar | se confirma la reserva | la reserva queda *Pendiente* con el asiento retenido y se reintenta sola; si el bloqueo resulta imposible, la reserva pasa a *No se completó*, el asiento vuelve a estar libre y no se descuenta nada |
| CA-13 | la primera reserva de un viaje confirmada | se consulta el viaje | pasa a *Reservado* y sigue apareciendo en la búsqueda mientras tenga asientos libres |
| CA-14 | una reserva creada | el pasajero abre «Mis viajes» y el conductor el detalle de su viaje | el pasajero ve su reserva con estado, monto en garantía y datos del viaje; el conductor ve la lista de pasajeros con nombre de pila y estado |
| CA-15 | **ataque A-10:** cualquier reserva | se compara el total de URC del pasajero, el conductor y la garantía antes y después | el total no cambia: reservar solo mueve saldo, nunca lo crea |

## 3. Reglas de negocio

- RN-1: **Un asiento por reserva** y **una reserva activa por pasajero y viaje**.
- RN-2: **Monto = precio por asiento publicado** del viaje, sin comisión. Lo fija el servidor.
- RN-3: **Se puede reservar hasta la hora de salida** del viaje. Después, no.
- RN-4: **Saldo suficiente** significa: saldo disponible menos los bloqueos de ese pasajero que aún están pendientes ≥ precio.
- RN-5: Solo reserva una persona **verificada** (membresía aprobada, identidad aprobada, teléfono vinculado), con billetera y sin cuenta suspendida. El viaje debe ser de su organización activa.
- RN-6: **El dinero queda en garantía**, no en manos del conductor: solo lo libera HU-24 (viaje verificado) o lo devuelve HU-20 (cancelación o expiración).
- RN-7: **Nada se descarta en silencio:** un bloqueo pendiente se reintenta con espera creciente; a los 5 intentos queda una alerta en auditoría y se sigue reintentando (igual que HU-13 RN-6).
- RN-8: Cada reserva, bloqueo y cambio de estado queda en auditoría con fecha, usuario y resultado (`AGENTS.md` §12).
- RN-9: A terceros se expone lo mínimo: el conductor ve nombre de pila y estado de cada pasajero; el pasajero, lo que ya muestra HU-18.
- RN-10: **Estados de la reserva** (D-23): *Pendiente* (bloqueo en curso) → *Confirmada* → *Abordada* (HU-22) → *Verificada* (HU-23) → *Pagada* (HU-24); además *No se completó* (bloqueo imposible) y *Verificación fallida* (HU-23); HU-20 agrega *Cancelada* y *Expirada*. El viaje pasa a *Reservado* con su primera reserva confirmada.
- RN-11: **Precio en múltiplos de 0,02 URC** (D-25), para que el reparto 50/50 de HU-20 dé centavos exactos. Se valida al publicar (HU-17); un viaje ya publicado con un precio que no cumple no admite reservas.
- RN-12: **Los viajes propios no aparecen** en la búsqueda del conductor (D-26).
- RN-13: **Cuenta suspendida** (D-27): no reserva, y el viaje de un conductor suspendido no admite reservas nuevas. Lo ya reservado lo resuelve HU-20.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Saldo insuficiente (CA-2) | Sin reserva; ofrece recargar con el faltante | `reservas.confirmar.saldo_insuficiente` |
| Último asiento tomado por otro (CA-3) | Sin reserva ni bloqueo | `reservas.confirmar.sin_asientos` |
| Petición repetida (CA-4) | Devuelve la reserva original | — |
| Viaje de otra organización (CA-8) | Igual que inexistente | `viajes.detalle.no_encontrado` |
| Viaje propio (CA-9) | Rechazo | `reservas.confirmar.viaje_propio` |
| Reserva duplicada (CA-10) | Rechazo | `reservas.confirmar.ya_reservado` |
| Viaje que ya no admite reservas (CA-11) | Rechazo | `reservas.confirmar.no_disponible` |
| Red blockchain caída (CA-12) | Reserva *Pendiente*, reintento automático | `reservas.estado.pendiente` |
| Bloqueo imposible tras reintentos (CA-12) | Reserva *No se completó*, asiento liberado, sin cobro | `reservas.estado.fallida` |
| Biometría cancelada | Nada cambia (HU-29 CA-2) | `comun.biometria.no_confirmado` |
| Cuenta suspendida | Rechazo | `comun.errores.cuenta_suspendida` |

## 5. Fuera de alcance de esta HU

- Cancelar una reserva o un viaje, reembolsos y expiración por falta de abordaje → HU-20 (S4).
- Reservar por voz → HU-27 (S4); esta HU deja la confirmación lista para que la voz llegue a ella.
- Reservar varios asientos en una sola reserva.
- Impedir que un pasajero reserve dos viajes a la misma hora (solo inmoviliza su propio saldo).
- Viajes entre organizaciones vinculadas → HU-04.

## 6. Dependencias

- HU / PB: HU-18 (detalle del viaje), HU-13 (saldo), HU-29 (biometría), PB-04 (`EscrowUniRide.bloquear`), HU-14 (saldo en garantía).
- Decisiones resueltas el 08/11 (MEMORY, «Resuelve D-22 a D-27»):
  - **D-23:** la reserva tiene estado propio (RN-10) y el del viaje se deriva de sus reservas.
  - **D-25:** RN-11; ajuste menor en la publicación de HU-17.
  - **D-26:** RN-12.
  - **D-27:** RN-13.

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque A-08, A-09, A-10, A-11 y A-13 en verde.
- [ ] Bloqueo real contra `EscrowUniRide` en Hardhat local registrado.
- [ ] PR revisado por otro integrante.
- [ ] CI en verde (lint, pruebas, build).
- [ ] Correctitud · Eficiencia · Fiabilidad · Facilidad de uso (paso 3 del flujo principal) · Mantenimiento · Seguridad e integridad · Portabilidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Esta spec refleja lo realmente construido.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-08 | Creación (borrador) | 2026-11-08 · Specs del Sprint 3 en borrador y decisiones D-22 a D-27 |
| 2026-11-08 | Aprobada por el PO | 2026-11-08 · Specs del Sprint 3 aprobadas |
