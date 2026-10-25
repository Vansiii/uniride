# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-10-25

**Sprint actual:** Sprint 1 · 21/10 – 27/10/2026 (sprints de 1 semana, miércoles a martes).

**HU en curso:** HU-02, HU-05 y HU-03 implementadas y probadas en local (encadenadas: HU-05 sale de HU-02 y HU-03 de HU-05 en el backend). HU-02 subida, PR por abrir; HU-05 y HU-03 sin push. Siguiente en el orden de S1: HU-07.

## Última sesión

- HU-02: `feat/HU-02-reglas-afiliacion` subida en `backend` y `web` (PR por abrir en GitHub; esta PC no tiene `gh`). Documentos del principal en el commit local `1e48d92`.
- HU-05: `feat/HU-05-registro-correo-institucional` en `backend` (`37f1b8e`, sale de la rama de HU-02), `mobile` (`c7fecb7`) y principal (documentos, sin commit). OTP, registro, verificación, reenvío, `GET /yo` con `membresias`, pantallas Registro y Código.
- HU-03: `feat/HU-03-aprobacion-miembros` en `backend` (`798060c`, `8b2cda8`), `web` (`91a26f3`, incluye el menú por rol pendiente de HU-02) y principal.
- Entorno local: PostgreSQL de `docker compose` en el puerto 5434 (`.env` local).

## Próximo paso concreto

1. **Abrir los PR de HU-02** (backend, web) a `develop` y pedir revisión. Cuando se fusionen, actualizar la rama de HU-05 del backend contra `develop` y abrir sus PR (backend, mobile).
2. **Probar HU-05 en Android** (teclado, sesión guardada, estado de membresía) y pedir al PO el texto legal del tratamiento de datos.
3. **HU-07** (SP69–SP72): varias organizaciones; reutiliza `OtpService` (propósito `agregar_organizacion`) y respeta el rechazo definitivo de HU-03.
4. Al fusionarse cada HU, actualizar la siguiente rama contra `develop` (orden: HU-02 → HU-05 → HU-03).
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
