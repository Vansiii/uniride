# HU-13 · Recarga de saldo — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-02)`; ajuste del 2026-11-07 pendiente de aprobación · Épica: E4 Billetera y Pagos · Prioridad: Must · PHU: 5 · Sprint: S2
> Requisito del docente que cubre: **3 — Billetera blockchain propia que acredita y descuenta saldo**
> Amenazas que toca: **A-09** (Cobro indebido o doble acreditación), **A-10** (Colusión: el saldo solo entra por recarga), **A-11** (Voz sin biometría)

## 1. Historia

**Como** pasajero
**quiero** recargar saldo en mi billetera mediante un código QR de pago
**para** tener saldo en tokens URC disponible para pagar mis viajes compartidos.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | una persona con billetera activa (HU-12) y dispositivo vinculado (HU-09) | elige un monto válido entre 10 y 500 Bs y confirma el pago con su dispositivo | el contrato inteligente acuña los tokens URC equivalentes, su saldo se actualiza y la transacción se registra con su hash |
| CA-2 | un usuario | ingresa un monto menor a 10 Bs o mayor a 500 Bs | el sistema rechaza la solicitud indicando los límites permitidos |
| CA-3 | una orden de recarga ya pagada y acreditada (Amenaza A-09) | alguien intenta confirmar nuevamente el mismo pago o se repite el webhook | el sistema responde de forma idempotente sin acuñar tokens adicionales |
| CA-4 | una petición de confirmación de recarga (Amenaza A-08, A-11) | se envía sin la firma del dispositivo vinculado o por comando de voz sin interacción física | el servidor la rechaza con código 401; la voz nunca puede autorizar recargas por sí sola |
| CA-5 | una orden de recarga generada | pasan más de 15 minutos sin confirmarse el pago | la orden pasa a estado `Expirada` y no puede acreditar saldo |
| CA-6 | un usuario sin billetera o con identidad no verificada | intenta ingresar al flujo de recarga | el sistema le impide operar y le solicita verificar su identidad |

## 3. Reglas de negocio

- RN-1: **Límites de recarga:** Monto mínimo de **10 URC (Bs)** y monto máximo por transacción de **500 URC (Bs)**.
- RN-2: **Acuñación on-chain (Mint):** La recarga es la **única vía legítima por la que ingresa nuevo saldo** al sistema (`constitution.md` Art. 4.4). Los viajes no crean saldo.
- RN-3: **Idempotencia estricta:** Cada recarga tiene una `clave_idempotencia` única que vincula el intento de pago con la transacción on-chain (A-09).
- RN-4: **Vigencia del QR:** Cada orden de recarga tiene una vida útil de **15 minutos**.
- RN-5: **Confirmación con biometría del dispositivo (Resolución D-13):** La confirmación de recarga viaja firmada con la llave de hardware de HU-09. HU-29 en Sprint 3 añadirá el prompt de biometría explícita para voz.
- RN-6: **Nada se descarta en silencio:** Una recarga confirmada se acredita aunque el nodo falle en ese momento: se muestra "procesando" y se reintenta sola. Si al quinto intento sigue sin acreditarse, el equipo recibe una alerta y se sigue reintentando.
- RN-7: **Montos con hasta 2 decimales:** Un monto con más decimales se rechaza, nunca se redondea.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Monto fuera de rango (< 10 o > 500, CA-2) | Rechazo indicando los límites | `billetera.recarga.monto_fuera_de_rango` |
| Monto con más de 2 decimales (RN-7) | Rechazo sin redondear | `billetera.recarga.monto_invalido` |
| Intento de doble acreditación (CA-3) | Respuesta idempotente sin duplicar | `billetera.recarga.ya_procesada` |
| Orden de pago expirada (> 15 min, CA-5) | Rechazo invitando a generar un nuevo QR | `billetera.recarga.orden_expirada` |
| Falla en nodo blockchain al acuñar | Estado encolado para reintento automático | `billetera.recarga.procesando_onchain` |

## 5. Fuera de alcance de esta HU

- Pasarela de pago real bancaria (se utiliza QR simulado para fines del proyecto académico).
- Retiro de fondos simulado → HU-16 (en Reserva).
- Subsidios de saldo por organización → HU-15 (en Reserva).

## 6. Dependencias

- **HU-12:** Billetera activa creada.
- **HU-09:** Dispositivo vinculado para firma de peticiones sensibles.

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Criterios CA-1 a CA-6 cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura en backend ≥ 70 %.
- [ ] Pruebas de ataque A-09 (doble acreditación) y A-08 (sin firma de dispositivo) en verde.
- [ ] PR revisado · CI en verde.
- [ ] Documentado en Swagger.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-02 | Creación (borrador) | — |
| 2026-11-02 | Aprobación de spec y plan; QR 10-500 Bs, acuñación idempotente y resolución D-13 | 2026-11-02 · HU-13 Recarga de saldo: spec y plan técnico aprobados (Resuelve D-13) |
| 2026-11-07 | RN-6, RN-7 y caso de monto con más de 2 decimales; los criterios no cambian. Pendiente de aprobación | 2026-11-07 · HU-13: alineación de spec, plan y ssd antes de implementar (Resuelve D-10) |

