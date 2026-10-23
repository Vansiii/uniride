# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-10-23

**Sprint actual:** Sprint 1 · 21/10 – 27/10/2026 (sprints de 1 semana, miércoles a martes).

**HU en curso:** HU-01 · Alta de organización. Implementación terminada y probada en local (SP48–SP54); falta PR, revisión de otro integrante, CI en GitHub, despliegue y aceptación del PO. HU-06 sigue con su PR pendiente. Siguiente en el orden de S1: HU-02.

## Última sesión

- Ramas `feat/HU-01-alta-organizacion` en `backend`, `web` y principal, **sin push ni PR** (pide confirmación humana). Salen de `develop`; los PR de HU-06 ya se fusionaron en `develop` (principal #5).
- Backend: `enOrganizacion`/`comoSuperAdmin`, `RolPlataformaGuard`, migración `002` con RLS, cola de correos con worker y reintentos (`CORREO_MODO=consola` en desarrollo), alta/listado/reenvío/consulta/aceptación de invitaciones. Web: Organizaciones, Nueva organización, Aceptar invitación.
- Postgres local en Docker (puerto 5433 en el `.env` del agente): hay que abrir Docker Desktop y `docker compose up -d postgres`; la migración `002` ya está aplicada.

## Próximo paso concreto

1. **Subir las ramas y abrir un PR por repositorio** (backend, web) hacia `develop`; después PR en el principal con los punteros de submódulos. Agregar a los otros cuatro integrantes como colaboradores (sin eso nadie aprueba).
2. **Pedir acceso de producción a SES** (SP13) o verificar los correos del equipo, para probar el envío real de invitaciones.
3. **HU-02** (SP55–SP60): `OrganizacionGuard`, dominios de correo y modo de aprobación. Reutiliza `enOrganizacion` y la tabla `membresias` ya creada.
4. **HU-05** completa la parte pendiente de CA-7 de HU-06 (`GET /yo` aún devuelve `membresias: []`).
5. Instalar Node 24 LTS en las máquinas (el agente usa 22.18 + `npx npm@11`).

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
