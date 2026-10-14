# HU-34 · Recuperación de contraseña — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-10-14)` · Épica: E2 Cuentas · Prioridad: Should · PHU: 3 · Sprint: S1
> Requisito del docente que cubre: **1 — multi-cliente** (acceso a la cuenta)
> Amenazas que toca: ninguna del modelo directamente. Recuperar la contraseña no da acceso al dinero: desde S2, las acciones sensibles exigen además el teléfono vinculado y la biometría (A-04, A-11).
> Origen: hueco detectado al especificar el Sprint 1 (ver MEMORY, 2026-10-14).

## 1. Historia

**Como** usuario
**quiero** recuperar el acceso a mi cuenta si olvido mi contraseña
**para** no perder mi cuenta ni mi historial.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | un correo con cuenta en UniRide | la persona pide recuperar su contraseña | recibe en ese correo un código de 6 dígitos que vence en 10 minutos |
| CA-2 | un correo sin cuenta | alguien pide recuperar la contraseña | la pantalla muestra el mismo mensaje que en CA-1 (no revela si la cuenta existe) y no se envía ningún código |
| CA-3 | un código correcto y vigente, y una contraseña nueva que cumple los requisitos | la persona los ingresa | la contraseña cambia, **todas las sesiones abiertas se cierran** y llega un correo avisando del cambio |
| CA-4 | 5 códigos erróneos seguidos | se intenta otro | la recuperación de esa cuenta queda bloqueada 15 minutos |
| CA-5 | un código vencido o ya usado | la persona lo ingresa | el sistema lo rechaza y ofrece enviar uno nuevo |
| CA-6 | una contraseña nueva que no cumple los requisitos | la persona intenta guardarla | el sistema la rechaza indicando el requisito |
| CA-7 | una contraseña recuperada desde otro teléfono (a partir de S2) | esa persona intenta reservar, pagar o verificar un viaje | el sistema no lo permite sin el teléfono vinculado y su biometría |

## 3. Reglas de negocio

- RN-1: Mismas reglas de código que el registro (HU-05): 6 dígitos, un solo uso, 10 minutos, bloqueo de 15 minutos tras 5 errores, un reenvío por minuto y 5 por hora.
- RN-2: Mismos requisitos de contraseña que el registro: al menos 8 caracteres, con al menos una letra y un número.
- RN-3: Al cambiar la contraseña se cierran todas las sesiones de la cuenta (HU-06).
- RN-4: Los mensajes nunca revelan si un correo tiene cuenta.
- RN-5: Recuperar la contraseña no cambia el teléfono vinculado; para cambiar de teléfono existe HU-10.
- RN-6: Cada solicitud y cada cambio de contraseña quedan registrados con fecha y resultado.
- RN-7: Funciona en la app móvil y en el panel web.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje (clave es-BO) |
|---|---|---|
| Correo sin cuenta (CA-2) | Mensaje genérico | `autenticacion.recuperacion.solicitud_enviada` |
| Bloqueo por intentos (CA-4) | Indica cuándo puede reintentar | `autenticacion.otp.bloqueado` |
| Código vencido o usado (CA-5) | Ofrece reenviar | `autenticacion.otp.vencido` |
| Contraseña débil (CA-6) | Rechazo | `autenticacion.registro.contrasena_debil` |
| Falla el servicio de correo | No se cambia nada; el envío se reintenta solo y la pantalla muestra el mismo mensaje genérico de CA-2, para no revelar si la cuenta existe | `autenticacion.recuperacion.solicitud_enviada` |

## 5. Fuera de alcance

- Cambiar la contraseña con la sesión iniciada.
- Recuperación por SMS o por preguntas de seguridad.
- Cambio de teléfono vinculado → HU-10.

## 6. Dependencias

- HU-05, HU-06.

## 7. Definition of Done

Referencia: `SPECS/constitution.md` Art. 12.

- [ ] CA-1 a CA-7 cumplidos (CA-7 se verifica cuando exista HU-09).
- [ ] Pruebas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Pruebas de CA-2 (no revela cuentas) y CA-3 (cierra todas las sesiones) en verde.
- [ ] PR revisado · CI en verde · 7 criterios de calidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Spec actualizada · aceptada por el PO.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-10-14 | Creación (borrador) | Resuelve D-12, D-16, D-20, D-21 |
| 2026-10-14 | Caso borde de correo caído alineado con CA-2 | Diseño (fase Plan) de las HU de S1 |
