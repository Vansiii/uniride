# HU-05 · Registro con correo institucional — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-10-14)` · Épica: E2 Cuentas · Prioridad: Must · PHU: 5 · Sprint: S1
> Requisito del docente que cubre: **1 — multi-cliente**
> Amenazas que toca: **A-13** (la organización se asigna por el dominio, nunca por lo que diga el cliente)

## 1. Historia

**Como** estudiante o empleado
**quiero** registrarme con el correo de mi organización
**para** acceder a los viajes de mi comunidad.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | un correo de un dominio registrado por una organización | la persona se registra con nombre completo, correo y contraseña, y acepta el tratamiento de sus datos | recibe por correo un código de 6 dígitos que vence en 10 minutos |
| CA-2 | un código correcto y vigente | la persona lo ingresa | su cuenta queda creada y su membresía queda **aprobada** o **pendiente** según el modo de aprobación de la organización (HU-02) |
| CA-3 | un correo de un dominio no registrado | la persona intenta registrarse | el sistema le informa que su organización no está afiliada a UniRide y no envía ningún código |
| CA-4 | 5 códigos erróneos seguidos para el mismo correo | la persona intenta un sexto | el registro de ese correo queda bloqueado 15 minutos, aunque el código sea correcto |
| CA-5 | un código vencido | la persona lo ingresa | el sistema lo rechaza y ofrece enviar uno nuevo |
| CA-6 | la persona pide un código nuevo | se envía | el código anterior deja de servir |
| CA-7 | un correo que ya tiene cuenta | alguien intenta registrarse con él | la pantalla muestra el mismo mensaje que un registro normal (no revela si la cuenta existe) y al correo llega un aviso de que ya tiene cuenta |
| CA-8 (ataque A-13) | una petición de registro que indica por su cuenta otra organización distinta de la del dominio | el sistema la procesa | la organización se asigna solo por el dominio del correo; el dato enviado se ignora |
| CA-9 | la persona no acepta el tratamiento de sus datos | intenta continuar | el sistema no permite el registro |

## 3. Reglas de negocio

- RN-1: La organización del nuevo miembro se determina únicamente por el dominio de su correo (HU-02, RN-3).
- RN-2: Código de 6 dígitos, de un solo uso, vigente 10 minutos.
- RN-3: 5 intentos fallidos bloquean el registro de ese correo 15 minutos.
- RN-4: Se puede pedir un código nuevo como máximo una vez por minuto y 5 veces por hora.
- RN-5: La contraseña tiene al menos 8 caracteres, con al menos una letra y un número.
- RN-6: La contraseña nunca se guarda ni se muestra en texto legible.
- RN-7: El consentimiento explícito para el tratamiento de datos personales es obligatorio y queda registrado con fecha (CPE, Ley N.º 164).
- RN-8: Un registro sin código confirmado no crea cuenta: si la persona abandona, puede empezar de nuevo.
- RN-9: El registro y la confirmación funcionan en la app móvil; el panel web lo usan los administradores ya invitados (HU-01).

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje (clave es-BO) |
|---|---|---|
| Dominio no afiliado (CA-3) | No se envía código | `autenticacion.registro.organizacion_no_afiliada` |
| Bloqueo por intentos (CA-4) | Indica cuándo puede reintentar | `autenticacion.otp.bloqueado` |
| Código vencido (CA-5) | Ofrece reenviar | `autenticacion.otp.vencido` |
| Falla el servicio de correo | No se crea nada; se pide reintentar más tarde | `autenticacion.registro.correo_no_disponible` |
| Contraseña débil | Rechazo indicando el requisito | `autenticacion.registro.contrasena_debil` |
| Doble envío del formulario | Un solo código vigente | — |

## 5. Fuera de alcance

- Inicio de sesión → HU-06.
- Aprobación manual de la solicitud → HU-03.
- Afiliarse a una segunda organización → HU-07.
- Verificación de identidad con carnet → HU-08.
- Recuperación de contraseña → HU-34.

## 6. Dependencias

- HU-02.

## 7. Definition of Done

Referencia: `SPECS/constitution.md` Art. 12.

- [ ] CA-1 a CA-9 cumplidos.
- [ ] Pruebas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Prueba de ataque CA-8 (A-13) en verde.
- [ ] PR revisado · CI en verde · 7 criterios de calidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Spec actualizada · aceptada por el PO.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-10-14 | Creación (borrador) | — |
| 2026-10-14 | Límite de reenvíos y requisitos de contraseña definidos; recuperación → HU-34 | Resuelve D-12, D-16, D-20, D-21 |
