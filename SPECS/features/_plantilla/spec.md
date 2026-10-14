# HU-xx · {Nombre corto} — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, **sin tecnología**. Copiar a `SPECS/features/HU-xx-slug/spec.md`.
> Estado: `borrador` | `aprobada por PO (fecha)` · Épica: Ex · Prioridad: Must/Should/Could · PHU: x · Sprint: Sx
> Requisito del docente que cubre: {1 multi-cliente / 2 verificación / 3 billetera / 4 interfaz con voz / ninguno}
> Amenazas que toca: {A-xx, … / ninguna}

## 1. Historia

**Como** {actor}
**quiero** {acción}
**para** {beneficio}.

## 2. Criterios de aceptación

Cada criterio tiene al menos una prueba automatizada (se mapea en `plan.md` §6).

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | {contexto} | {acción} | {resultado observable} |
| CA-2 | | | |

Si toca organización, verificación o billetera, incluir al menos un criterio de **ataque** ("Dado un atacante que…, cuando…, entonces el sistema rechaza…").

## 3. Reglas de negocio

- RN-1: {regla, con números concretos: límites, plazos, porcentajes}.
- RN-2:

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| {servicio externo caído} | {estado consistente, nada a medias} | `{modulo.pantalla.error}` |
| {petición repetida} | {idempotente} | |
| {dato de otra organización} | {rechazo} | |

## 5. Fuera de alcance de esta HU

- {qué no hace, y qué HU lo cubre si existe}

## 6. Dependencias

- HU / PB: {HU-xx}
- Decisiones abiertas que la afectan: {D-xx / ninguna}

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Prueba de ataque en verde (si toca verificación, billetera o aislamiento).
- [ ] PR revisado por otro integrante.
- [ ] CI en verde (lint, pruebas, build).
- [ ] Correctitud · Eficiencia · Fiabilidad · Facilidad de uso · Mantenimiento · Seguridad e integridad · Portabilidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Esta spec refleja lo realmente construido.
- [ ] Aceptada por el PO en la Sprint Review ({fecha}).

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| | Creación | |
