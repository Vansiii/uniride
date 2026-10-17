# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-10-17

**Sprint actual:** Sprint 0 · 14/10 – 20/10/2026 (sprints de 1 semana, miércoles a martes). Sprint 1 empieza el 21/10.

**HU en curso:** HU-06 · Inicio de sesión. Implementación terminada y probada en local (SP39–SP47); falta PR, revisión de otro integrante, CI en GitHub, despliegue y aceptación del PO. Siguiente en el orden de S1: HU-01.

## Última sesión

- Ramas `feat/HU-06-inicio-sesion` en `backend` (6 commits), `web` (2), `mobile` (1) y principal. **Sin push ni PR** (pide confirmación humana).
- Backend: sesión con JWT + refresh rotativo, bloqueo, auditoría, `JwtGuard` global, `GET /yo`, migración `001` con RLS. Web y mobile: shell, cliente HTTP con renovación, pantalla de inicio de sesión (mobile también estado de membresía).
- Postgres local en Docker (puerto 5433 en el `.env` del agente, ignorado por git).

## Próximo paso concreto

1. **Subir las ramas y abrir un PR por repositorio** (backend, web, mobile) hacia `develop`; después PR en el principal con los punteros de submódulos. El CI del backend ahora necesita su servicio PostgreSQL (ya está en el workflow).
2. **Revisión por otro integrante** y aceptación del PO. Agregar a los otros cuatro integrantes como colaboradores (sin eso nadie aprueba).
3. **HU-01** (SP48–SP54): `enOrganizacion`/`comoSuperAdmin`, migración `002` con RLS, cola de correos, alta e invitaciones. Ahí se completa la parte pendiente de CA-7 de HU-06 junto con HU-05 (`membresias`).
4. Instalar Node 24 LTS en las máquinas (el agente usa 22.18 + `npx npm@11`).

## Bloqueos activos

- Sin teléfonos Android físicos confirmados (R-02, SP04).
- Pendientes de S0: SP13 (AWS), SP23 (Amoy), SP15–SP17, SP18–SP19, SP01, SP03, SP04, SP26, SP10 (falta `docker compose up --build` completo con backend y MinIO).
- Carga del Sprint 1: 142 h. Si no alcanza, HU-07 y HU-34 pasan a S2.

## Decisiones abiertas que bloquean trabajo

| ID | Bloquea |
|---|---|
| D-09 Staging en AWS | SP13 (propuesta: sin staging) |
| D-13 Biometría en recarga | HU-13 (S2) |
| D-17 Calificación en búsqueda | HU-18 (S2) |

Abiertas sin bloqueo inmediato: D-08 (voz en web), D-10 (cola on-chain), D-15 (criterio de "invulnerable" con el docente).
