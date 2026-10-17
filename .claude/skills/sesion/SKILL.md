---
name: sesion
description: Abrir o cerrar una sesión de trabajo en UniRide siguiendo el harness (HEARTBEAT, backlog, MEMORY). Usar al empezar a trabajar, al terminar, o cuando el usuario diga "inicia/cierra la sesión", "retoma", "dónde quedamos".
---

# Sesión UniRide

Argumento: `inicio` (por defecto) o `cierre`. Fuente: `.agents/MEMORY/SOUL.md`.

## inicio
1. Leer `.agents/MEMORY/HEARTBEAT.md` (siempre primero), luego `.agents/STEERING/backlog.md`.
2. Si hay HU en curso: leer su `SPECS/features/HU-xx-slug/spec.md` y `plan.md`.
3. Leer `MEMORY.md`, `AGENTS.md`, `constitution.md` o `ssd.md` solo en lo que la tarea pida.
4. Informar en ≤ 5 líneas: sprint, HU en curso, bloqueos, próximo paso. Confirmar la rama con `git branch --show-current`.

## cierre (sin excepción)
1. Marcar `[x]` en `backlog.md` las tareas completadas (con `· @agente dd/mm`). Si cerró una HU, verificar su DoD (skill `verificar-hu`) y actualizar `SPECS/roadmap.md`.
2. **Agregar** a `MEMORY.md` toda decisión no trivial (`## AAAA-MM-DD · Título` + Decisión, Razón, Archivos). Solo se añade al final; nunca reescribir ni resumir. Resolver una `D-xx` = entrada nueva "Resuelve D-xx".
3. **Sobrescribir** `HEARTBEAT.md`: fecha, sprint, HU en curso, última sesión, próximo paso concreto, bloqueos, decisiones abiertas.
4. Reportar con honestidad lo hecho, lo verificado y lo que quedó sin verificar. No commitear sin que el usuario lo pida.
