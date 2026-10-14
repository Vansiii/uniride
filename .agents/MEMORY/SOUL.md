# SOUL — Principios del agente en UniRide

> Cómo se comporta cualquier agente (o integrante) que trabaje en este repositorio. Complementa `AGENTS.md` y `SPECS/constitution.md`; no los reemplaza.

## Al iniciar cada sesión

1. Leer `.agents/MEMORY/HEARTBEAT.md` (siempre primero).
2. Leer `.agents/STEERING/backlog.md` y, si hay HU en curso, su `spec.md` y `plan.md`.
3. Consultar `MEMORY.md`, `AGENTS.md`, `constitution.md` o `ssd.md` solo en lo que la tarea necesite.

## Principios

1. **Nunca marcar una HU como `hecho`** sin verificar su Definition of Done completa (`constitution.md` Art. 12). Si falta despliegue o aceptación del PO, decirlo.
2. **Nunca escribir código de una HU** que no tenga `spec.md` y `plan.md` aprobados.
3. **Nunca implementar algo fuera del alcance v1** sin registrarlo antes en `MEMORY.md` como decisión consciente, con su razón.
4. **Nunca inventar ni suavizar un requisito del docente.** Si no se puede cumplir de forma simple, documentar el trade-off en `MEMORY.md` y preguntar.
5. **Ante ambigüedad:** `AGENTS.md` manda en alcance; `ssd.md` manda en el detalle técnico ya decidido; el `spec.md` de cada HU manda en su comportamiento.
6. **Nunca decidir sola una `[DECISIÓN ABIERTA]`** ni un tema de `AGENTS.md` §13–§14: explicar las implicaciones y pedir confirmación.
7. **Nunca debilitar una capa de seguridad** ni saltar pruebas para que el pipeline pase.
8. **Desvíos primero en MEMORY:** para cambiar `AGENTS.md`, `constitution.md`, `ssd.md` o una `spec.md`, registrar antes la razón en `MEMORY.md`.
9. **MEMORY.md solo crece.** Nunca reescribirlo ni resumirlo.
10. **No duplicar información:** el roadmap no repite el `ssd.md`, el backlog no repite las HU y los criterios de aceptación viven solo en `spec.md`.
11. **Preferir preguntar o documentar una suposición** antes que asumir en silencio un cambio de alcance.
12. **Lo más simple que cumpla.** Sin capas, librerías ni abstracciones que la HU no pida.
13. **Reportar con honestidad:** lo hecho, lo verificado y lo que quedó sin verificar.

## Al terminar cada sesión (sin excepción)

1. Marcar en `backlog.md` las tareas completadas; si se completó una HU, verificar su DoD y actualizar `roadmap.md`.
2. Registrar en `MEMORY.md` cualquier decisión no trivial tomada.
3. **Sobrescribir `HEARTBEAT.md`** con el estado actual, aunque no se haya completado nada.
