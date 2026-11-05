# HU-01 · Alta de organización — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-10-14)` · Épica: E1 Organizaciones · Prioridad: Must · PHU: 3 · Sprint: S1
> Requisito del docente que cubre: **1 — multi-cliente**
> Amenazas que toca: **A-13** (ver o modificar datos de otra organización)

## 1. Historia

**Como** super administrador de UniRide
**quiero** registrar una organización con su tipo (universidad o empresa), su nombre y su administrador inicial
**para** que sus miembros puedan usar UniRide.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | un super administrador con sesión iniciada y un formulario completo (nombre, tipo, precio máximo por viaje, nombre y correo del administrador inicial) | guarda el formulario | la organización queda **activa**, aparece en el listado de organizaciones y su administrador inicial recibe un correo de invitación |
| CA-2 | una organización ya registrada con el nombre "UAGRM" | el super administrador intenta registrar otra con el nombre "uagrm " (otras mayúsculas o espacios) | el sistema la rechaza con el mensaje de nombre duplicado y no crea nada |
| CA-3 | un formulario con algún campo obligatorio vacío, un tipo distinto de universidad o empresa, un precio máximo que no sea mayor que cero o un correo con formato inválido | el super administrador intenta guardarlo | el sistema lo rechaza indicando qué campo corregir y no crea nada |
| CA-4 | un administrador inicial que recibió la invitación | la acepta dentro del plazo de vigencia | queda como administrador de **esa** organización y solo de esa |
| CA-5 | una invitación vencida o ya usada | alguien intenta aceptarla | el sistema la rechaza; el super administrador puede reenviar una nueva |
| CA-6 (ataque A-13) | un administrador de la organización A | intenta ver, listar o modificar datos de la organización B | el sistema lo rechaza y no revela si la organización B existe |
| CA-7 (ataque) | un usuario que no es super administrador (miembro o administrador de organización) | intenta registrar una organización | el sistema lo rechaza |
| CA-8 | el super administrador | consulta el listado de organizaciones | ve nombre, tipo, estado, precio máximo por viaje, administrador inicial, estado de la invitación y fecha de alta |

## 3. Reglas de negocio

- RN-1: Solo el super administrador puede dar de alta organizaciones.
- RN-2: El nombre de la organización es único en toda la plataforma. La comparación ignora mayúsculas y espacios al inicio y al final.
- RN-3: El tipo es **universidad** o **empresa**.
- RN-4: Toda organización nace en estado **activa** y con un único administrador inicial.
- RN-5: Todo dato que pertenezca a una organización queda asociado a ella desde su creación. Ningún administrador accede a datos de otra organización.
- RN-6: La invitación es de un solo uso y vence a las 72 horas.
- RN-7: Si el correo del administrador inicial ya pertenece a una cuenta de UniRide, la invitación suma a esa cuenta el rol de administrador de la nueva organización; no crea una cuenta duplicada.
- RN-8: El alta queda en el registro de auditoría con autor, fecha y resultado.
- RN-9: El precio máximo por viaje, en Bs (1 URC = 1 Bs), es obligatorio y mayor que cero. Ningún viaje de la organización puede cobrar más (HU-17). Desde HU-04 (S4) el administrador de la organización podrá cambiarlo (D-12).
- RN-10: Todos los textos de la pantalla y del correo están en español de Bolivia (es-BO).

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Nombre duplicado (CA-2) | Rechazo; no se crea nada | `organizaciones.alta.nombre_duplicado` |
| Precio máximo vacío, cero o negativo (CA-3) | Rechazo | `organizaciones.alta.precio_maximo_invalido` |
| Falla el servicio de correo | La organización queda creada y la invitación marcada como **no enviada**; el envío se reintenta y el super administrador puede reenviarla | `organizaciones.alta.invitacion_no_enviada` |
| Doble clic o la misma petición enviada dos veces | Se crea una sola organización | — |
| Dos super administradores registran el mismo nombre a la vez | Solo uno lo logra; el otro recibe el error de nombre duplicado | `organizaciones.alta.nombre_duplicado` |
| Correo del administrador con formato inválido | Rechazo (CA-3) | `organizaciones.alta.correo_invalido` |
| Invitación vencida o usada (CA-5) | Rechazo con opción de pedir reenvío | `organizaciones.invitacion.vencida` |
| Acceso de otra organización (CA-6) | Rechazo sin revelar datos | `comun.errores.no_autorizado` |

## 5. Fuera de alcance de esta HU

- Dominios de correo y modo de aprobación de miembros → HU-02.
- Aprobación de miembros → HU-03.
- Cambiar el precio máximo, otras tarifas y viajes entre organizaciones → HU-04.
- Editar, suspender o dar de baja organizaciones.
- Cambiar o agregar administradores después del alta.
- Creación del primer super administrador de la plataforma (se hace con un script de inicialización que define el `plan.md`).
- Verificación de identidad del administrador (HU-08 aplica a conductores y pasajeros).

## 6. Dependencias

- HU / PB: PB-01 (repositorio y CI), PB-02 (modelo de datos multi-tenant).
- Decisiones abiertas que la afectan: ninguna.

## 7. Definition of Done

Se marca al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Criterios CA-1 a CA-8 cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque CA-6 (A-13) y CA-7 en verde.
- [ ] PR revisado por otro integrante.
- [ ] CI en verde (lint, pruebas, build).
- [ ] Correctitud · Eficiencia · Fiabilidad · Facilidad de uso · Mantenimiento · Seguridad e integridad · Portabilidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Esta spec refleja lo realmente construido.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-10-14 | Creación (borrador) | — |
| 2026-10-14 | Vigencia de la invitación = 72 h; precio máximo obligatorio en el alta (D-12) | Resuelve D-12, D-16, D-20, D-21 |
