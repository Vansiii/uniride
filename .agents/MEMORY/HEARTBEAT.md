# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-10-24

**Sprint actual:** Sprint 1 · 21/10 – 27/10/2026 (sprints de 1 semana, miércoles a martes).

**HU en curso:** HU-02 y HU-05 implementadas y probadas en local. HU-02: ramas subidas, faltan abrir los PR, la revisión y el merge. HU-05: sin push; su rama del backend sale de la de HU-02. Siguiente en el orden de S1: HU-03.

## Última sesión

- HU-02: `feat/HU-02-reglas-afiliacion` subida en `backend` y `web` (PR por abrir en GitHub; esta PC no tiene `gh`). Documentos del principal en el commit local `1e48d92`.
- HU-05: `feat/HU-05-registro-correo-institucional` en `backend` (`37f1b8e`, sale de la rama de HU-02), `mobile` (`c7fecb7`) y principal (documentos, sin commit). OTP, registro, verificación, reenvío, `GET /yo` con `membresias`, pantallas Registro y Código.
- Entorno local: PostgreSQL de `docker compose` en el puerto 5434 (`.env` local).

## Próximo paso concreto

1. **Abrir los PR de HU-02** (backend, web) a `develop` y pedir revisión. Cuando se fusionen, actualizar la rama de HU-05 del backend contra `develop` y abrir sus PR (backend, mobile).
2. **Probar HU-05 en Android** (teclado, sesión guardada, estado de membresía) y pedir al PO el texto legal del tratamiento de datos.
3. **HU-03** (SP66–SP68): aprobación de miembros; usa `OrganizacionGuard` y las membresías pendientes que crea HU-05.
4. Web: usar `membresias` de `/yo` para mostrar "Afiliación" solo a admins.
5. Propuesta al equipo: `.gitattributes` con `* text=auto eol=lf`; Node 24 LTS en las máquinas.

## Bloqueos activos

- Sin teléfonos Android físicos confirmados (R-02, SP04).
- Pendientes de S0: SP13 (AWS), SP23 (Amoy), SP15–SP17, SP18, SP01, SP03, SP04, SP26, SP10.
- Carga del Sprint 1: 142 h. Si no alcanza, HU-07 y HU-34 pasan a S2.

## Decisiones abiertas que bloquean trabajo

| ID | Bloquea |
|---|---|
| D-09 Staging en AWS | SP13 (propuesta: sin staging) |
| D-13 Biometría en recarga | HU-13 (S2) |
| D-17 Calificación en búsqueda | HU-18 (S2) |

Abiertas sin bloqueo inmediato: D-08 (voz en web), D-10 (cola on-chain), D-15 (criterio de "invulnerable" con el docente).
