# Constitución — cómo se construye UniRide

> Reglas invariantes de **cómo** se construye, no de **qué**. El qué vive en `AGENTS.md` (alcance), `SPECS/roadmap.md` (backlog) y cada `spec.md`. Ninguna regla de este archivo puede contradecir `AGENTS.md`; si aparece un conflicto, gana `AGENTS.md` y este archivo se corrige registrando antes el cambio en `/.agents/MEMORY/MEMORY.md`.

## Art. 1 — Spec primero (SDD dentro de Scrum)

1. Scrum fija la cadencia (Product Backlog, sprints de 1 semana, Planning, Daily, Review, Retrospective). SDD fija cómo se construye cada historia.
2. Cada HU recorre, sin saltarse ninguna, las fases:

   | Fase SDD | Fase de la materia | Artefacto | Aprobación |
   |---|---|---|---|
   | Specify | Análisis | `SPECS/features/HU-xx-slug/spec.md` | Product Owner |
   | Plan | Diseño | `SPECS/features/HU-xx-slug/plan.md` | Equipo (revisión en PR) |
   | Tasks | Sprint Backlog | `.agents/STEERING/backlog.md` | Sprint Planning |
   | Implement | Implementación | Código + commits con ID de HU y tarea | PR revisado |
   | Verify | Prueba | Checklist DoD en el `spec.md` | PO en la Sprint Review |

3. No se escribe código de una HU sin `spec.md` y `plan.md` aprobados. Las tareas de una HU entran al backlog solo cuando su `plan.md` está aprobado.
4. Si la implementación revela que la spec está mal, se corrige la spec (y se registra en `MEMORY.md`) antes que el código. El código se deriva de la spec, nunca al revés.
5. Una HU entra a un sprint solo si cumple la Definition of Ready del documento técnico §2.4 (≤ 8 PHU, dependencias resueltas, amenazas identificadas si toca verificación o billetera).

## Art. 2 — Aislamiento multi-organización (A-13)

1. Todo registro de datos de una organización lleva su `organizacion_id`; toda consulta y operación se filtra por organización.
2. El filtro se aplica en el backend y además PostgreSQL lo refuerza con Row-Level Security. Nunca se confía solo en el cliente.
3. Ningún dato cruza entre organizaciones. La única excepción es la visibilidad de viajes que **ambas** organizaciones autorizan explícitamente (HU-04), y también la decide el servidor.
4. Un endpoint o consulta nueva sin filtro por organización es un defecto y bloquea el PR.
5. Toda HU que toque datos de organización incluye una prueba que intenta leer o modificar datos de otra organización y demuestra que falla.
6. Los datos personales (cuenta, identidad, dispositivo, billetera, vehículo) no llevan `organizacion_id`: son de la persona y se protegen por dueño. Solo la propia persona los ve completos; a terceros se les expone únicamente la proyección mínima que defina la spec (D-07).

## Art. 3 — Verificación no evadible

1. Ninguna funcionalidad de viaje o billetera es accesible sin verificación completa (identidad aprobada + dispositivo vinculado).
2. La validación ocurre siempre en el servidor (o en el contrato). El teléfono solo aporta pruebas firmadas; nunca decide.
3. Nunca se confía en datos ni banderas enviadas por el cliente (`verified: true`, estado del viaje, montos, GPS sin firma).
4. El servidor es dueño de la máquina de estados del viaje (`AGENTS.md` §5.9); no se agregan transiciones ni se saltan estados.
5. Ninguna capa se debilita, ni "temporalmente". El único bypass permitido es el modo emulador de desarrollo: apagado por defecto, controlado por variable de entorno y bloqueado en producción.
6. Toda HU que toque verificación lleva su prueba de ataque automatizada (amenazas A-01 a A-13) que demuestra que el ataque falla.

## Art. 4 — Integridad de la billetera

1. El saldo nunca se edita directamente. Solo cambia mediante transacciones inmutables registradas (libro mayor append-only en PostgreSQL + transacción on-chain).
2. Las transacciones son atómicas e idempotentes: cada operación de dinero lleva una clave de idempotencia y no se ejecuta dos veces aunque la petición se repita.
3. Cualquier operación que no cuadre (saldo insuficiente, monto fuera de rango, escrow ya liberado, viaje no verificado) se rechaza completa; nunca queda a medias.
4. Los viajes no crean saldo: entra por recarga o subsidio y sale por retiro.
5. El escrow solo lo libera la cuenta verificadora, solo para viajes en estado `Verificado` y una sola vez.
6. PostgreSQL y la blockchain se concilian; toda diferencia se reporta.
7. Solo red de prueba (Polygon Amoy o Hardhat local). Nunca mainnet.

## Art. 5 — Voz como complemento

1. Toda acción principal es accesible por voz y también por toque o clic. Ninguna funcionalidad depende únicamente de la voz.
2. La voz nunca autoriza: toda acción que mueve dinero o verifica un viaje pide biometría (A-11).
3. Ante duda de reconocimiento, la app repregunta; nunca adivina.

## Art. 6 — Seguridad y legalidad

1. Autenticación JWT con roles; token de acceso de 15 min y refresh token revocable al cerrar sesión.
2. Contraseñas con hash (bcrypt o argon2), nunca en texto plano.
3. HTTPS obligatorio en toda comunicación.
4. Secretos solo en variables de entorno o en AWS KMS (llaves de billeteras y del verificador). Nunca en el repo, commits, logs, pruebas ni base de datos.
5. Datos personales y biométricos (carnet, rostro, fotos de vehículo): consentimiento explícito, cifrados en S3, uso exclusivo para verificación, nunca en respuestas de API, logs ni mensajes de error. Tratamiento conforme a la Constitución Política del Estado (derecho a la protección de datos, Art. 21 y 130) y a la Ley N.º 164.
6. Licencias de dependencias compatibles con la Ley N.º 1322.

## Art. 7 — Convenciones de código

1. TypeScript en `mobile/`, `web/` y `backend/`; Solidity en `contracts/`. Linter obligatorio (oxlint en `backend/` y `web/`, ESLint en `mobile/`) y Prettier en todas las carpetas; no se desactivan reglas sin justificarlo en el PR.
2. NestJS organizado en un módulo por responsabilidad, con separación controlador / servicio / repositorio, DTOs validados y guards. Todo endpoint se documenta en Swagger.
3. Contratos parten de OpenZeppelin; pequeños y con pruebas Hardhat.
4. Todo en español, incluidos los identificadores (sin tildes ni ñ), salvo los nombres impuestos por frameworks, estándares o herramientas. Convenciones completas en `SPECS/ssd.md` §14.

## Art. 8 — Textos de usuario

Ningún texto visible al usuario se escribe directamente en el código. Todo va a archivos de recursos de idioma `es-BO` (estructura en `SPECS/ssd.md` §12). Esto incluye mensajes de error, correos y respuestas de voz.

## Art. 9 — Trazabilidad

1. IDs: historias `HU-xx` y habilitadores `PB-xx` (los del documento técnico, para no romper la trazabilidad con el modelo de amenazas); tareas `SPxx` en `.agents/STEERING/backlog.md`. Los puntos de historia se llaman **PHU**.
2. Ramas: `feat/HU-xx-slug` (o `feat/PB-xx-slug`) creadas desde `develop` en cada repositorio que la historia toque (principal y submódulos). Sin push directo ni force-push a `main` ni `develop`.
3. Commits: `HU-xx SPyy: descripción` en imperativo y en español, sin coautoría ni firmas de herramientas de IA.
4. Cada tarea del backlog apunta a su HU o PB. Al cerrar cada sprint se crea un tag `sprint-N`.

## Art. 10 — Simplicidad

1. Ante dos soluciones que cumplen el requisito, se elige la más simple. No se agregan capas, librerías ni abstracciones que la HU no necesite.
2. Si un requisito del docente no admite una solución simple, se documenta el trade-off en `MEMORY.md` y se consulta al equipo.

## Art. 11 — Desvíos documentados

Toda decisión de arquitectura que se desvíe de `AGENTS.md`, de esta constitución, de `ssd.md` o de una `spec.md` se registra primero en `MEMORY.md` con su justificación y recién después se modifica el archivo. Nunca al revés.

## Art. 12 — Definition of Done

Una HU está **hecha** solo si cumple todo:

- [ ] Cumple todos sus criterios de aceptación (`spec.md`).
- [ ] Las pruebas automatizadas definidas en su `plan.md` pasan; la lógica de backend mantiene ≥ 70 % de cobertura.
- [ ] Si toca verificación, billetera o aislamiento: su prueba de ataque demuestra que el ataque falla.
- [ ] Pasó revisión de código de otro integrante por pull request.
- [ ] Pasa el pipeline de CI (lint, pruebas, build).
- [ ] Cumple los 7 criterios de calidad de la materia:
  - **Correctitud:** hace lo que dice la spec.
  - **Eficiencia:** respeta las metas (abordaje < 3 s, búsqueda < 2 s) cuando aplica.
  - **Fiabilidad:** ante fallas externas deja estado consistente; operaciones de dinero idempotentes.
  - **Facilidad de uso:** flujo principal ≤ 4 pasos; textos en `es-BO`; alternativa táctil y por voz donde aplica.
  - **Facilidad de mantenimiento:** módulos separados, código revisado, Swagger actualizado.
  - **Seguridad e integridad:** arts. 2, 3, 4 y 6 cumplidos.
  - **Portabilidad:** levanta con Docker y configuración por variables de entorno.
- [ ] Está desplegada en AWS y documentada en Swagger.
- [ ] Su `spec.md` está actualizada con lo realmente construido.
- [ ] El Product Owner la aceptó en la Sprint Review.

Un agente puede dejar listos los puntos técnicos; el despliegue y la aceptación los confirman personas del equipo.
