# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-10-24

**Sprint actual:** Sprint 1 · 21/10 – 27/10/2026 (sprints de 1 semana, miércoles a martes).

**HU en curso:** HU-02 · Reglas de afiliación. Implementada y probada en local (SP55–SP59); falta PR, revisión de otro integrante, CI en GitHub, despliegue y aceptación del PO. HU-06 y HU-01 ya están en `develop` de los submódulos. Siguiente en el orden de S1: HU-05.

## Última sesión

- Ramas `feat/HU-02-reglas-afiliacion` en `backend` (3 commits), `web` (1 commit) y principal (backlog, roadmap, plan, MEMORY, HEARTBEAT, sin commit), **sin push ni PR**.
- Backend: migración `003` (`dominios_organizacion` con RLS, `organizacion_por_dominio`), `OrganizacionGuard`/`RolOrganizacionGuard`, `GET/PUT /organizaciones/{id}/afiliacion`. Web: pantalla Afiliación.
- Aprobado por el integrante: `DELETE` del rol de la API sobre `dominios_organizacion` (MEMORY 2026-10-24).
- Entorno local: PostgreSQL de `docker compose` en el puerto 5434 (`.env` local). En la BD local quedaron datos de prueba `@hu02web.test`.

## Próximo paso concreto

1. **Subir las ramas y abrir un PR por repositorio** (backend, web) hacia `develop`; después el PR del principal con los punteros y los documentos.
2. **HU-05** (SP60–SP65): registro con correo institucional. Usa `organizacion_por_dominio` y cierra CA-4/CA-5 de HU-02 y CA-7 de HU-06 (`membresias` en `GET /yo`).
3. Propuesta al equipo: `.gitattributes` con `* text=auto eol=lf` (CRLF en Windows rompe `format:verificar` y el arranque de PostgreSQL).
4. Instalar Node 24 LTS en las máquinas.

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
