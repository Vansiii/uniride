# HU-06 · Inicio de sesión — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-10-14)` · Épica: E2 Cuentas · Prioridad: Must · PHU: 3 · Sprint: S1
> Requisito del docente que cubre: **1 — multi-cliente** (base de acceso para todos los roles)
> Amenazas que toca: ninguna del modelo directamente; es la base sobre la que HU-09 agrega la firma del dispositivo (A-08)

## 1. Historia

**Como** usuario
**quiero** iniciar sesión de forma segura
**para** usar la app sin repetir el registro.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | una cuenta creada (HU-05) | la persona ingresa su correo y contraseña correctos | inicia sesión y entra a la pantalla de su organización activa |
| CA-2 | un correo inexistente o una contraseña incorrecta | intenta iniciar sesión | el sistema responde "correo o contraseña incorrectos", sin decir cuál de los dos falló |
| CA-3 | una sesión iniciada | pasan 15 minutos | el acceso se renueva solo, sin pedir la contraseña, mientras la sesión siga vigente |
| CA-4 | una sesión iniciada | la persona cierra sesión | la sesión queda revocada: no puede renovarse aunque alguien conserve sus credenciales de sesión |
| CA-5 | una credencial de renovación ya usada o revocada | alguien intenta renovar con ella | el sistema la rechaza y cierra todas las sesiones de esa cuenta |
| CA-6 | 5 intentos fallidos seguidos | se intenta otra vez | el inicio de sesión de esa cuenta queda bloqueado 15 minutos |
| CA-7 | una persona con membresía **pendiente** o **rechazada** | inicia sesión | entra, pero solo ve el estado de su solicitud; no accede a viajes ni billetera |
| CA-8 | un acceso vencido | se usa para pedir datos | el sistema lo rechaza |
| CA-9 | cualquier cuenta | se revisa lo que el sistema guarda | la contraseña nunca está en texto legible |
| CA-10 | una sesión en la app móvil con 30 días sin ingresar la contraseña (7 días en el panel web) | se intenta renovar el acceso | el sistema lo rechaza y pide iniciar sesión de nuevo |

## 3. Reglas de negocio

- RN-1: El acceso dura 15 minutos y se renueva con una credencial de renovación revocable.
- RN-2: Duración máxima de la sesión sin volver a ingresar la contraseña: **30 días en la app móvil** y **7 días en el panel web** (D-16). Desde HU-09, la sesión de 30 días exige además la firma del teléfono vinculado.
- RN-3: Cada renovación entrega una credencial nueva e invalida la anterior.
- RN-4: Los mensajes de error no revelan si un correo está registrado.
- RN-5: El inicio de sesión funciona en la app móvil y en el panel web; los administradores de organización y el super administrador entran por el panel web.
- RN-6: Si la persona pertenece a varias organizaciones, entra con la última organización activa (HU-07).
- RN-7: Cada inicio de sesión, cierre y bloqueo queda registrado con fecha y resultado.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje (clave es-BO) |
|---|---|---|
| Credenciales incorrectas (CA-2) | Rechazo genérico | `autenticacion.sesion.credenciales_invalidas` |
| Cuenta bloqueada (CA-6) | Indica cuándo puede reintentar | `autenticacion.sesion.bloqueada` |
| Reuso de renovación (CA-5) | Cierra todas las sesiones | `autenticacion.sesion.expirada` |
| Membresía pendiente (CA-7) | Pantalla de estado | `membresias.estado.pendiente` |
| Sin conexión | Mensaje claro; nada se guarda a medias | `comun.errores.sin_conexion` |

## 5. Fuera de alcance

- Vinculación del teléfono y firma de peticiones → HU-09.
- Confirmación biométrica → HU-29.
- Cambio de organización activa → HU-07.
- Recuperación de contraseña → HU-34. Cambio de contraseña con sesión iniciada: fuera de v1.

## 6. Dependencias

- HU-05.

## 7. Definition of Done

Referencia: `SPECS/constitution.md` Art. 12.

- [ ] CA-1 a CA-10 cumplidos.
- [ ] Pruebas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Pruebas de CA-4, CA-5 y CA-8 (sesión revocada, reuso, acceso vencido) en verde.
- [ ] PR revisado · CI en verde · 7 criterios de calidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Spec actualizada · aceptada por el PO.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-10-14 | Creación (borrador) | — |
| 2026-10-14 | Bloqueo tras 5 intentos; sesión de 30 días en móvil y 7 en web (D-16), CA-10 | Resuelve D-12, D-16, D-20, D-21 |
