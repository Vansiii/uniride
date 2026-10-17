---
name: hu-sdd
description: Crear o avanzar la spec, el plan y las tareas de una historia (HU-xx / PB-xx) con Spec-Driven Development. Usar cuando se pida especificar, planificar o desglosar una HU, o antes de implementar una HU sin spec/plan aprobados.
---

# HU → spec → plan → tareas

Argumento: id de la HU (`HU-12`). Reglas: `SPECS/constitution.md` Art. 1.

1. Ubicar la HU en `SPECS/roadmap.md` y en el documento técnico (`UniRide — Documentación del Proyecto (Scrum).md`). Si ya existe `SPECS/features/HU-xx-slug/`, continuar desde ahí.
2. **Specify**: copiar `SPECS/features/_plantilla/spec.md` a `SPECS/features/HU-xx-slug/spec.md` (slug en español, sin tildes). Rellenar sin tecnología: criterios Dado/Cuando/Entonces, reglas con números concretos, casos borde, fuera de alcance, requisito del docente (1–4) y amenazas A-xx. Si toca organización, verificación o billetera, incluir un criterio de **ataque**. Estado: `borrador`.
3. **Parar**: la spec la aprueba el PO. No pasar al plan sin esa aprobación explícita del usuario.
4. **Plan**: copiar `_plantilla/plan.md`. Reutilizar lo existente (leer `backend/src`, `ssd.md` §4–§8). Mapear cada criterio y amenaza a una prueba (§6). Marcar si hay migración destructiva/RLS, contrato desplegado, escrow, máquina de estados o dependencias nuevas: exigen confirmación humana (`AGENTS.md` §14). Estado: `borrador`.
5. **Parar**: el plan lo aprueba el equipo vía PR.
6. **Tasks**: solo con plan aprobado, copiar la tabla §8 a `.agents/STEERING/backlog.md` como `- [ ] SPxx · tarea — Xh — @responsable`, continuando la numeración.
7. Si no hay spec+plan aprobados, no escribir código de la HU. Si la spec resulta errónea, corregirla y registrarlo en `MEMORY.md` antes que el código.
8. Las decisiones abiertas (`D-xx`) que afecten la HU se listan; no se deciden solas.

Rama: `feat/HU-xx-slug` desde `develop`, en cada repo tocado. Commits: `HU-xx SPyy: descripción`, en español, sin coautoría.
