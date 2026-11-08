# HU-10 · Volver a vincular o cambiar de teléfono — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-08)` · Épica: E3 Verificación de identidad · Prioridad: Must (sube desde Should/Reserva, D-28) · PHU: 5 · Sprint: S3
> **Orden en S3: 1.ª, junto a HU-29.** Sin esta historia, quien registra una huella nueva pierde firmar, billetera, publicar, reservar y verificar viajes, sin salida.
> Requisito del docente que cubre: **2 — Verificación que no se pueda saltar**
> Amenazas que toca: **A-01** (rostro de otra persona), **A-02** (varias cuentas), **A-03** (emulador o app modificada), **A-04** (teléfono robado o prestado), **A-08** (API sin la app)

## 1. Historia

**Como** usuario verificado
**quiero** volver a activar mi teléfono tras registrar una huella nueva, o pasar mi cuenta a un teléfono nuevo, probando que soy yo
**para** no perder mi cuenta sin que nadie más pueda apropiarse de ella.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | una persona que registró una huella nueva en su teléfono (la llave queda anulada por seguridad) | intenta una acción sensible | la app explica «Registraste una huella nueva. Por seguridad, confirma tu identidad para volver a activar este teléfono» y ofrece hacerlo; nunca dice «Actualiza la app» |
| CA-2 | una persona con identidad aprobada, en su teléfono anterior o en uno nuevo | hace la prueba de vida, su rostro coincide con el de su carnet verificado (≥ 90 %), el teléfono pasa la integridad y se crea una llave nueva | el teléfono queda vinculado y el anterior deja de valer, en una sola operación |
| CA-3 | **ataque A-04:** una petición firmada con la llave del teléfono anterior | llega después de volver a vincular | se rechaza con 401 |
| CA-4 | **ataque A-01 / A-04:** alguien que conoce la contraseña e inicia sesión en su propio teléfono | intenta volver a vincular con su rostro, con una foto o con un video | la prueba de vida o la comparación fallan, se rechaza y el teléfono del dueño sigue vinculado |
| CA-5 | **ataque A-02:** un rostro que pertenece a otra cuenta verificada | se intenta volver a vincular | se rechaza |
| CA-6 | **ataque A-03:** un emulador, un teléfono con root o una app modificada | intenta volver a vincular | se rechaza y el teléfono anterior sigue vinculado |
| CA-7 | 3 intentos fallidos seguidos de prueba de vida o comparación | se intenta otra vez | se bloquea durante 24 h, igual que en HU-08 |
| CA-8 | una revinculación aceptada | termina | el dueño recibe un correo con la fecha y el modelo del teléfono y qué hacer si no fue él |
| CA-9 | una reserva o un viaje con llaves de trayecto del teléfono anterior (HU-22 RN-9) | se vuelve a vincular | esas llaves dejan de valer; el teléfono nuevo registra otra en su próxima acción. Saldo, billetera, reservas y viajes no cambian |
| CA-10 | una persona **sin** identidad aprobada (no tiene billetera ni puede viajar) | vuelve a vincular | basta la integridad del teléfono y la llave nueva, como en la primera vinculación (HU-09) |
| CA-11 | la prueba de vida, la comparación o la integridad no responden | se intenta volver a vincular | nada cambia: el teléfono anterior sigue como estaba y se puede reintentar |
| CA-12 | cualquier intento, aceptado o rechazado | termina | queda en auditoría con fecha, cuenta, modelo y resultado, sin imágenes ni datos biométricos |

## 3. Reglas de negocio

- RN-1: **Un solo teléfono activo** por cuenta (HU-09 RN-3). Volver a vincular reemplaza al anterior; nunca quedan dos activos.
- RN-2: **Prueba de identidad para reemplazar:** prueba de vida (confianza ≥ 85) + similitud ≥ 90 % con la foto del carnet de su verificación aprobada (umbrales de HU-08).
- RN-3: **La llave sigue anulándose con cada huella nueva** (HU-09 RN-2, A-04): así una persona que sabe el PIN del dueño no puede agregar su huella y firmar en su nombre.
- RN-4: **Bloqueo:** 3 fallos seguidos → 24 h (HU-08).
- RN-5: **Aviso por correo** al dueño en cada revinculación aceptada.
- RN-6: El teléfono anterior se conserva inactivo en el historial (auditoría); su llave nunca vuelve a valer.
- RN-7: Las fotos de la prueba de vida se usan solo para comparar y no se guardan (`AGENTS.md` §11).

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Llave anulada por huella nueva (CA-1) | Ofrece volver a vincular | `dispositivo.llave_anulada.explicacion` |
| Teléfono sin la llave (teléfono nuevo o app reinstalada) | Ofrece volver a vincular | `dispositivo.revincular.telefono_nuevo` |
| Rostro no coincide (CA-4, CA-5) | Rechazo; cuenta un intento | `dispositivo.revincular.rostro_no_coincide` |
| Prueba de vida fallida | Rechazo; cuenta un intento | `identidad.verificacion.liveness_fallida` |
| Bloqueo por intentos (CA-7) | Rechazo con la hora de desbloqueo | `identidad.verificacion.intentos_agotados` |
| Integridad fallida (CA-6) | Rechazo | `dispositivo.vinculacion.no_integro` |
| Servicio externo caído (CA-11) | Nada cambia; reintentar | `dispositivo.vinculacion.servicio_no_disponible` |
| Sin biometría registrada en el teléfono | No se puede crear la llave | `comun.biometria.sin_registrar` |

## 5. Fuera de alcance de esta HU

- Recuperar una cuenta sin la contraseña → HU-34 (ya existe).
- Varias cuentas en el mismo teléfono (alias de llave por cuenta): sigue como decisión abierta de HU-09.
- Que el dueño bloquee su cuenta a distancia desde el correo de aviso.
- Cambiar el carnet o volver a verificar la identidad desde cero.

## 6. Dependencias

- HU / PB: HU-09 (vinculación, llave e integridad), HU-08 (prueba de vida, comparación, bloqueo y foto del carnet guardada), HU-34/HU-06 (iniciar sesión con contraseña), notificaciones (correo).
- Decisiones resueltas: **D-28** (08/11): HU-10 sube a S3 como la salida a la llave anulada.
- Riesgo: la prueba de vida nativa de HU-08 todavía está pendiente en la app; esta historia usa el mismo flujo que HU-08, así que hereda ese pendiente. Play Integrity sigue simulada en desarrollo.

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque A-01, A-02, A-03, A-04 y A-08 en verde.
- [ ] En teléfono Android físico: registrar una huella nueva, ver el mensaje correcto y volver a vincular.
- [ ] PR revisado por otro integrante.
- [ ] CI en verde (lint, pruebas, build).
- [ ] Correctitud · Eficiencia · Fiabilidad · Facilidad de uso · Mantenimiento · Seguridad e integridad · Portabilidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Esta spec refleja lo realmente construido.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-08 | Creación (borrador); sube de Reserva a S3 | 2026-11-08 · Resuelve D-28: HU-10 sube a S3 |
| 2026-11-08 | Aprobada por el PO | 2026-11-08 · Specs del Sprint 3 aprobadas |
