# HU-24 · Liberación del pago — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-08)` · Épica: E6 Verificación de presencia · Prioridad: Must · PHU: 5 · Sprint: S3
> **Orden en S3: 5.ª y última.** Requiere HU-23 y PB-04; cierra la Release 1.0.
> Requisito del docente que cubre: **3 — Billetera blockchain que acredita y descuenta saldo** y **2 — Verificación**
> Amenazas que toca: **A-09** (liberar sin viaje o cobrar dos veces), **A-10** (los viajes no crean saldo), **A-12** (llaves del servidor)

## 1. Historia

**Como** conductor
**quiero** recibir el pago automáticamente cuando un viaje queda verificado
**para** no depender de la buena voluntad del pasajero.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | una reserva *Verificada* (HU-23) | el sistema la procesa, sin que nadie toque nada | la cuenta verificadora libera el pasaje al conductor; el conductor ve «Recibirás {monto} URC» y luego «Recibiste {monto} URC» con el hash; al pasajero se le descuenta de «En garantía»; la reserva pasa a *Pagada* |
| CA-2 | un pago liberado | se consulta la transacción en la red | la red guarda junto al pago la huella (hash) de la prueba de presencia, y esa huella coincide con la que el servidor calcula de las pruebas guardadas |
| CA-3 | **ataque A-09:** una reserva que no está *Verificada* (*Confirmada*, *Abordada*, *Verificación fallida*, cancelada) | alguien intenta que se libere su pago | nunca se libera; no existe ninguna acción pública para pedir una liberación |
| CA-4 | **ataque A-09:** una liberación ya hecha | se repite (reintento, respuesta perdida o dos procesos a la vez) | el conductor recibe el pago una sola vez |
| CA-5 | **ataque A-09:** una cuenta que no es la verificadora (conductor, pasajero, relayer) | intenta liberar directamente en el contrato | el contrato lo rechaza |
| CA-6 | la red blockchain no responde | se procesa la liberación | el pago queda *Pendiente* y se reintenta solo; a los 5 intentos queda una alerta y se sigue reintentando; nada se pierde |
| CA-7 | **ataque A-10:** cualquier viaje pagado | se compara el total de URC del pasajero, el conductor y la garantía antes de reservar y después de pagar | el total no cambia: el viaje no crea saldo |
| CA-8 | un pago confirmado | se consultan los saldos | el saldo en la base de datos del pasajero y del conductor coincide con el de la red; la conciliación no registra diferencias |
| CA-9 | **ataque A-12:** la llave de la cuenta verificadora | se revisa código, base de datos, logs y pruebas | no aparece; en producción el sistema no arranca si la llave no está en el servicio de llaves |
| CA-10 | todas las reservas *Verificadas* de un viaje pagadas | termina la última | el viaje pasa a *Pagado* (D-23) |

## 3. Reglas de negocio

- RN-1: **100 % al conductor**, sin comisión de la plataforma.
- RN-2: **Solo la cuenta verificadora libera**, solo reservas *Verificadas* y **una sola vez** por reserva (`constitution.md` Art. 4.5).
- RN-3: **Automática:** la liberación se inicia en cuanto la reserva queda *Verificada*; nadie la pide.
- RN-4: **Huella de la prueba:** resume las dos pruebas de encuentro (abordaje y bajada) y el resultado de la evaluación del trayecto, de forma que cualquier cambio posterior en esos datos se note.
- RN-5: **Nada se descarta en silencio:** reintento con espera creciente y alerta a los 5 intentos (igual que HU-13 RN-6 y HU-19 RN-7).
- RN-6: Cada liberación queda en auditoría con fecha, reserva, conductor, monto, hash de la transacción y resultado.
- RN-7: Solo red de prueba (Polygon Amoy o Hardhat local).

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Red caída (CA-6) | *Pendiente* con reintento | `billetera.pago.pendiente` |
| Liberación repetida (CA-4) | Un solo pago | — |
| Reserva no verificada (CA-3) | Nunca se libera | — |
| Cuenta verificadora sin fondos para el gas | *Pendiente*, alerta al equipo, reintento | `billetera.pago.pendiente` |
| Diferencia en la conciliación | Se registra en auditoría y se alerta | — |

## 5. Fuera de alcance de esta HU

- Reembolsos por cancelación o expiración → HU-20.
- Resolver una *Verificación fallida* → D-24.
- Retirar el saldo cobrado → HU-16 (Reserva).
- Calificar al otro participante → HU-21 (Reserva).
- Detección de colusión → HU-25.

## 6. Dependencias

- HU / PB: HU-23 (reserva *Verificada* y pruebas), PB-04 (`EscrowUniRide.liberar`), HU-14 (saldo y conciliación), HU-13 (cola de reintentos).
- Decisiones resueltas el 08/11: **D-23**: el pago se libera por reserva; el viaje pasa a *Pagado* cuando todas sus reservas *Verificadas* están pagadas.
- Pendiente de despliegue: firmante del servicio de llaves para la cuenta verificadora: se agrega a SP129 (al desplegar).

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque A-09, A-10 y A-12 en verde, en backend y en Hardhat.
- [ ] Viaje completo (reserva → abordaje → bajada → pago) contra `EscrowUniRide` en Hardhat local, con el hash visible en el historial.
- [ ] PR revisado por otro integrante.
- [ ] CI en verde (lint, pruebas, build).
- [ ] Correctitud · Eficiencia · Fiabilidad · Facilidad de uso · Mantenimiento · Seguridad e integridad · Portabilidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Esta spec refleja lo realmente construido.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-08 | Creación (borrador) | 2026-11-08 · Specs del Sprint 3 en borrador y decisiones D-22 a D-27 |
| 2026-11-08 | Aprobada por el PO | 2026-11-08 · Specs del Sprint 3 aprobadas |
