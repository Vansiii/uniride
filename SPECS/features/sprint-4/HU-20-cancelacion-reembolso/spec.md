# HU-20 · Cancelación con reembolso — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-15)` · Épica: E5 Viajes · Prioridad: Must · PHU: 5 · Sprint: S4
> **Orden en S4: 1.ª.** Requiere HU-19, HU-22 y HU-24 (en `develop`); la usan HU-28 («cancela mi viaje») y HU-25.
> Requisito del docente que cubre: **3 — Billetera blockchain que acredita y descuenta saldo**
> Amenazas que toca: **A-08** (API sin la app), **A-09** (cobrar o reembolsar dos veces), **A-10** (los viajes no crean saldo), **A-11** (voz sin biometría), **A-13** (otra organización)

## 1. Historia

**Como** pasajero o conductor
**quiero** cancelar una reserva o un viaje con reglas claras, y que una reserva sin abordaje a tiempo se devuelva sola
**para** no perder dinero injustamente.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | un pasajero con una reserva *Confirmada* | abre «Cancelar reserva» | ve, calculado por el servidor, cuánto se le devuelve y cuánto recibe el conductor, con la política («Si cancelas con más de 30 minutos de anticipación recibes el 100 %; con menos, el 50 %») y un botón «Cancelar reserva» con huella (HU-29) |
| CA-2 | esa reserva, con **más de 30 min** antes de la hora de salida | confirma con biometría | la reserva pasa a *Cancelada*; el 100 % vuelve a su saldo disponible (movimiento *Pendiente* y luego *Confirmado* con su hash); el asiento vuelve a estar libre |
| CA-3 | esa reserva, con **30 min o menos** antes de la salida, o ya pasada la salida sin abordar | confirma con biometría | la reserva pasa a *Cancelada*; el 50 % vuelve al pasajero y el 50 % lo recibe el conductor (D-18), cada uno con su movimiento en el historial |
| CA-4 | la vista previa mostró 100 % y, al llegar la confirmación al servidor, ya rige el 50 % | se procesa | no se cancela; la app muestra la vista previa nueva y pide confirmar otra vez |
| CA-5 | un conductor con su viaje *Publicado* o *Reservado* y ninguna reserva *Abordada* | confirma «Cancelar viaje» con biometría, después de ver cuántos pasajeros se reembolsan | el viaje pasa a *Cancelado* y sale de la búsqueda; cada reserva *Confirmada* pasa a *Cancelada* con el 100 % al pasajero; cada pasajero lo ve en «Mis viajes» y recibe un correo |
| CA-6 | un viaje con reservas *Confirmadas* sin abordar | se cumplen 15 min después de la hora de salida (cierre de la ventana de HU-22 RN-3) | en menos de 1 min cada una pasa a *Expirada* con el 100 % al pasajero; si ninguna reserva del viaje llegó a *Abordada*, el viaje pasa a *Expirado* |
| CA-7 | un viaje *Publicado* sin reservas | se cumplen 15 min después de su salida | pasa a *Expirado*, sin movimiento de dinero |
| CA-8 | un viaje *En curso* con un pasajero a bordo y otro *Confirmado* que no subió | cierra la ventana de abordaje | solo la reserva sin abordar pasa a *Expirada* con el 100 %; el viaje sigue *En curso* y puede llegar a *Verificado* (HU-23 RN-10) |
| CA-9 | una reserva en *Verificación fallida* (HU-23) | pasan 24 h sin otra resolución | se reembolsa el 100 % al pasajero; la reserva sigue en *Verificación fallida* con «Reembolsado» (D-29) |
| CA-10 | **ataque A-09:** una cancelación o una expiración ya procesada | se repite (reintento, doble toque, dos procesos a la vez) | hay un solo reembolso y un solo cambio de estado |
| CA-11 | **ataque A-09:** una reserva *Abordada*, *Verificada*, *Pagada*, *Cancelada* o *Expirada*, o un viaje *En curso*, *Verificado*, *Pagado*, *Cancelado* o *Expirado* | se intenta cancelar | se rechaza («Este viaje ya no se puede cancelar») y no se mueve dinero |
| CA-12 | una reserva *Confirmada* | llegan a la vez su abordaje y su cancelación o expiración | gana uno solo: o queda *Abordada* sin reembolso, o *Cancelada*/*Expirada* con reembolso; nunca ambos |
| CA-13 | **ataque A-08 / A-11:** una cancelación sin la firma biométrica válida del teléfono vinculado (incluida una iniciada por voz) | llega al servidor | responde 401 y no cancela nada |
| CA-14 | **ataque A-08:** una petición que trae un porcentaje, un monto o un estado elegidos por el cliente | llega al servidor | el servidor los ignora y aplica sus reglas con su propia hora |
| CA-15 | **ataque A-13:** la reserva de otro pasajero, el viaje de otro conductor o cualquiera de otra organización | se intenta cancelar conociendo su identificador | responde «no encontrado», igual que si no existiera |
| CA-16 | **ataque A-10:** cualquier cancelación, expiración o reembolso por verificación fallida | se compara el total de URC del pasajero, el conductor y la garantía antes de reservar y después del reembolso | el total no cambia |
| CA-17 | la red blockchain no responde | se procesa un reembolso | la reserva queda *Cancelada*/*Expirada* con el reembolso *Pendiente*, se reintenta solo; a los 5 intentos queda una alerta y se sigue reintentando; nada se pierde |
| CA-18 | una reserva *Pendiente* (bloqueo en curso, HU-19 CA-12) | el pasajero intenta cancelarla | se rechaza («Tu reserva todavía se está confirmando. Intenta en unos segundos.») |
| CA-19 | una reserva *Pendiente* en un viaje que el conductor cancela o que expira | su bloqueo se confirma después | pasa a *Cancelada*/*Expirada* con el 100 % al pasajero; si el bloqueo resulta imposible, queda *No se completó* sin movimiento |

## 3. Reglas de negocio

- RN-1: **Cancela el pasajero** solo una reserva *Confirmada*. Con **más de 30 min** (estrictamente) entre la recepción en el servidor y la hora de salida → **100 %** al pasajero. Con **30 min exactos o menos**, incluso después de la salida mientras no haya abordado ni expirado → **50 % al pasajero y 50 % al conductor** (D-18).
- RN-2: **La hora que cuenta es la del servidor** al recibir la confirmación, con precisión de segundos. El cliente no la elige.
- RN-3: **Vista previa del servidor:** el monto que se devuelve lo calcula el servidor y la app lo muestra antes de la huella (resuelve P-06). La confirmación lleva el porcentaje que se mostró; si al recibirla rige un porcentaje menor, se rechaza con la vista previa nueva (CA-4). El porcentaje mostrado nunca decide el reembolso.
- RN-4: **Cancela el conductor** solo un viaje *Publicado* o *Reservado* sin ninguna reserva *Abordada*, hasta el primer abordaje o la expiración. Cada pasajero recibe el **100 %**. Sin penalidad para el conductor en v1 (HU-25 puede detectar patrones).
- RN-5: **Expiración** (HU-22 RN-3): al cumplirse **15 min después de la hora de salida**, toda reserva *Confirmada* sin abordar pasa a *Expirada* con el **100 %** al pasajero. Se procesa en menos de **1 min** después del cierre. El viaje pasa a *Expirado* si ninguna de sus reservas llegó a *Abordada* (también un viaje *Publicado* sin reservas). Si alguna abordó, el viaje sigue su curso.
- RN-6: **Reservas *Pendientes*:** el pasajero no las cancela (CA-18). Si su viaje se cancela o expira antes de confirmarse el bloqueo, al confirmarse se reembolsan al 100 % (CA-19).
- RN-7: **Montos exactos:** el precio es múltiplo de 0,02 URC (D-25), así que el 50 % siempre da centavos exactos.
- RN-8: **Asiento:** la cancelación del pasajero antes de la salida devuelve el asiento. El viaje **no vuelve a *Publicado*** (no se agregan transiciones hacia atrás, D-23): sigue *Reservado* y admite reservas mientras tenga asientos y no haya salido.
- RN-9: **Biometría** en toda cancelación (HU-29 RN-1). La expiración y el reembolso por verificación fallida son automáticos y no la piden.
- RN-10: **El dinero lo devuelve la garantía**: solo la cuenta verificadora reembolsa, solo reservas bloqueadas y **una sola vez** (`constitution.md` Art. 4.5). Reembolsar solo mueve saldo, nunca lo crea (A-10).
- RN-11: **Verificación fallida** (resuelve D-24; D-29 aprobada por el PO el 15/11): 24 h después de quedar en *Verificación fallida*, el pasaje se devuelve **100 % al pasajero**: sin prueba de viaje, el conductor no cobra. El abuso repetido lo detecta HU-25 (P-4). La reserva no cambia de estado; muestra «Reembolsado».
- RN-12: **Nada se descarta en silencio:** reintento con espera creciente y alerta a los 5 intentos (como HU-19 RN-7 y HU-24 RN-5).
- RN-13: **Avisos:** si el conductor cancela, cada pasajero afectado recibe un correo y ve «Cancelada por el conductor · Te devolvimos {monto} URC». Si cancela un pasajero, el conductor lo ve en su lista de pasajeros.
- RN-14: **Cuenta suspendida o con bloqueo preventivo** (D-27, HU-25): puede cancelar; sus reservas y viajes ya creados siguen estas mismas reglas.
- RN-15: Cada cancelación, expiración y reembolso queda en auditoría con fecha, actor (persona o sistema), reserva, porcentaje, montos y resultado (`AGENTS.md` §12).
- RN-16: Estados nuevos (D-23): reserva *Cancelada* y *Expirada*; el viaje usa los ya existentes *Cancelado* y *Expirado*.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Cambió el porcentaje entre la vista previa y la confirmación (CA-4) | Rechazo con vista previa nueva | `reservas.cancelar.politica_cambio` |
| Reserva o viaje que ya no se puede cancelar (CA-11) | Rechazo sin mover dinero | `reservas.cancelar.no_cancelable` / `viajes.cancelar.no_cancelable` |
| Reserva *Pendiente* (CA-18) | Rechazo | `reservas.cancelar.pendiente` |
| Petición repetida (CA-10) | Devuelve el resultado original | — |
| Reserva o viaje ajeno o de otra organización (CA-15) | Igual que inexistente | `reservas.detalle.no_encontrada` / `viajes.detalle.no_encontrado` |
| Red caída (CA-17) | Cancelada con reembolso *Pendiente* | `billetera.reembolso.pendiente` |
| Biometría cancelada | Nada cambia (HU-29 CA-2) | `comun.biometria.no_confirmado` |
| Sin conexión tras confirmar | No se da por cancelada; se puede reintentar con otra huella | `comun.errores.sin_conexion` |
| Correo al pasajero falla | Se reintenta por la cola de correos; la cancelación no se revierte | — |

## 5. Fuera de alcance de esta HU

- Cancelar por voz → HU-28 (desemboca en esta misma confirmación).
- Que el conductor quite a un pasajero puntual de su viaje.
- Penalidades o reputación por cancelar → HU-25 (patrones) y HU-21 (Reserva).
- Revisión manual de una verificación fallida por el administrador → HU-26 (Reserva).
- Plazo máximo de un viaje *En curso*.

## 6. Dependencias

- HU / PB: HU-19 (reserva y garantía), HU-22 (ventana de abordaje), HU-23 (*Verificación fallida*), HU-24 (cola de la cuenta verificadora), HU-29 (biometría), PB-04 (`reembolsar` ya reparte entre pasajero y conductor: el contrato **no cambia**).
- Decisiones resueltas: **D-18** (50/50), **D-23** (estados por reserva), **D-25** (múltiplos de 0,02), **D-27** (cuenta suspendida).
- **D-29** (resuelta por el PO el 15/11): RN-11, 100 % al pasajero 24 h después de la *Verificación fallida*. Descartadas: retener hasta HU-26 y repartir 50/50.
- Requiere confirmación humana en el plan (`AGENTS.md` §14): estados de reserva nuevos, máquina de estados del viaje (*Cancelado*, *Expirado*) y lógica de reembolso.
- P-06 (DESIGN_SYSTEM §17): se resuelve con RN-3.

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque A-08, A-09, A-10, A-11 y A-13 en verde.
- [ ] Reembolso 100 % y 50/50 real contra `EscrowUniRide` en Hardhat local registrado.
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
