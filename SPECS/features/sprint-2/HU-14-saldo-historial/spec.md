# HU-14 · Saldo e historial — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-02)` · Épica: E4 Billetera y Pagos · Prioridad: Must · PHU: 3 · Sprint: S2
> Requisito del docente que cubre: **3 — Billetera blockchain propia que acredita y descuenta saldo**
> Amenazas que toca: **A-09** (Cobro indebido o saldo inconsistente) y **A-10** (Colusión / trazabilidad de fondos)

## 1. Historia

**Como** usuario con billetera activa
**quiero** ver mi saldo desglosado y el historial detallado de todos mis movimientos
**para** tener control y certeza de mi dinero, diferenciando lo que tengo disponible de lo retenido en viajes.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | una persona con billetera activa | consulta su saldo en la aplicación | ve el saldo total en URC, desglosado claramente en **saldo disponible** y **saldo bloqueado en garantía (escrow)** |
| CA-2 | un usuario con movimientos previos (recargas, reservas, cobros o reembolsos) | abre el historial de la billetera | ve una lista cronológica inversa con tipo de operación, monto, fecha, hora, estado y enlace al hash de la transacción en el explorador de bloques |
| CA-3 | una transacción on-chain que aún está siendo minada por la red blockchain | el usuario consulta sus movimientos | la transacción se visualiza con la etiqueta `Pendiente`, sin bloquear la interfaz ni congelar el uso del saldo no comprometido |
| CA-4 | cualquier cálculo o consulta de balance (Art. 4.6 de la Constitución) | se verifica el saldo | el saldo contable registrado en la base de datos coincide con el saldo de tokens emitidos en el contrato inteligente `UniCoin` |
| CA-5 | una lista de movimientos con más de 20 transacciones | el usuario se desplaza por el historial | la lista carga de forma paginada o con scroll infinito fluido |
| CA-6 | un usuario autenticado pero sin billetera creada | intenta ingresar a la pantalla de saldo | el sistema lo redirige amablemente a completar su verificación de identidad (HU-08) |

## 3. Reglas de negocio

- RN-1: **Libro mayor inmutable (Append-only):** El saldo nunca se actualiza manualmente. Se calcula a partir de un registro inmutable de transacciones contables donde cada movimiento tiene origen, destino, monto y justificación (`constitution.md` Art. 4.1).
- RN-2: **Desglose de escrow:** El saldo disponible es el saldo total en tokens URC menos el monto actualmente retenido en contratos escrow por viajes reservados pero aún no finalizados.
- RN-3: **Trazabilidad pública:** Cada transacción confirmada cuenta con su `hash_tx` público en Polygon Amoy para auditoría descentralizada.
- RN-4: **Moneda y precisión:** Todos los montos se muestran en unidades **URC** con 2 decimales (equivalente 1:1 referencial al boliviano para fines didácticos, sin valor financiero real).

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Historial vacío (usuario nuevo) | Vista vacía amigable con botón de recarga | `billetera.historial.vacio` |
| Nodo blockchain inaccesible temporalmente | Muestra el último saldo contable sincronizado en BD con indicador de advertencia | `billetera.saldo.sincronizacion_pendiente` |
| Usuario no verificado (CA-6) | Redirección a verificación | `billetera.creacion.identidad_requerida` |

## 5. Fuera de alcance de esta HU

- Proceso de recarga de saldo → HU-13.
- Bloqueo y retención de fondos al reservar viaje → HU-19 (Sprint 3).
- Proceso de retiro simulado a cuenta bancaria → HU-16 (en Reserva).

## 6. Dependencias

- **HU-12:** Creación de billetera (requiere dirección pública generada).

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [x] Criterios CA-1 a CA-6 cumplidos.
- [x] Pruebas automatizadas del `plan.md` en verde; cobertura en backend ≥ 70 %.
- [x] Verificación de conciliación BD ↔ Blockchain (CA-4) probada. Contra `UniCoin` y `EscrowUniRide` reales en Hardhat; Polygon Amoy pendiente de SP23.
- [ ] PR revisado · CI en verde.
- [x] Documentado en Swagger.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-02 | Creación (borrador) | — |
| 2026-11-02 | Aprobación de spec y plan; libro mayor inmutable y desglose de escrow | 2026-11-02 · HU-14 Saldo e historial: spec y plan técnico aprobados |
| 2026-11-07 | Verificación con escrow real, web y huellas | 2026-11-07 · HU-14: verificación con escrow real, web y huellas |

