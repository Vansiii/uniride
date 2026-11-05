# HU-07 · Varias organizaciones — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-10-14)` · Épica: E2 Cuentas · Prioridad: Should · PHU: 3 · Sprint: S1
> Requisito del docente que cubre: **1 — multi-cliente**
> Amenazas que toca: **A-13**

## 1. Historia

**Como** usuario
**quiero** pertenecer a varias organizaciones (por ejemplo, la universidad donde estudio y la empresa donde trabajo)
**para** viajar con cada una de mis comunidades.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | una persona con sesión iniciada | agrega otra organización ingresando un correo de esa organización | recibe un código en ese correo con las mismas reglas que el registro (HU-05: 6 dígitos, 10 minutos, bloqueo tras 5 errores) |
| CA-2 | un código correcto | la persona lo ingresa | se crea la nueva membresía, **aprobada** o **pendiente** según el modo de aprobación de esa organización |
| CA-3 | una persona con dos o más membresías | abre la lista de sus organizaciones | ve cada organización con el estado de su membresía y cuál está activa |
| CA-4 | una persona con dos membresías aprobadas | elige otra organización como activa | pasa a ver solo los datos de esa organización, sin cerrar sesión |
| CA-5 | una membresía pendiente o rechazada | la persona intenta elegir esa organización como activa | el sistema no lo permite |
| CA-6 (ataque A-13) | una persona con la organización A activa, aunque también sea miembro de B | pide datos de B sin cambiar de organización activa | el sistema lo rechaza |
| CA-7 | un correo de una organización a la que ya pertenece | la persona intenta agregarla otra vez | el sistema le indica que ya es miembro |

## 3. Reglas de negocio

- RN-1: Para unirse a otra organización hay que probar un correo de esa organización; no basta con pedirlo.
- RN-2: Cada membresía es independiente: su estado y su aprobación dependen solo de su organización.
- RN-3: En cada momento hay una sola organización activa, y solo puede ser una con membresía aprobada.
- RN-4: La identidad verificada, el teléfono vinculado, la billetera y el vehículo son de la persona y le sirven en todas sus organizaciones (D-07).
- RN-5: Cada organización decide si comparte viajes con otras (HU-04); mientras tanto, cada persona solo ve los viajes de su organización activa.
- RN-6: El sistema recuerda la última organización activa para el próximo inicio de sesión.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje (clave es-BO) |
|---|---|---|
| Dominio no afiliado | No se envía código | `autenticacion.registro.organizacion_no_afiliada` |
| Ya es miembro (CA-7) | Aviso | `membresias.agregar.ya_es_miembro` |
| Cambiar a una organización no aprobada (CA-5) | Rechazo | `membresias.activa.no_aprobada` |
| Acceso cruzado (CA-6) | Rechazo | `comun.errores.no_autorizado` |

## 5. Fuera de alcance

- Salir de una organización.
- Viajes compartidos entre organizaciones → HU-04.
- Ver datos de varias organizaciones a la vez.

## 6. Dependencias

- HU-05, HU-06.


## 7. Definition of Done

Referencia: `SPECS/constitution.md` Art. 12.

- [ ] CA-1 a CA-7 cumplidos.
- [ ] Pruebas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Prueba de ataque CA-6 (A-13) en verde.
- [ ] PR revisado · CI en verde · 7 criterios de calidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Spec actualizada · aceptada por el PO.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-10-14 | Creación (borrador) | — |
