# HU-02 · Reglas de afiliación — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-10-14)` · Épica: E1 Organizaciones · Prioridad: Must · PHU: 3 · Sprint: S1
> Requisito del docente que cubre: **1 — multi-cliente**
> Amenazas que toca: **A-13**

## 1. Historia

**Como** administrador de organización
**quiero** definir los dominios de correo válidos (por ejemplo `@uagrm.edu.bo`) y si la aprobación de nuevos miembros es automática o manual
**para** controlar quién entra a mi organización.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | un administrador de la organización A | registra uno o más dominios válidos | los dominios quedan asociados a A y desde ese momento los correos de esos dominios pueden registrarse en A (HU-05) |
| CA-2 | un dominio ya asociado a otra organización | el administrador de A intenta registrarlo | el sistema lo rechaza sin revelar a qué organización pertenece |
| CA-3 | un dominio de correo público (por ejemplo `gmail.com`) o con formato inválido | el administrador intenta registrarlo | el sistema lo rechaza |
| CA-4 | la organización A con aprobación **manual** | una persona completa su registro con un correo de A | su membresía queda en estado **pendiente** y no puede usar viajes ni billetera hasta que la aprueben (HU-03) |
| CA-5 | la organización A con aprobación **automática** | una persona completa su registro con un correo de A | su membresía queda **aprobada** |
| CA-6 | la organización A con un solo dominio | el administrador intenta quitarlo | el sistema lo impide: debe quedar al menos un dominio |
| CA-7 (ataque A-13) | un administrador de la organización A | intenta ver o cambiar los dominios o el modo de aprobación de la organización B | el sistema lo rechaza |
| CA-8 | un administrador que cambia dominios o modo de aprobación | guarda el cambio | queda registrado con autor, fecha, valor anterior y valor nuevo |

## 3. Reglas de negocio

- RN-1: Solo los administradores de una organización configuran sus reglas de afiliación.
- RN-2: Un dominio pertenece a una sola organización en toda la plataforma (si no, un correo no sabría a qué organización afiliarse).
- RN-3: La coincidencia de dominio es exacta y no distingue mayúsculas: `est.uagrm.edu.bo` no es lo mismo que `uagrm.edu.bo`; hay que registrar cada uno.
- RN-4: No se aceptan dominios de correo públicos: gmail.com, hotmail.com, outlook.com, yahoo.com e icloud.com.
- RN-5: El modo de aprobación por defecto al crear una organización es **manual** (la opción más segura).
- RN-6: Cambiar el modo de aprobación solo afecta a los registros futuros; las solicitudes pendientes siguen pendientes.
- RN-7: Quitar un dominio no afecta a los miembros ya aprobados; solo impide registros nuevos con ese dominio.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje (clave es-BO) |
|---|---|---|
| Dominio de otra organización (CA-2) | Rechazo sin revelar el dueño | `organizaciones.afiliacion.dominio_no_disponible` |
| Dominio público o inválido (CA-3) | Rechazo | `organizaciones.afiliacion.dominio_invalido` |
| Quitar el último dominio (CA-6) | Rechazo | `organizaciones.afiliacion.minimo_un_dominio` |
| Dominio repetido en la misma organización | Se ignora, sin duplicar | — |
| Dos organizaciones registran el mismo dominio a la vez | Solo una lo logra | `organizaciones.afiliacion.dominio_no_disponible` |

## 5. Fuera de alcance

- Aprobar o rechazar solicitudes → HU-03.
- Tarifas y viajes entre organizaciones → HU-04.
- Afiliación por invitación individual o por lista de correos.

## 6. Dependencias

- HU-01.

## 7. Definition of Done

Referencia: `SPECS/constitution.md` Art. 12.

- [ ] CA-1 a CA-8 cumplidos.
- [ ] Pruebas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Prueba de ataque CA-7 (A-13) en verde.
- [ ] PR revisado · CI en verde · 7 criterios de calidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Spec actualizada · aceptada por el PO.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-10-14 | Creación (borrador) | — |
| 2026-10-14 | Lista de dominios públicos definida | Resuelve D-12, D-16, D-20, D-21 |
