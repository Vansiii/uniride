# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-10-14 (hora no registrada por el agente)

**Sprint actual:** Sprint 0 · 14/10 – 20/10/2026 (sprints de 1 semana, miércoles a martes) · Objetivo: dejar listo el terreno técnico.

**HU en curso:** ninguna en implementación. Las 8 HU del Sprint 1 tienen spec y plan aprobados y sus tareas (SP39–SP82) ya están en el backlog. PB-01 y PB-04 en progreso; PB-02 y PB-03 pendientes.

## Última sesión

- Repositorio principal `Vansiii/uniride` con cuatro submódulos (`uniride-backend`, `-web`, `-mobile`, `-contracts`), todos públicos y con `main` y `develop` (SP05).
- CI propio en cada subrepositorio, en verde en ambas ramas (SP11).
- `main` y `develop` protegidas con rulesets en los cinco repositorios: PR con 1 aprobación, sin borrado ni force-push; en los subrepositorios, además, CI en verde.
- Desde ahora todo cambio entra por rama `feat/HU-xx-slug` y PR (`AGENTS.md` §8).

## Próximo paso concreto

1. **Agregar a los otros cuatro integrantes como colaboradores** de los cinco repositorios. Sin eso nadie puede aprobar PRs.
2. **Instalar Node 24 LTS** en las máquinas del equipo; la del agente tiene Node 22.18. Clonar con `git clone --recurse-submodules`.
3. **Levantar `docker compose up --build`** con Docker Desktop encendido (SP10).
4. **Pendientes de S0:**
   - SP13 (AWS) y SP23 (desplegar en Amoy: requiere RPC, llave en el keystore y POL de prueba);
   - SP15–SP16 (modelo y prueba de concepto de RLS con Prisma) y SP17 (UML);
   - SP18–SP19 (Figma), SP01 (nombres de PO y SM), SP03 (Trello), SP04 (teléfonos) y SP26 (documento técnico, incluye monorepo → submódulos).

## Bloqueos activos

- Docker Desktop apagado: `docker compose` sin verificar.
- Sin teléfonos Android físicos confirmados (R-02, SP04).
- Carga del Sprint 1: 142 h (unas 28 h por persona). Si no alcanza, HU-07 y HU-34 pasan a S2.

## Decisiones abiertas que bloquean trabajo

| ID | Bloquea |
|---|---|
| D-09 Staging en AWS | SP13 (propuesta: sin staging) |
| D-13 Biometría en recarga | HU-13 (S2) |
| D-17 Calificación en búsqueda | HU-18 (S2) |

Abiertas sin bloqueo inmediato: D-08 (voz en web), D-10 (cola on-chain), D-15 (criterio de "invulnerable" con el docente).
