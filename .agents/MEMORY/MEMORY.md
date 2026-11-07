# MEMORY — Bitácora de decisiones de UniRide

> **Solo crece (append).** Nunca se reescribe, resume ni borra. Para corregir algo, agregar una entrada nueva que referencie la anterior. Formato: `## AAAA-MM-DD · Título` + Decisión/evento, Razón, Archivos afectados.
> Al cerrar cada sprint se agrega un resumen de Sprint Review y Retrospective (insumo para el documento al docente).
> Las decisiones abiertas se identifican como `D-xx`; cuando se resuelven, se agrega una entrada "Resuelve D-xx".

---

## 2026-10-14 · Creación del harness Scrum + SDD

**Decisión/evento:** Se crea el andamiaje operativo del proyecto antes de escribir código: `SPECS/` (misión, constitución, roadmap, SSD, plantillas de feature) y `.agents/` (MEMORY, HEARTBEAT, SOUL, backlog).

**Razón:** Scrum (exigido por el docente) fija la cadencia; Spec-Driven Development fija cómo se construye cada HU: Specify (Análisis) → Plan (Diseño) → Tasks (Sprint Backlog) → Implement → Verify (Prueba). La spec es la fuente de verdad y el código se deriva de ella. Permite a cualquier agente o integrante retomar el contexto sin releer el historial.

Jerarquía ante ambigüedad: `AGENTS.md` (alcance) → documento técnico del Grupo 4 (si contradice a `AGENTS.md`, gana el documento y se corrige `AGENTS.md`) → `ssd.md` (detalle técnico decidido) → `spec.md` de la HU (comportamiento).

Las tareas viven solo en `.agents/STEERING/backlog.md`; no hay `tasks.md` por HU.

**Archivos afectados:** `SPECS/mision.md`, `SPECS/constitution.md`, `SPECS/roadmap.md`, `SPECS/ssd.md`, `SPECS/features/_plantilla/{spec,plan}.md`, `.agents/MEMORY/{MEMORY,HEARTBEAT,SOUL}.md`, `.agents/STEERING/backlog.md`.

---

## 2026-10-14 · Convenciones de IDs, ramas y commits

**Decisión:**
- Se conservan los IDs del documento técnico `HU-xx` y `PB-xx` (con guion) en lugar de `HUxx`, para no romper la trazabilidad con el modelo de amenazas (A-01…A-13) y el backlog del documento.
- Tareas del Sprint Backlog: `SPxx`. Para evitar la colisión con la columna "SP" (story points) del documento técnico, los puntos de historia se llaman **PHU** en el harness.
- Ramas `feat/HU-xx-slug` y commits `HU-xx SPyy: descripción`, según la instrucción del equipo al crear el harness.

**Razón:** Desvío menor respecto al documento técnico §2.8, que usa ramas `feature/HU-xx`. Se registra aquí antes de aplicarlo (constitución Art. 11). Pendiente: proponer al equipo actualizar `AGENTS.md` §8 y el documento técnico con este formato.

**Archivos afectados:** `SPECS/constitution.md` Art. 9, `SPECS/ssd.md` §14.

---

## 2026-10-14 · Reglas nuevas de la constitución no presentes en AGENTS.md

**Decisión:** La constitución agrega, sin contradecir `AGENTS.md`:
1. Textos visibles al usuario solo en archivos de recursos `es-BO` (Art. 8).
2. Tratamiento de datos conforme a la CPE y la Ley N.º 164 (Art. 6), además de la Ley N.º 1322 ya citada.
3. Separación controlador / servicio / repositorio en NestJS (Art. 7).
4. Aislamiento: "ningún dato cruza entre organizaciones" se redacta con la única excepción que el documento técnico ya prevé (§1.5 y HU-04: cada organización decide si comparte viajes con otras), aplicada por el servidor.

**Razón:** Instrucciones del equipo al crear el harness; el punto 4 resuelve la tensión entre la regla de aislamiento total y HU-04.

**Archivos afectados:** `SPECS/constitution.md`, `SPECS/ssd.md` §5, §12.

---

## 2026-10-14 · Trade-off: "verificación invulnerable"

**Decisión:** Se adopta el criterio medible del documento técnico §3.2: (1) ninguna acción dependiente de verificación se ejecuta sin que el servidor valide todas las capas; (2) cada amenaza A-01…A-13 tiene una prueba automatizada que demuestra que falla; (3) el escrow rechaza liberaciones que no vengan de la cuenta verificadora.

**Razón:** Ningún sistema real es absolutamente invulnerable; prometerlo sin evidencia es atacable en la defensa. El criterio medible es la solución más simple que demuestra el requisito. Requiere aceptación explícita del docente → **D-15**.

**Archivos afectados:** `SPECS/ssd.md` §9.

---

## 2026-10-14 · Propuestas técnicas pendientes de aprobación (PB-02 / PB-04)

**Decisión:** `ssd.md` incluye como **Propuesta** (diseño más simple compatible con las fuentes, no decidido):
- Modelo de datos y endpoints derivados de las HU (§6, §8).
- RLS con `SET LOCAL app.organization_id` por transacción y rol de BD sin privilegios de dueño (§5).
- URC con `ERC20Permit` + `AccessControl` para que el relayer pague el gas; escrow con `VERIFIER_ROLE` y `bookingId` de un solo uso (§10).
- Tres llaves KMS secp256k1: por usuario, relayer y verificador (§10).
- Cola on-chain como tabla PostgreSQL `onchain_jobs`, sin servicios extra (§10, D-10).
- i18n con un JSON plano por cliente y helper `t()`, sin librería (§12).

**Razón:** Dar al equipo un punto de partida concreto en PB-02/PB-04 sin decidir por él.

**Archivos afectados:** `SPECS/ssd.md`.

---

## 2026-10-14 · Registro inicial de decisiones abiertas

| ID | Tema | Opciones / problema | Bloquea | Fuente |
|---|---|---|---|---|
| D-01 | ORM del backend | Prisma o TypeORM. Afecta cómo se aplica `SET LOCAL` para RLS por transacción | SP02, SP10, HU-01 | `AGENTS.md` §13 |
| D-02 | Despliegue del backend | AWS App Runner (más simple) o EC2 (más control/costo) | SP08 | `AGENTS.md` §13 |
| D-03 | Herramienta de backlog | Jira o Trello | SP16 | `AGENTS.md` §13 |
| D-04 | Roles Scrum y responsables | PO, Scrum Master y responsables por área | Aprobación de specs, asignación de tareas | `AGENTS.md` §13 |
| D-05 | Versiones exactas del stack | Se fijan en PB-01 con la LTS/estable vigente | SP02–SP05 | No definido |
| D-06 | Herramientas de prueba web y móvil | Propuesta: Vitest + Testing Library (web), Jest con preset Expo (móvil) | SP03, SP04, SP06 | No definido |
| D-07 | Registros de alcance plataforma | `AGENTS.md` §5.3 dice "todo registro lleva organization_id", pero usuario, dispositivo, identidad, billetera y vehículo son únicos por persona (un CI, un rostro, una placa) y la persona puede estar en varias organizaciones (HU-07) | SP10 (PB-02) | Tensión `AGENTS.md` ↔ documento técnico |
| D-08 | Voz en el panel web | El documento solo define voz en la app móvil (Android). ¿Los paneles admin también llevan voz (p. ej. Web Speech API) o el requisito 4 se cumple solo en móvil? | HU de web | Requisito 4 del docente |
| D-09 | Entornos AWS | ¿Solo un entorno de demo o también staging? ¿Panel web en S3 o junto al backend? Impacta costos (R-03) | SP08 | No definido |
| D-10 | Cola de reintentos on-chain | **Resuelta el 07/11:** tabla PostgreSQL + worker (entrada "HU-13: alineación") | HU-13 | `ssd.md` §10 |
| D-11 | HU-17 (S1) antes que HU-08 (S2) | HU-08 y la constitución exigen verificación para publicar, pero publicar viaje está en S1 y la verificación en S2. Opciones: mover HU-17 a S2; o implementarla en S1 con el `VerifiedMemberGuard` activado desde S2 (no se despliega a usuarios reales antes) | HU-17 | Documento técnico §4–§6 |
| D-12 | Tope de precio en HU-17 | HU-17 exige "precio ≤ tope de la organización", pero las tarifas se configuran en HU-04 (S4). Propuesta: campo `price_cap_urc` cargado en el alta (HU-01) | HU-17 | Documento técnico §6 |
| D-13 | Biometría en recarga (HU-13, S2) | HU-29 (S3) pide biometría para recargar. Propuesta: la firma con la llave biométrica de HU-09 ya cubre la recarga; HU-29 completa la UI y la regla para voz | HU-13 | Documento técnico §6 |
| D-14 | Fechas de sprints | S0 = 12–18/10 (AGENTS) + sprints de 2 semanas consecutivos da S3 hasta 29/11 y S4 hasta 13/12, pero el documento fija Release 1.0 el 22/11 y 2.0 el 06/12. Falta además la fecha de defensa | Calendario de roadmap | `AGENTS.md` §2 ↔ documento §4 |
| D-15 | Criterio de "invulnerable" | Que el docente acepte el criterio medible del documento §3.2 | Defensa | Documento §3.2 |
| D-16 | Duración del refresh token | No definida (solo el access token = 15 min) | HU-06 | No definido |
| D-17 | Calificación en HU-18 | Los resultados de búsqueda muestran calificación, pero HU-21 (calificaciones) está en Reserva. Opciones: ocultar hasta HU-21 o subir HU-21 | HU-18 | Documento §5–§6 |
| D-18 | 50 % retenido en cancelación tardía | HU-20: si el pasajero cancela con < 30 min recibe el 50 %. No se define a dónde va el otro 50 % (¿al conductor?) | HU-20, PB-04 (función `refund`) | Documento §6 |
| D-19 | Idioma de identificadores | Propuesta: inglés en código; español en textos de usuario y documentación | SP02–SP05 | `AGENTS.md` §7 |

**Archivos afectados:** `SPECS/ssd.md`, `SPECS/roadmap.md`, `.agents/MEMORY/HEARTBEAT.md`.

---

## 2026-10-14 · Resuelve D-01, D-02, D-03, D-04, D-06, D-11, D-14, D-18 y D-19

**Decisiones del equipo:**

| ID | Resolución |
|---|---|
| D-01 | ORM: **Prisma**. RLS por transacción con `$transaction` + `set_config('app.organizacion_id', …, true)`; las políticas RLS van en SQL dentro de las migraciones de Prisma (Prisma no las modela). |
| D-02 | El equipo delegó "el más conveniente". Se elige **EC2**: AWS App Runner cerró a clientes nuevos el 30/04/2026 (aviso oficial de AWS), así que no es viable para una cuenta nueva. ECS Express Mode se descarta: es un servicio fuera del stack de `AGENTS.md` y suma el costo de un balanceador. En EC2 corre el mismo `docker compose` que en local (portabilidad), con Caddy como proxy para HTTPS automático y para servir el panel web. |
| D-03 | Herramienta de backlog: **Trello**. |
| D-04 | Todos los integrantes desarrollan. Para cumplir Scrum y la DoD, un integrante figura como **PO nominal** y otro como **Scrum Master nominal**, solo para aprobar specs, aceptar historias y la documentación; ambos programan igual que el resto. Nombres: `[POR DEFINIR]`. |
| D-06 | Pruebas: **Vitest + Testing Library** (web) y **Jest con preset de Expo** (móvil). |
| D-11 | **HU-17 pasa a S2**, junto con HU-08; nunca se publica un viaje sin verificación. |
| D-14 | **Sprints de 1 semana** desde el 14/10/2026 (miércoles a martes), con **5 sprints** y el mismo alcance: S0 14–20/10, S1 21–27/10, S2 28/10–03/11, S3 04–10/11 (Release 1.0), S4 11–17/11 (Release 2.0). |
| D-18 | Cancelación tardía del pasajero (< 30 min): 50 % al pasajero y **50 % al conductor**. `reembolsar` del escrow reparte entre pasajero y conductor. |
| D-19 | **Todo en español**, incluidos los identificadores de código. Excepción: nombres impuestos por frameworks, estándares o herramientas (sufijos de NestJS como `Service`, `Controller`, `Module`, `Guard` y `Dto`; funciones ERC-20 como `balanceOf` y `permit`; variables estándar como `NODE_ENV`, `DATABASE_URL` y `AWS_REGION`; prefijos `VITE_` y `EXPO_PUBLIC_`). Identificadores sin tildes ni ñ (`contrasena`, `anio`). |

**Riesgo nuevo (trade-off de D-14):** el mismo alcance (146 PHU) pasa de 9 a 5 semanas, unos 29 PHU por semana para 5 personas, y R-05 (velocidad baja) sube a crítico. Mitigación: medir la velocidad al cerrar S1 y aplicar la regla del documento (mover los *Should* de S4 a Reserva). Si aun así no alcanza, el PO repriorizará los *Must* con el docente. Tras D-11, S1 queda con 23 PHU y S2 con 39.

**Pendiente:** el documento técnico del Grupo 4 (§2 y §4) todavía dice sprints de 2 semanas y App Runner o EC2. Lo debe actualizar el equipo, porque `AGENTS.md` lo declara fuente de verdad.

**Siguen abiertas:** D-05, D-07, D-08, D-09, D-10, D-12, D-13, D-15, D-16, D-17.

**Archivos afectados:** `AGENTS.md` §1, §2, §4, §7, §13; `SPECS/constitution.md` Art. 1 y 7; `SPECS/roadmap.md`; `SPECS/ssd.md` (completo, por D-19); `.agents/STEERING/backlog.md`; `.agents/MEMORY/HEARTBEAT.md`.

---

## 2026-10-14 · Confirmación de D-02

**Decisión:** el equipo confirma explícitamente **EC2** para el backend, lo que coincide con la resolución de la entrada anterior.

**Archivos afectados:** ninguno adicional.

---

## 2026-10-14 · Specs en borrador del Sprint 1 y hallazgos

**Evento:** borradores de `spec.md` para HU-01, HU-02, HU-03, HU-05, HU-06, HU-07 y HU-11 (todas las HU del Sprint 1). Quedan pendientes de aprobación del PO.

**Hallazgos (nuevas decisiones abiertas y huecos):**

| ID | Tema | Problema | Propuesta | Bloquea |
|---|---|---|---|---|
| D-20 | Visibilidad de la foto del vehículo | HU-11 dice "para que los pasajeros me identifiquen", pero `AGENTS.md` §11 trata la foto del vehículo como dato sensible, usado solo para verificación y nunca expuesto en la API | Mostrar al pasajero solo placa, marca, modelo y color; la foto, solo para verificación | HU-11 |
| D-21 | Verificación exigida para registrar un vehículo en S1 | `ssd.md` §7–§8 pide "verificado" y firma de dispositivo, pero HU-08 y HU-09 llegan en S2 (mismo patrón que D-11) | En S1 basta con membresía aprobada: registrar un vehículo no publica viajes ni mueve dinero, y publicar (HU-17, S2) sí exige verificación completa. Si se aprueba, corregir `ssd.md` §7–§8 | HU-11 |
| Hueco | Recuperación de contraseña | Ninguna HU del backlog la cubre; sin ella, quien olvide su contraseña pierde la cuenta | El PO decide si agrega una HU (sugerida: Should, 3 PHU) | — |

**Valores marcados `[POR DEFINIR]` en las specs (los decide el PO al aprobar):** vigencia de la invitación (HU-01, propuesta 72 h), lista de dominios públicos prohibidos (HU-02), límite de reenvío de códigos y requisitos de contraseña (HU-05), intentos fallidos antes del bloqueo de sesión (HU-06, propuesta 5), si una persona rechazada puede volver a solicitar ingreso (HU-03, propuesta: no), formato de placa y rango de capacidad (HU-11).

**Reglas propuestas en las specs (sujetas a la aprobación del PO):** modo de aprobación manual por defecto (HU-02); unirse a otra organización exige confirmar un correo de esa organización (HU-07); un vehículo activo por conductor en v1 (HU-11).

**Archivos afectados:** `SPECS/features/HU-{01,02,03,05,06,07,11}-*/spec.md`, `SPECS/roadmap.md`, `.agents/STEERING/backlog.md`, `.agents/MEMORY/HEARTBEAT.md`.

---

## 2026-10-14 · Resuelve D-12, D-16, D-20, D-21; nueva HU-34; valores de las specs de S1

**Decisiones del equipo:**

| ID | Resolución |
|---|---|
| D-12 | El **precio máximo por viaje** se pide en el formulario de alta de la organización (HU-01) y es obligatorio. HU-04 (S4) permitirá cambiarlo. |
| D-16 | Sesión máxima sin volver a escribir la contraseña: **30 días en la app móvil y 7 días en el panel web**. Desde HU-09, la sesión de 30 días exige además la firma del teléfono vinculado, para que nadie la obtenga diciendo que es la app móvil. |
| D-20 | El pasajero ve **placa, marca, modelo y color**; la foto del vehículo se usa solo para verificación y nunca sale en la API (`AGENTS.md` §11). |
| D-21 | En S1, registrar un vehículo exige solo **membresía aprobada**; publicar viajes (HU-17, S2) sigue exigiendo verificación completa. Se corrige `ssd.md` §7–§8 (desvío registrado aquí antes de editarlo, constitución Art. 11). |
| Hueco | Se agrega **HU-34 · Recuperación de contraseña** (Should, 3 PHU, S1, épica E2). S1 pasa de 23 a 26 PHU. |

**Valores aceptados en las specs de S1:** invitación vigente 72 h (HU-01); dominios públicos prohibidos: gmail.com, hotmail.com, outlook.com, yahoo.com, icloud.com (HU-02); un reenvío de código por minuto y 5 por hora (HU-05, HU-34); contraseña de mínimo 8 caracteres con al menos una letra y un número (HU-05, HU-34); 5 intentos fallidos bloquean el inicio de sesión 15 min (HU-06); un rechazado no puede volver a solicitar ingreso en v1 (HU-03); placa de 3 o 4 dígitos + 3 letras y capacidad de 1 a 6 pasajeros (HU-11). También se aceptan las reglas propuestas: aprobación manual por defecto (HU-02), unirse a otra organización confirmando un correo de ella (HU-07) y un vehículo activo por conductor (HU-11).

**Pendiente:** las specs quedan con sus valores completos, pero el **estado `aprobada`** lo marca el PO nominal cuando se nombre (SP01).

**Siguen abiertas:** D-05, D-07, D-08, D-09, D-10, D-13, D-15, D-17.

**Archivos afectados:** `SPECS/features/HU-{01,02,03,05,06,11}-*/spec.md`, `SPECS/features/HU-34-recuperacion-contrasena/spec.md` (nuevo), `SPECS/ssd.md` §4, §7, §8, §12, `SPECS/roadmap.md`, `.agents/STEERING/backlog.md`, `.agents/MEMORY/HEARTBEAT.md`.

---

## 2026-10-14 · PO nominal, specs de S1 aprobadas y resuelve D-07

**Decisiones:**
- **PO nominal:** el integrante que dirige estas sesiones con el agente (nombre `[POR DEFINIR]`). El Scrum Master nominal sigue sin nombrar.
- **Specs aprobadas por el PO (2026-10-14):** HU-01, HU-02, HU-03, HU-05, HU-06, HU-07, HU-11 y HU-34. Pasan a la fase **Plan**.
- **D-07 resuelta:** los datos personales (`usuarios`, `verificaciones_identidad`, `dispositivos`, `billeteras`, `recargas`, `movimientos`, `vehiculos`, `codigos_otp`, `tokens_refresco`) son de la persona, sin `organizacion_id`, y valen en todas sus organizaciones. Se protegen **por dueño**: el backend filtra por el usuario del token y a terceros solo expone proyecciones mínimas (por ejemplo, placa, marca, modelo y color del vehículo, o el nombre y correo institucional del miembro ante el admin de su organización). Viajes, reservas, membresías, presencia, invitaciones y auditoría siguen con `organizacion_id` + RLS.

**Razón:** la alternativa (una copia por organización) rompe "un CI, un rostro y una placa por persona" (A-02), duplica la billetera y complica la conciliación. Cambia la redacción de `AGENTS.md` §5.3 y la política de RLS, por eso requirió confirmación humana (`AGENTS.md` §14): el PO la dio en esta sesión.

**Archivos afectados:** `AGENTS.md` §5.3, `SPECS/constitution.md` Art. 2, `SPECS/ssd.md` §5–§6, las 8 specs de S1 (estado), `SPECS/roadmap.md`, `.agents/STEERING/backlog.md`.

---

## 2026-10-14 · Diseño (fase Plan) de las HU de S1: orden y cambios a ssd.md

**Decisiones de diseño (registradas antes de modificar `ssd.md`, constitución Art. 11):**
1. **Orden de implementación en S1:** HU-06 → HU-01 → HU-02 → HU-05 → HU-03 → HU-07 → HU-34 → HU-11. HU-01 necesita que el super administrador inicie sesión (HU-06), y este se crea con un script de semilla. Dependencias del roadmap corregidas: HU-06 depende de PB-01/PB-02 y HU-01 depende de HU-06.
2. **Infraestructura común:** la construye la primera HU que la necesita y las siguientes la reutilizan. HU-06: `PrismaService`, filtro de errores con `codigo`, `JwtGuard`, auditoría y semilla. HU-01: contexto RLS por organización y de super administrador, y cola de correos. HU-02: `OrganizacionGuard` y `RolOrganizacionGuard`. HU-05: servicio OTP compartido.
3. **RLS:** las políticas admiten `app.organizacion_id` o `app.super_admin = 'true'` (solo los endpoints `/admin`). La búsqueda de organización por dominio se hace con una función SQL `SECURITY DEFINER` que devuelve solo el id, para que el registro (sin organización todavía) no tenga que saltarse RLS.
4. **Correos:** cola `correos_salientes` en PostgreSQL con worker y reintentos (mismo patrón que `trabajos_onchain`). Los códigos OTP de registro y de alta de organización se envían en el momento, porque la persona está esperando. Los de recuperación (HU-34) se envían por la cola, para no revelar si la cuenta existe. En desarrollo, `CORREO_MODO=consola` imprime el correo; está prohibido en producción, igual que el modo emulador.
5. **Fotos de vehículo en desarrollo:** MinIO (compatible con S3) en `docker compose`, con `S3_ENDPOINT`. Así se mantiene la regla de "levantar en local sin AWS" (`AGENTS.md` §9.4). MinIO solo se usa como herramienta local; no se distribuye.
6. **Sesión web:** el refresh token va en una cookie `httpOnly; Secure; SameSite=Strict`, y el panel web y la API comparten origen a través de Caddy (`/api`), así que no hace falta CORS. En móvil, el refresh token se guarda en el almacenamiento seguro del sistema.
7. **Un correo institucional por persona:** `membresias.correo_institucional` es único en toda la plataforma, para que dos cuentas no usen el mismo correo (refuerza A-02).
8. **Ajuste a la spec de HU-34:** si falla el correo, la pantalla muestra el mismo mensaje genérico y el envío se reintenta solo. Se corrige la fila del caso borde para no contradecir CA-2 (no revelar cuentas). Corregido antes de escribir el plan (constitución Art. 1.4).

**Dependencias nuevas que proponen los planes** (requieren confirmación, `AGENTS.md` §14; se aprueban junto con cada plan):
- backend: `@nestjs/swagger`, `prisma`, `@prisma/client`, `class-validator`, `class-transformer`, `@nestjs/jwt`, `bcryptjs`, `cookie-parser`, `@aws-sdk/client-sesv2`, `@aws-sdk/client-s3`.
- web: `react-router-dom`.
- mobile: `expo-router`, `expo-secure-store`, `expo-image-picker`.

**Archivos afectados:** `SPECS/ssd.md` §3, §5, §6, §8, §12; `SPECS/roadmap.md` (dependencias de HU-01 y HU-06); `SPECS/features/HU-34-recuperacion-contrasena/spec.md`; los 8 `plan.md` de S1.

---

## 2026-10-14 · Planes de S1 aprobados; inicio del Sprint 0

**Decisiones del equipo:**
- Los 8 `plan.md` de S1 quedan **aprobados**. Con ellos se confirman las dependencias nuevas listadas en la entrada "Diseño (fase Plan)" y el cambio de RLS de HU-01 (`AGENTS.md` §14).
- Carga de S1: se mantienen las 8 HU. Si la velocidad no alcanza a mitad del sprint, HU-07 y HU-34 (*Should*, 26 h) pasan a S2.
- Sus tareas se copian a `backlog.md` (Sprint 1, SP39 en adelante).

**Evento:** el agente empieza el Sprint 0 en esta sesión (repositorio local, scaffolding, configuración). Las versiones exactas (D-05) se fijan con la última estable disponible al instalar y se registran en `ssd.md` §1.

**Archivos afectados:** `SPECS/features/HU-*/plan.md` (estado), `.agents/STEERING/backlog.md`.

---

## 2026-10-14 · Linter y pruebas según los defaults de NestJS 12 y Vite 9

**Hallazgo:** al generar los proyectos (SP06–SP07), NestJS 12 y Vite 9 traen por defecto **oxlint** (no ESLint) y NestJS 12 trae **Vitest** (no Jest). Expo sigue usando ESLint.

**Decisiones:**
- **Linter (decisión del equipo):** oxlint en `backend/` y `web/`; ESLint (`eslint-config-expo`) en `mobile/`; Prettier en todas las carpetas, incluido `contracts/` con `prettier-plugin-solidity`. Se modifica la regla "ESLint obligatorio" de `AGENTS.md` §7 y de la constitución Art. 7.1. La regla de no desactivar reglas sin justificarlo en el PR vale igual para oxlint.
- **Pruebas del backend:** **Vitest**, que es lo que trae NestJS 12. `ssd.md` decía "Jest (incluido en NestJS)"; el criterio era usar lo que trae el framework y se mantiene. Así web y backend usan la misma herramienta. Móvil sigue con Jest (preset de Expo, D-06).
- **Node.js (D-05):** la máquina de desarrollo tiene Node 22.18 y algunas herramientas de NestJS 12 piden ≥ 22.22.3 (solo lanzan advertencias). Propuesta: fijar **Node 24 LTS** en el CI, en Docker y en las máquinas del equipo (`.nvmrc`).
- **npm:** las instalaciones se ejecutan de a una. En paralelo, npm 10 rompe la caché (`Cannot read properties of null (reading 'edgesOut')`).

**Archivos afectados:** `AGENTS.md` §7, `SPECS/constitution.md` Art. 7.1, `SPECS/ssd.md` §1 y §15.

---

## 2026-10-14 · PB-04: contratos URC y escrow (ajustes al diseño de ssd.md §10)

**Decisiones (registradas antes de actualizar `ssd.md` §10):**
1. **El conductor se fija al bloquear:** `bloquear(idReserva, pagador, conductor, monto, plazo, v, r, s)` y `liberar(idReserva, hashPrueba)`. La propuesta pasaba el conductor en `liberar`; así, la cuenta verificadora no puede desviar el pago a otra dirección (refuerza A-09).
2. **Nuevo `ROL_OPERADOR`** en el escrow para `bloquear`, en manos del relayer. Sin ese rol, cualquiera que obtuviera la firma `permit` de un pasajero podría bloquear con otro `idReserva` o con otro conductor.
3. **Sin función de quema todavía:** el retiro (HU-16) está en Reserva. Se agrega cuando entre, con un `permit` del dueño; nunca como "el acuñador quema el saldo de cualquiera".
4. El `permit` va en `try/catch` (patrón recomendado por OpenZeppelin contra el adelanto de la firma) y `reembolsar(idReserva, porcentajePasajeroBps)` reparte el resto al conductor (D-18).

**Verificación:** 13 pruebas Hardhat en verde, incluidas 5 de ataque A-09 (liberar o reembolsar sin rol, cobrar dos veces, liberar una reserva inexistente) y una de A-10 (solo el acuñador crea saldo). Lint (Prettier) y build en verde.

**Archivos afectados:** `contracts/`, `SPECS/ssd.md` §10.

---

## 2026-10-14 · Avance del Sprint 0: scaffolding, CI y contratos

**Evento:** el agente completó SP06–SP09, SP12, SP14 y SP20–SP22, y dejó en progreso SP05, SP10 y SP11.
- `backend/` (NestJS 12 + Prisma 7 + Swagger): `GET /api/v1/salud` y Swagger en `/api/docs`; lint, 1 prueba unitaria, 2 e2e y build en verde.
- `web/` (React 19 + Vite 8): página mínima con textos `es-BO` y proxy `/api`; lint, 2 pruebas y build en verde.
- `mobile/` (Expo SDK 57): pantalla mínima con textos `es-BO`; paquete Android `com.uniride.app`; lint, 2 pruebas, tipos y bundle Android en verde.
- `contracts/` (Hardhat 3): ver la entrada de PB-04.
- Raíz: `.gitignore`, `.nvmrc` (24), `.env.example`, `docker-compose.yml` (PostgreSQL 17, MinIO, nodo Hardhat, API), plantilla de PR con la DoD, `.github/workflows/ci.yml` (matriz por carpeta), `README.md`, tabla de comandos en `AGENTS.md` §9 y versiones en `ssd.md` §1.

**Decisiones menores:**
- Se usó **npm 11** (`npx npm@11`) porque npm 10, el de Node 22, falla al resolver dependencias del backend (`edgesOut`). Por eso se fija Node 24 LTS, que trae npm 11.
- Scripts de instalación aprobados con `allowScripts`: `prisma`, `@prisma/engines` y `unrs-resolver`. Denegado: `@scarf/scarf` (telemetría de swagger-ui).
- Se quitó lo que los generadores agregan y no se pidió: la app de demostración de Expo, la plantilla de Vite, `@nestjs/mau` (despliegue pago de Nest) y las "skills" de IA que crea `prisma init`. Las dependencias de la plantilla de Expo se mantienen; se revisan cuando haya pantallas reales.
- `prisma.config.ts` carga el `.env` de la raíz con `process.loadEnvFile` (sin `dotenv`) y migra con `DATABASE_URL_MIGRACIONES` (rol dueño).

**Sin verificar:** `docker compose up` (Docker Desktop apagado en la máquina del agente) y el CI corriendo en GitHub (todavía no hay remoto).

**Archivos afectados:** `backend/`, `web/`, `mobile/`, `contracts/`, archivos de la raíz, `AGENTS.md` §9, `SPECS/ssd.md` §1, `SPECS/roadmap.md`, `.agents/STEERING/backlog.md`.

---

## 2026-10-14 · Repositorio principal + subrepositorios (submódulos de git)

**Decisión del equipo (PO):** se reemplaza el monorepo (`AGENTS.md` §3, documento técnico §2.8) por un **repositorio principal** con un **submódulo de git por aplicación**:
- `uniride` (principal): `AGENTS.md`, `SPECS/`, `.agents/`, `docker-compose.yml`, `.env.example`, README y el documento técnico.
- `uniride-backend`, `uniride-web`, `uniride-mobile`, `uniride-contracts`: cada uno con su código, su CI, su plantilla de PR, sus ramas `main`/`develop` y su protección.
- Repositorios **públicos** en GitHub, creados por el agente desde el navegador (Chrome) con la sesión del PO.

**Implicaciones aceptadas:**
- Cada subrepositorio tiene su propio CI (`.github/workflows/ci.yml`), que reemplaza la matriz del principal; el principal no tiene CI de código.
- Un cambio que toca varias aplicaciones se convierte en un PR por subrepositorio, y después se actualiza en el principal el puntero de cada submódulo.
- Para clonar: `git clone --recurse-submodules`.
- Las specs y la memoria viven solo en el principal; cada subrepositorio tiene un `AGENTS.md` corto que remite al principal (`AGENTS.md` §0 ya prevé un `AGENTS.md` por carpeta).
- Commits sin coautoría ni firma del agente (instrucción del PO).

**Pendiente:** actualizar el documento técnico del Grupo 4 (§2.8 dice "monorepo") → SP26.

**Archivos afectados:** `AGENTS.md` §3, §8, §9; `SPECS/ssd.md` §3; `SPECS/constitution.md` Art. 9; `README.md`; `.github/` (se mueve a cada subrepositorio).

## 2026-10-14 · Resultado: repositorios en GitHub, CI y protección de ramas

- Creados en la cuenta `Vansiii` (públicos): `uniride` (principal) y `uniride-backend`, `-web`, `-mobile`, `-contracts`.
- GitHub Actions venía desactivado en los repositorios nuevos; se activó en los cuatro subrepositorios. Se añadió `workflow_dispatch` al CI para poder lanzarlo a mano. El CI corrió en verde en `main` y `develop` de los cuatro.
- Protección con **rulesets** (no con la protección clásica de ramas), sobre la rama por defecto y `develop`, sin actores con bypass:
  - principal: sin borrado, sin force-push, PR obligatorio con 1 aprobación;
  - subrepositorios: lo mismo más el check de estado `verificar` (job del CI) en verde.
- **Consecuencia:** con 1 aprobación obligatoria y sin bypass, nadie puede fusionar solo. Los demás integrantes deben ser colaboradores de los cinco repositorios para revisar.

---

## 2026-10-16 · Sistema de diseño y marca de UniRide

**Decisión:**
- Se crea `DESIGN_SYSTEM.md` en la raíz como fuente de verdad de la interfaz (tokens, navegación, componentes, estados, accesibilidad y microcopia) para `mobile/` y `web/`. Lo visual queda como **Propuesta** hasta validarse en PB-03 (Figma) y con la prueba SUS (HU-30); sus pendientes P-01…P-12 están en su §17.
- Rasgos principales: estilo plano, color de marca índigo `#3447CC`, fuente del sistema, 5 pestañas en móvil (Buscar, Mis viajes, Publicar, Billetera, Perfil), interfaz solo clara hasta HU-31, sin librerías de UI.
- **Marca aprobada por el PO (resuelve P-01):** isotipo con forma de U trazada como línea de trayecto (punto de origen relleno → anillo de destino) y logotipo monolineal con los puntos de las "i" como origen y destino. Fuentes SVG en `marca/`. Se aplica en `feat/PB-03-marca` de `mobile/` (íconos de Android, splash, favicon, `app.json`) y `web/` (`favicon.svg`). El ícono de iOS de la plantilla se deja: iOS no es plataforma de demostración.

**Razón:** no había ningún criterio visual ni de navegación y las 8 HU de S1 empiezan a crear pantallas; sin un contrato común cada integrante (o agente) improvisaría estilos. Los íconos eran los de las plantillas de Expo y Vite.

**Archivos afectados:** `DESIGN_SYSTEM.md`, `marca/`, `.agents/STEERING/backlog.md` (SP83, SP84), `mobile/app.json`, `mobile/assets/images/*`, `web/public/favicon.svg`.

---

## 2026-10-17 · HU-06 implementada (pendiente de revisión y despliegue)

**Evento:** el agente implementó HU-06 completa en la rama `feat/HU-06-inicio-sesion` de `backend`, `web`, `mobile` y el principal (SP39–SP47). Commits locales, sin push ni PR todavía.

**Decisiones y desvíos (registrados aquí):**
- **Dependencias fuera del plan, aprobadas por el PO:** `@prisma/adapter-pg`, `pg` y `@types/pg` (Prisma 7 no se conecta sin adaptador de controlador).
- **Base local:** `docker/postgres/01-rol-app.sh` crea el rol `uniride_app` (sin dueño ni `BYPASSRLS`) al iniciar el volumen; nueva variable `POSTGRES_APP_PASSWORD` y `POSTGRES_PUERTO` (5432 por defecto) para evitar choques con un PostgreSQL local.
- **CI del backend** (cambio aprobado por el PO): servicio PostgreSQL, rol `uniride_app` y `prisma migrate deploy` antes de `test:e2e`. Scripts `prebuild`, `pretest` y `pretest:e2e` ejecutan `prisma generate` (el cliente generado no se versiona).
- **Cierre de sesión:** con el token de refresco revoca solo esa sesión; sin él revoca todas las del usuario.
- **Bloqueo:** al quinto fallo se bloquea 15 min y el contador vuelve a 0.
- **Refresco y límite absoluto:** el refresh vence con la sesión (30 d móvil, 7 d web); cada rotación conserva `sesion_vence_en`.
- **Web:** token de acceso en memoria, refresco en cookie `httpOnly` (`Path=/api/v1/autenticacion`, `SameSite=Strict`, `Secure` en producción).

**Verificado:** backend 5 unitarias + 11 e2e (CA-1 a CA-6, CA-8 a CA-10, auditoría y cookie), cobertura 82,75 %; web 8 pruebas; mobile 12 pruebas, tipos y bundle Android; lint y formato en verde en las tres carpetas.

**Sin verificar / pendiente:**
- **CA-7 en el backend:** `GET /yo` devuelve `membresias: []` hasta que HU-05 cree la tabla `membresias`; la app ya redirige a "Estado de membresía" cuando llegan pendientes o rechazadas (probado con datos simulados).
- Revisión de código por otro integrante, CI en GitHub, despliegue en AWS y aceptación del PO (DoD).
- Todo se corrió con Node 22.18 y `npx npm@11`; falta confirmar con Node 24.
- Pantallas sin probar en un teléfono ni en un navegador real.

**Archivos afectados:** `backend/`, `web/`, `mobile/`, `docker-compose.yml`, `docker/postgres/`, `.env.example`, `.agents/STEERING/backlog.md`, `SPECS/roadmap.md`, `SPECS/features/HU-06-inicio-sesion/plan.md`.

---

## 2026-10-17 · Propuesta de identidad visual más expresiva (PB-03)

**Evento:** al revisar el prototipo navegable de las 26 vistas de S1, el PO pidió una interfaz "más llamativa". El agente propuso el cambio en `DESIGN_SYSTEM.md` (rama `feat/PB-03-identidad-visual` del principal, sin commit) siguiendo su §15.

**Propuesta (aprobada por el PO el 17/10/2026):**
- P10 pasa de "lo más simple" a **"expresiva en la marca, sobria en el dinero"**: la expresión vive solo en zonas de marca (3.5): bandas de las pantallas raíz, inicio de sesión, resultados, vacíos, panel lateral web y tarjeta destacada. Formularios de dinero, confirmaciones con biometría, diálogos y tablas siguen planos.
- Índigo en tres profundidades: tokens `marcaProfundo`, `degradadoMarca`, `sobreMarca`, `sobreMarcaSecundario`, `marcaBrillante`, `marcaVelo` (contrastes documentados). No se agrega un segundo color de marca para no chocar con los semánticos.
- Familia display Bricolage Grotesque (OFL) solo para títulos de pantalla, cifras y zonas de marca, como archivo de fuente con `expo-font` (instalado) y `@font-face`; **sin paquete npm nuevo**.
- Nivel de elevación 0,5, animaciones `entradaResultado` y `trazoIlustracion` (reanimated, instalado), componentes `BandaMarca` e `Ilustracion` (SVG vía `expo-image`, instalado).

**Razón:** dar presencia de marca sin romper P1 (seguridad comprensible) ni la accesibilidad, y sin dependencias nuevas.

**Pendiente:** prueba al sol en un teléfono real (P-07); revisión por otro integrante del PR al abrirlo.

**Prototipo:** `prototipos/sprint-1.html` (HTML autocontenido, se abre en el navegador; solo carga fuentes de Google Fonts). Reemplaza al Figma para SP19 si el equipo lo acepta.

**Archivos afectados:** `DESIGN_SYSTEM.md` (1.4, 2, 3.1, 3.5, 4.1.1, 4.2, 4.6, 4.7, 8.1, 8.11, 8.12, 15, 17), `prototipos/sprint-1.html`, `.agents/STEERING/backlog.md` (SP19, SP85, SP86).

---

## 2026-10-23 · HU-01 Alta de organización implementada (SP48–SP54)

**Evento:** implementación de HU-01 según su `plan.md` aprobado (rama `feat/HU-01-alta-organizacion` en principal, `backend` y `web`; sin push ni PR).

**Decisiones de implementación (no cambian la spec):**
- `AuditoriaService.registrar(evento, tx?)` acepta la transacción: el alta se audita en la misma transacción.
- `RolPlataformaGuard` lee el rol de la BD (no del token), así revocar el rol surte efecto de inmediato. Responde 403 `NO_AUTORIZADO` igual exista o no la organización consultada (A-13: no revela existencia).
- Las rutas públicas de invitación (`GET/POST /invitaciones/{token}`) corren en contexto `comoSuperAdmin` porque no hay sesión: el token de 256 bits es la autorización. Token inexistente, usado, reemplazado o vencido dan el mismo 410.
- `correos_salientes.datos` guarda el enlace con el token solo hasta que el correo sale; al marcarlo `enviado` se vacía (el hash en `invitaciones` es lo único que perdura).
- Aceptar crea la membresía `admin_organizacion` en estado `aprobada`; con cuenta existente exige su contraseña (RN-7).
- `AutenticacionService.abrirSesion` (sin contraseña) y `responderSesion` quedaron exportados para flujos que ya autenticaron a la persona.
- Nueva variable `WEB_URL` (enlaces de los correos) en `.env.example`. Dependencia nueva aprobada en el plan: `@aws-sdk/client-sesv2`.
- Migración `002` cambia RLS (confirmada al aprobar el plan, 14/10). `registros_auditoria` ya tenía RLS desde la `001`.

**Verificado:** backend 6 unitarias + 38 e2e (CA-1 a CA-8, RN-7, A-13 a nivel API y SQL, rol, worker con reintentos), lint, formato y build; web 18 pruebas (10 nuevas), lint, formato, tipos y build.

**Sin verificar / pendiente:**
- Envío real por SES (solo `CORREO_MODO=consola` probado; SES sandbox exige correos verificados, SP13).
- Cobertura de backend no medida con las e2e; revisión de otro integrante, CI en GitHub, despliegue y aceptación del PO.
- Pantallas no probadas en un navegador real.
- UML: secuencia ya en el plan; falta el diagrama de clases y el de casos de uso.
- Node 22.18 + `npx npm@11` en esta máquina (no Node 24).

**Archivos afectados:** `backend/` (`prisma/`, `src/organizaciones`, `src/notificaciones`, `src/comun`, `test/`), `web/src`, `.env.example`, `.agents/`, `SPECS/`.

---

## 2026-10-24 · HU-02 Reglas de afiliación implementada (SP55–SP59)

**Evento:** implementación de HU-02 según su `plan.md` aprobado (rama `feat/HU-02-reglas-afiliacion` en principal, `backend` y `web`; sin push ni PR).

**Decisiones de implementación:**
- **El rol de la API puede borrar en `dominios_organizacion`** (`GRANT SELECT, INSERT, DELETE`; aprobado por el integrante, §14). Es la única tabla con borrado. La regla "solo inserción" de `ssd.md` vale para `movimientos` y `registros_auditoria`. Para el resto de tablas, HU-01 dejó en su migración el comentario "sin borrado", que fue una decisión de implementación y no una regla documentada. Quitar un dominio (CA-6, RN-7) tiene que liberarlo: con borrado lógico, `UNIQUE(dominio)` impediría que otra organización lo tome (RN-2). El historial queda en la auditoría (CA-8, anterior y nuevo). RLS limita el borrado a la organización propia (prueba A-13).
- `OrganizacionGuard` valida la membresía `aprobada` de la organización del token, leída de BD en cada petición, y deja `organizacionId` y `rolOrganizacion` en la petición. **No envuelve el handler en `enOrganizacion`**, porque un guard de Nest no puede hacerlo: cada servicio abre `enOrganizacion`, y si lo olvida RLS forzado devuelve 0 filas. Es un desvío del texto de plan §1 / `ssd.md`; está anotado en el plan.
- `organizacion_por_dominio` es `SECURITY DEFINER` con `SET app.super_admin = 'true'` dentro de la función: devuelve solo el id de una organización `activa` y no abre RLS en la transacción que la llama (probado).
- `{id}` distinto de la organización activa responde 404 `NO_ENCONTRADO`, idéntico a una organización inexistente. `DOMINIO_INVALIDO` incluye el dominio enviado por el cliente.
- Web: ruta `/organizacion/afiliacion`; el id sale de la sesión, no de la URL.

**Verificado:** backend 26 unitarias y 55 e2e (CA-1 a CA-8, A-13 en API y SQL, concurrencia), cobertura 80 → 86,8 %, lint y build. Peticiones reales contra el backend local, 403/404 a mano y Swagger. Web 32 pruebas (14 nuevas), lint y build. Pantalla probada en el navegador contra el backend local a 360, 768 y 1280 (feliz, errores, vacío, error de carga, roles, teclado).

**Sin verificar / pendiente:**
- CA-4/CA-5 de punta a punta: se cierran con HU-05 (registro).
- `GET /yo` no trae rol ni nombre de la organización (membresías vacías hasta HU-05): el enlace "Afiliación" aparece a cualquier miembro (el servidor responde 403 y la pantalla vuelve al inicio), y la barra lateral no muestra la organización.
- Contra el prototipo falta: el aviso "Último cambio: autor, fecha" (requiere un campo nuevo en `GET …/afiliacion`) y la confirmación al salir por el menú con cambios sin guardar (la app usa `BrowserRouter`).
- `OrganizacionGuard` no mira `organizaciones.estado`: un admin de una organización suspendida podría seguir editando. La spec no lo cubre.
- `format:verificar` falla en máquinas Windows con `core.autocrlf=true` (los archivos quedan en CRLF en la copia de trabajo; en el índice están en LF y en CI pasa). Propuesta: `.gitattributes` con `* text=auto eol=lf`, que también evita que `docker/postgres/01-rol-app.sh` rompa PostgreSQL al arrancar.
- `start:dev` no carga `../.env`, y `vite.config.ts` hace de proxy solo hacia el puerto 3000 (el backend no tiene CORS).
- Node 22 en esta máquina (no 24); revisión de otro integrante, CI en GitHub, despliegue y aceptación del PO. UML: clase `DominioOrganizacion`.

**Archivos afectados:** `backend/` (`prisma/migrations/003_dominios`, `schema.prisma`, `src/comun/organizacion.guard.ts`, `src/organizaciones/afiliacion.*`, `test/`), `web/src` (`paginas/admin/Afiliacion*`, `api/cliente.ts`, `App.tsx`, `componentes/`), `.agents/`, `SPECS/`.

---

## 2026-10-24 · HU-05 Registro con correo institucional implementada (SP60–SP65)

**Evento:** implementación de HU-05 según su `plan.md` aprobado. Ramas `feat/HU-05-registro-correo-institucional` en principal, `backend` y `mobile`, sin push. **La rama del backend sale de `feat/HU-02-reglas-afiliacion`** (sin fusionar todavía): su PR mostrará también los commits de HU-02 hasta que ese PR se fusione en `develop`.

**Decisiones de implementación:**
- **CA-8:** el `ValidationPipe` global usa `forbidNonWhitelisted`, así que un campo desconocido da 400 y no se descarta como suponía el plan. Para cumplir la spec ("se procesa y el dato se ignora"), `RegistroDto` acepta `organizacionId` con `@Allow()` + `@ApiHideProperty()` y el servicio nunca lo lee. Cualquier otro campo extra sigue dando 400. La configuración global no cambia.
- **CA-7:** si el correo ya tiene cuenta, se guarda una fila señuelo en `codigos_otp` que nunca valida y el aviso `ya_tienes_cuenta` se envía en el momento. Así límites, bloqueo, reenvío y 503 se comportan igual con o sin cuenta. Desvío del plan, que decía no generar fila y encolar el aviso.
- `codigos_otp` es dato personal: sin RLS; el rol de la API no puede borrar. El código se guarda con HMAC-SHA256 (`OTP_SECRETO`) y se compara con `timingSafeEqual`.
- El quinto error ya responde `OTP_BLOQUEADO` con `reintentarEn`.
- `PrismaService.fijarOrganizacion(tx, id)`: fija el contexto RLS dentro de una transacción ya abierta (la organización se conoce al leer el código).
- **`GET /yo` trae `membresias`** (`organizacionId`, `organizacion`, `rol`, `estado`), filtradas por el propio usuario. Cambio compatible; cierra el CA-7 pendiente de HU-06. Pendiente: que la web lo use para mostrar "Afiliación" solo a admins (HU-02).
- `reenviar-codigo` acepta por ahora solo `proposito: 'registro'`; HU-07 y HU-34 agregan los suyos.

**Verificado:** backend 70 unitarias + 77 e2e (CA-1 a CA-9, A-13, `/yo`), cobertura 86,8 → 90,1 %, lint y build; peticiones reales con cada error del plan §3. Mobile 40 pruebas (27 nuevas), lint, tipos y bundle Android; pantallas probadas con `expo web` contra el backend local a 360 y 412 (no afiliada, código incorrecto, bloqueo, vencido, reenvío; el código correcto creó cuenta y membresía en la BD). Con esto CA-4 y CA-5 de HU-02 quedan cubiertos de punta a punta en el servidor.

**Sin verificar / pendiente:**
- Flujo completo en un Android real o emulador: teclado numérico, autocompletado del código, guardar la sesión (`expo-secure-store` no funciona en web) y la redirección al estado de membresía.
- **Falta el texto legal del tratamiento de datos** (RN-7, Ley 164): la casilla solo lleva la frase. Lo tiene que entregar el PO o el equipo.
- El prototipo muestra "Te quedan 2 intentos"; la API no informa los intentos restantes.
- Correo real por SES (`CORREO_NO_DISPONIBLE` solo en pruebas automáticas).
- Un código vencido que nadie reemplaza conserva el hash de la contraseña en `datos`; no hay tarea de limpieza.
- Varias suites e2e crean organizaciones en `beforeAll` y pueden pasar los 10 s de `hookTimeout` bajo carga; las nuevas usan 60 s. Candidato: `hookTimeout` global en `vitest.config.e2e.ts`.
- Node 22 (no 24); revisión, CI, despliegue y aceptación del PO. UML: clase `CodigoOtp`, caso de uso "Registrarse".

**Archivos afectados:** `backend/` (`prisma/migrations/004_codigos_otp`, `src/autenticacion/{otp,registro}.*`, `yo.controller.ts`, `src/notificaciones`, `src/comun`, `test/`), `mobile/src` (`app/registro.tsx`, `app/codigo.tsx`, `componentes/`, `api/cliente.ts`, `contexto/sesion.tsx`), `.agents/`, `SPECS/`.

---

## 2026-10-25 · HU-03 Aprobación de miembros implementada (SP66–SP68)

**Evento:** implementación de HU-03 según su `plan.md` aprobado. Ramas `feat/HU-03-aprobacion-miembros` en principal, `backend` (sale de la rama de HU-05) y `web` (sale de la de HU-02), sin push.

**Decisiones:**
- **Aprobar una solicitud no pide confirmación** (confirmado por el integrante el 25/10). `DESIGN_SYSTEM.md` §9 (aprobado el 16-17/10) prevalece sobre la mitigación del plan §7 (14/10). Mitigación: auditoría y `Notificacion` con el resultado. Rechazar sí abre un diálogo con motivo opcional, porque es definitivo.
- La decisión es un `updateMany` condicional (`estado = 'pendiente'`) dentro de `enOrganizacion`: de dos decisiones simultáneas vale la primera y la otra recibe `MEMBRESIA_YA_DECIDIDA` (409), que se audita como `fallo`. Una membresía de otra organización responde `NO_ENCONTRADO`, igual que una inexistente (A-13). Auditoría y correo van en la misma transacción.
- El motivo solo se guarda al rechazar. Al aprobar se fija `ultima_organizacion_id` si la persona no tenía una.
- Web: el menú usa las `membresias` de `GET /yo` (HU-05). "Afiliación" y "Solicitudes" solo se muestran si el rol en la organización activa es `admin_organizacion`, y la barra lateral muestra el nombre de la organización (cierra el pendiente de HU-02). La página de llegada del admin es Solicitudes (`DESIGN_SYSTEM.md`).

**Verificado:** backend 79 unitarias + 95 e2e (CA-1 a CA-7, concurrencia 200+409, A-13), cobertura 90,9 %, lint y build; prueba real con 30 casos, partiendo de un registro real de HU-05. Web 51 pruebas, lint y build; navegador contra el backend local a 360, 768 y 1280 (aprobar, rechazar con motivo, ya decidida, vacío, error de carga, miembro sin rol, rechazado sin acceso, admin de otra organización).

**Sin verificar / pendiente:** correo real por SES; Node 24; revisión, CI, despliegue y aceptación del PO. UML: estados de la membresía, caso de uso "Decidir solicitud". CA-7 ("no puede usar viajes ni billetera") queda probado con los endpoints que hoy protege `OrganizacionGuard`; viajes y billetera llegan en S2.

**Archivos afectados:** `backend/src/membresias/`, `src/notificaciones/plantillas.ts`, `test/membresias/`, `test/ataques/a-13-membresias.e2e-spec.ts`; `web/src/paginas/admin/Solicitudes*`, `src/app/membresia.ts`, `componentes/Estructura*`, `api/cliente.ts`; `.agents/`, `SPECS/`.

---

## 2026-10-26 · HU-07 Varias organizaciones implementada (SP69–SP72)

**Evento:** implementación de HU-07 según su `plan.md` aprobado. Ramas `feat/HU-07-varias-organizaciones` en principal, `backend` (sale de la de HU-03) y `mobile` (sale de la de HU-05), sin push.

**Decisiones de implementación:**
- `POST /membresias` + `POST /membresias/confirmar` reutilizan `OtpService` con propósito `agregar_organizacion`, con los mismos errores OTP que el registro. La organización sale solo del dominio. `YA_ES_MIEMBRO` (aprobada o pendiente), `MEMBRESIA_RECHAZADA` (rechazo definitivo de HU-03) y `CORREO_EN_USO`.
- `PUT /yo/organizacion-activa` exige una membresía `aprobada` y emite un token de acceso nuevo. Sin membresía responde el mismo 403 `MEMBRESIA_NO_APROBADA` que pendiente o rechazada.
- **Riesgo aceptado (lo pide el plan):** `CORREO_EN_USO` permite a una persona con sesión averiguar si un correo institucional ya lo usa otra cuenta. Mitigación posible en S4 (HU de calidad): responder igual que un envío normal y avisar por correo, como CA-7 de HU-05.
- Mobile: Mis organizaciones (estado, activa, cambiar) y Agregar organización; la pantalla Código de HU-05 se reutiliza. Se entra desde Inicio y desde Estado de membresía.

**Verificado:** backend 96 unitarias + 115 e2e (CA-1 a CA-7, A-13: con A activa, B responde 404 igual que una inexistente aunque la persona sea miembro de B), cobertura 92 %, lint y build; 43 peticiones reales. Mobile 73 pruebas, lint, tipos y bundle; flujo completo con `expo web` a 360/412 contra el backend local.

**Sin verificar / pendiente:** Android real; Node 24; correo real por SES; revisión, CI, despliegue y PO. Para probar la app en web hace falta sustituir `expo-secure-store` (no tiene implementación web); hoy se hace con un `metro.config.js` temporal fuera de git.

**Archivos afectados:** `backend/src/membresias/mis-membresias.*`, `src/autenticacion/{autenticacion,registro}.*`, `test/membresias/varias.e2e-spec.ts`, `test/ataques/a-13-varias-organizaciones.e2e-spec.ts`; `mobile/src/app/{organizaciones,agregar-organizacion,codigo,estado-membresia,index}.tsx`, `contexto/sesion.tsx`; `.agents/`, `SPECS/`.

---

## 2026-10-26 · HU-34 Recuperación de contraseña implementada (SP73–SP76)

**Evento:** implementación de HU-34 según su `plan.md` aprobado. Ramas `feat/HU-34-recuperacion-contrasena` en principal, `backend` (sale de la de HU-07), `web` (sale de la de HU-03) y `mobile` (sale de la de HU-07), sin push.

**Decisiones de implementación:**
- `recuperar-contrasena` siempre responde 202. Con cuenta, el código va por la cola de correos (plan §3); sin cuenta, se guarda una fila señuelo en `codigos_otp` (propósito `recuperacion`) que no envía nada y nunca valida, para que el límite 429, el bloqueo y los tiempos sean iguales con o sin cuenta (mismo patrón que HU-05 CA-7).
- `restablecer-contrasena` (204) valida la contraseña antes de gastar el código y hace el bcrypt fuera de la transacción. Dentro de ella: verifica el código, guarda el hash nuevo, levanta el bloqueo de inicio de sesión, revoca **todos** los refresh tokens (RN-3) y deja auditoría y el aviso `contrasena_cambiada`. No toca dispositivos ni billetera (RN-5).
- `reenviar-codigo` acepta también el propósito `recuperacion`.

**Verificado:** backend 110 unitarias + 124 e2e (CA-1 a CA-6), cobertura 92,6 %, lint y build; peticiones reales con y sin cuenta (misma respuesta, 429 y bloqueo). Web 68 pruebas y mobile 94 pruebas, lint y build en ambas; flujo completo en navegador (web a 360/768/1280, mobile con expo web a 360/412): tras restablecer, las sesiones abiertas y la contraseña vieja dan 401 y la nueva entra.

**Sin verificar / pendiente:** CA-7 (dispositivo) llega con `FirmaDispositivoGuard` en S2; Android real; SES real; Node 24; revisión, CI, despliegue y PO.
- Defecto previo encontrado: Iniciar sesión (web) muestra la hora del bloqueo con doble punto ("a. m.."). No es de esta HU; corregir aparte.
- Para el entorno local: dos backends sobre la misma base comparten la cola de correos, así que el worker de uno puede enviar los correos del otro.

**Archivos afectados:** `backend/src/autenticacion/{recuperacion,otp,autenticacion,registro}.*`, `test/`; `web/src/paginas/RecuperarContrasena*`, `IniciarSesion*`; `mobile/src/app/recuperar.tsx`, `iniciar-sesion.tsx`; `.agents/`, `SPECS/`.

---

## 2026-10-27 · HU-11 Registro de vehículo implementada (SP77–SP81) y MinIO del compose

**Evento:** implementación de HU-11 según su `plan.md` aprobado. Ramas `feat/HU-11-registro-vehiculo` en principal, `backend` (sale de la de HU-34) y `mobile` (sale de la de HU-34), sin push. Con ella, las 8 HU del Sprint 1 quedan implementadas.

**Decisiones:**
- **MinIO del compose pasa a `bitnamilegacy/minio:2025.5.24-debian-12-r5`** (aprobado por el integrante el 27/10): `minio/minio` ya no se publica en Docker Hub ("repository does not exist"). Es solo para desarrollo; los datos van en `/bitnami/minio/data`. Probado: subida y borrado reales con `AlmacenamientoService`.
- **Variables nuevas `S3_CIFRADO` y `S3_KMS_LLAVE_ID`** (en `.env.example`): `kms` por defecto (SSE-KMS en AWS), `s3` (SSE-S3) y `ninguno` (MinIO sin KMS); el servicio falla si vale `ninguno` en producción. El servicio `backend` del compose usa `S3_CIFRADO: ninguno`. Cada integrante tiene que poner `S3_CIFRADO=ninguno` en su `.env` local.
- La foto se verifica por sus bytes (JPEG/PNG, 5 MB), se sube con la clave `vehiculos/{uuid}` y se borra si la inserción falla. Ningún `select` de salida incluye la clave (CA-7, D-20) y los errores del SDK solo registran el tipo. La tabla `vehiculos` es dato personal: sin RLS; el rol de la API solo tiene SELECT e INSERT.
- Mobile: `expo-image-picker` ~57.0.20 (aprobada con el plan). Se entra desde "Mi vehículo" en Inicio; si ya tiene vehículo, ve el resumen sin foto.

**Verificado:** backend 133 unitarias + 140 e2e (CA-1 a CA-4, CA-7, CA-8; misma placa en paralelo sin foto huérfana; 503 con el almacenamiento caído), cobertura 93,9 %, lint y build. Mobile 133 pruebas, lint, tipos y bundle; expo web a 360/412 contra el backend local y MinIO.

**Sin verificar / pendiente:**
- Cámara, galería y multipart nativo en Android real.
- SSE-KMS en AWS real (SP13).
- CA-5 y CA-6 se prueban con HU-17 (publicar viaje, S2).
- Paridad con el prototipo `m-vehiculo`: el título dice "Mi vehículo" en vez de "Registrar vehículo"; el resumen es una lista de campos en vez de la tarjeta "Marca Modelo · color / placa · asientos"; falta "Volver al perfil". Son diferencias visuales menores.
- La primera ejecutora del backend se cortó por el límite de uso; el relevo encontró el trabajo completo y lo verificó.

**Archivos afectados:** `backend/prisma/migrations/005_vehiculos`, `src/vehiculos/`, `src/comun/almacenamiento.service.ts`, `test/vehiculos/`, `package.json`; `mobile/src/app/vehiculo.tsx`, `package.json`; `docker-compose.yml`, `.env.example`, `.agents/`, `SPECS/`.

---

## 2026-11-02 · HU-08 Verificación de identidad: spec y plan técnico aprobados

**Evento:** El PO aprueba la especificación (`spec.md`) y el plan técnico (`plan.md`) de HU-08 (Verificación de identidad). Es la 1.ª HU del Sprint 2 y desbloquea la billetera (HU-12) y la publicación de viajes (HU-17).

**Decisión:**
1. **Hash irreversible para el carnet (HMAC-SHA256 con salt del servidor):** El número de carnet de identidad nunca se guarda en texto claro ni se cifra con KMS para lectura. Se almacena únicamente su hash ciego (`documento_hash` UNIQUE en la tabla `identidades`), garantizando la regla A-02 (un carnet por persona) y cumpliendo la Ley N.º 164.
2. **Sin integración con SEGIP:** Confirmado con el PO que la integración estatal está fuera de alcance v1 y no se requiere reversibilidad del carnet.
3. **Colección facial para A-02:** Los rostros verificados se indexan en una colección de AWS Rekognition (`IndexFaces`) para detectar intentos de registrar cuentas adicionales con diferente número de documento (`SearchFacesByImage`).
4. **Mock para desarrollo/CI:** Se incluye la bandera `REKOGNITION_SIMULADO=true` para ejecutar pruebas locales y en CI sin costo de AWS.

**Tareas acordadas (Sprint 2):** `SP88` (modelo Prisma y migración `006_identidades`), `SP89` (`RekognitionService` con vivacidad y colección), `SP90` (endpoints y guard), `SP91` (suite de pruebas con ataques A-01 y A-02) y `SP92` (pantalla móvil en Expo).

**Archivos afectados:** `SPECS/features/HU-08-verificacion-identidad/{spec,plan}.md`, `.agents/MEMORY/MEMORY.md`, `.agents/STEERING/backlog.md`, `SPECS/roadmap.md`.

---

## 2026-11-02 · HU-09 Vinculación de dispositivo: spec y plan técnico aprobados

**Evento:** El PO aprueba la especificación (`spec.md`) y el plan técnico (`plan.md`) de HU-09 (Vinculación de dispositivo). Es la 2.ª HU del Sprint 2 y establece la Capa 2 de seguridad (dispositivo atestiguado y firmado criptográficamente).

**Decisión:**
1. **Algoritmo ECDSA P-256 en hardware:** Las llaves del dispositivo se generan en el chip seguro (StrongBox / TEE de Android Keystore) con curva NIST P-256. Genera firmas compactas de ~64 bytes en Base64 idóneas para encabezados HTTP `X-Firma`.
2. **Alcance de la firma en `FirmaDispositivoGuard`:** La firma del dispositivo se exige estrictamente en endpoints sensibles (billetera, recarga, publicar viaje, reservar y handshakes). Consultas públicas y login inicial usan JWT estándar para no romper la web.
3. **Protección contra repetición (Replay):** Firma canónica sobre `METHOD + PATH + TIMESTAMP + NONCE + SHA256(BODY)` con ventana de 30 segundos y caché de nonces de un solo uso.
4. **Play Integrity y bypass en desarrollo:** Obligatorio nivel `MEETS_DEVICE_INTEGRITY`. En desarrollo local se usa `MODO_EMULADOR_DEV=true` (corregido el 2026-11-05; antes figuraba `INTEGRITY_MODO`); en producción (`NODE_ENV=production`), el bypass está estrictamente prohibido y bloquea el sistema si se intenta encender.

**Tareas acordadas (Sprint 2):** `SP93` (modelo Prisma y migración `007_dispositivos`), `SP94` (`PlayIntegrityService`), `SP95` (endpoints de atestación y vinculación), `SP96` (`FirmaDispositivoGuard`), `SP97` (pruebas de ataque A-03, A-04, A-08) y `SP98` (módulo móvil de Keystore en Expo).

**Archivos afectados:** `SPECS/features/HU-09-vinculacion-dispositivo/{spec,plan}.md`, `.agents/MEMORY/MEMORY.md`, `.agents/STEERING/backlog.md`, `SPECS/roadmap.md`.

---

## 2026-11-02 · HU-12 Creación de billetera: spec y plan técnico aprobados

**Evento:** El PO aprueba la especificación (`spec.md`) y el plan técnico (`plan.md`) de HU-12 (Creación de billetera). Es la 3.ª HU del Sprint 2 y sienta la base de pagos con el token ERC-20 UniCoin en Polygon Amoy.

**Decisión:**
1. **Custodia de llaves de usuario con costo $0 base (A-12) y advertencia visible:** Para no incurrir en el costo de $1 USD/mes por usuario de AWS KMS, la arquitectura adopta un modo dual:
   - **Modo estándar ($0 costo):** Cifrado simétrico AES-256-GCM en backend mediante `node:crypto` con la variable secreta `WALLET_ENCRYPTION_KEY`. En la base de datos solo se guardan los datos cifrados (`llave_custodia_ref`).
   - **Modo AWS KMS opcional:** Si se exige en producción, se utiliza una única Llave Maestra KMS para cifrar las llaves (Envelope Encryption), sin claves dedicadas por alumno.
   - **Nota de atención (ojo):** Queda explícitamente advertido en el `plan.md` para el equipo implementador por si se decide ajustar este esquema más adelante.
2. **Sin cobro de gas al usuario:** Transacciones orquestadas por la cuenta relayer del sistema.
3. **Idempotencia:** Invocaciones repetidas de creación devuelven la billetera existente en vez de crear nuevas direcciones.

**Tareas acordadas (Sprint 2):** `SP99` (modelo Prisma y migración `008_billeteras`), `SP100` (`BlockchainService` y lectura de balance de UniCoin), `SP101` (endpoints de billetera), `SP102` (pruebas de seguridad A-12 sin llaves en BD) y `SP103` (pantalla de billetera en Expo).

**Archivos afectados:** `SPECS/features/HU-12-creacion-billetera/{spec,plan}.md`, `.agents/MEMORY/MEMORY.md`, `.agents/STEERING/backlog.md`, `SPECS/roadmap.md`.

---

## 2026-11-02 · HU-14 Saldo e historial: spec y plan técnico aprobados

**Evento:** El PO aprueba la especificación (`spec.md`) y el plan técnico (`plan.md`) de HU-14 (Saldo e historial). Es la 4.ª HU del Sprint 2 y define el libro mayor inmutable y la conciliación contable.

**Decisión:**
1. **Libro mayor inmutable (`movimientos_billetera`):** Se registran todas las transacciones de débito y crédito con clave de idempotencia única.
2. **Desglose de saldo:** Se separa claramente el `saldoDisponible` del `saldoBloqueadoEscrow` (viajes reservados pendientes).
3. **Resiliencia en consulta on-chain:** Caché de 15 segundos sobre la lectura de `UniCoin.balanceOf(direccion)` para no saturar la testnet, y fallback inmediato al último saldo contable en PostgreSQL (`enLinea: false`) si el nodo RPC tiene latencia o caída temporal.

**Tareas acordadas (Sprint 2):** `SP104` (modelo Prisma y migración `009_movimientos_billetera`), `SP105` (lógica de conciliación y endpoint `/saldo`), `SP106` (endpoint paginado `/movimientos`), `SP107` (pruebas automatizadas) y `SP108` (pantalla de historial y componente `TarjetaSaldo` en Expo).

**Archivos afectados:** `SPECS/features/HU-14-saldo-historial/{spec,plan}.md`, `.agents/MEMORY/MEMORY.md`, `.agents/STEERING/backlog.md`, `SPECS/roadmap.md`.

---

## 2026-11-02 · HU-13 Recarga de saldo: spec y plan técnico aprobados (Resuelve D-13)

**Evento:** El PO aprueba la especificación (`spec.md`) y el plan técnico (`plan.md`) de HU-13 (Recarga de saldo). Es la 5.ª HU del Sprint 2 y define el ingreso legítimo de fondos al sistema (A-10).

**Decisión:**
1. **Límites de recarga:** Rango estricto de 10 a 500 Bs (URC) por transacción, con código QR simulado y expiración a 15 minutos.
2. **Resolución de D-13 (Biometría en recarga):** La confirmación de recarga se blinda con `FirmaDispositivoGuard` (HU-09). Como la clave del Android Keystore exige autenticación biométrica en hardware para firmar, la recarga queda asegurada con biometría real desde S2. HU-29 en S3 solo añadirá el diálogo visual para comandos de voz.
3. **Acuñación idempotente (A-09):** La llamada a `UniCoin.acunar` la realiza el relayer y se asocia a la `clave_idempotencia` de la orden; peticiones repetidas nunca duplican la emisión de tokens.

**Tareas acordadas (Sprint 2):** `SP109` (modelo Prisma `ordenes_recarga`), `SP110` (servicio de QR e idempotencia), `SP111` (método `acunarTokens` con relayer), `SP112` (endpoint de confirmación con firma de dispositivo), `SP113` (pruebas de ataque A-09) y `SP114` (pantalla móvil en Expo).

**Archivos afectados:** `SPECS/features/HU-13-recarga-saldo/{spec,plan}.md`, `.agents/MEMORY/MEMORY.md`, `.agents/STEERING/backlog.md`, `SPECS/roadmap.md`.

---

## 2026-11-02 · HU-17 Publicar viaje: spec y plan técnico aprobados

**Evento:** El PO aprueba la especificación (`spec.md`) y el plan técnico (`plan.md`) de HU-17 (Publicar viaje). Es la 6.ª HU del Sprint 2 y sienta la máquina de estados del viaje y la tabla `viajes` con RLS.

**Decisión:**
1. **Máquina de estados estricta (`AGENTS.md` §5.9):** Inicia en `publicado` y sigue transiciones controladas por el servidor.
2. **Capacidad física y aislamiento:** Los cupos ofrecidos tienen tope en la capacidad registrada del vehículo en HU-11 (`vehiculos.capacidad`). Aislamiento multi-organización en PostgreSQL mediante Row-Level Security por `organizacion_id` (A-13).
3. **Firma de dispositivo (A-08) y anti-solapamiento:** Publicación protegida por `FirmaDispositivoGuard` y validación de margen de 2 horas para evitar conductores con viajes solapados.

**Tareas acordadas (Sprint 2):** `SP115` (modelo Prisma `viajes` y RLS), `SP116` (lógica de validación de conductor y vehículo), `SP117` (endpoints de viajes), `SP118` (pruebas de amenazas A-08 y A-13) y `SP119` (pantalla móvil en Expo con OSM).

**Archivos afectados:** `SPECS/features/HU-17-publicar-viaje/{spec,plan}.md`, `.agents/MEMORY/MEMORY.md`, `.agents/STEERING/backlog.md`, `SPECS/roadmap.md`.

---

## 2026-11-02 · HU-18 Buscar viajes: spec y plan técnico aprobados (Resuelve D-17)

**Evento:** El PO aprueba la especificación (`spec.md`) y el plan técnico (`plan.md`) de HU-18 (Buscar viajes). Es la 7.ª y última HU del Sprint 2; cierra el circuito completo de identidad, billetera y viajes.

**Decisión:**
1. **Filtro geoespacial y temporal:** Radio de proximidad de $\le$ 1,0 km con fórmula de Haversine y ventana de $\pm$ 30 minutos respecto a la hora solicitada.
2. **Resolución de D-17 (Calificaciones en búsqueda):** Como HU-21 está en Reserva, el campo `calificacionPromedio` es opcional en la API. Si no hay reseñas, se muestran las insignias «Conductor verificado» y «Nuevo», evitando estrellas ficticias o errores.
3. **Aislamiento institucional (A-13) y latencia:** Consulta filtrada estrictamente por la organización activa del pasajero en PostgreSQL (RLS). Meta de respuesta en < 2 segundos cumplida mediante índice compuesto `idx_viajes_busqueda`.

**Tareas acordadas (Sprint 2):** `SP120` (consulta geoespacial Haversine y temporal), `SP121` (endpoint `/viajes/buscar`), `SP122` (pruebas automatizadas, A-13 y latencia) y `SP123` (pantalla móvil y componente `TarjetaViaje` en Expo).

**Archivos afectados:** `SPECS/features/HU-18-buscar-viajes/{spec,plan}.md`, `.agents/MEMORY/MEMORY.md`, `.agents/STEERING/backlog.md`, `SPECS/roadmap.md`.








## 2026-11-06 · HU-12: se alinean los documentos con la custodia cifrada

**Decisión:** el integrante confirma la custodia aprobada por el PO el 02/11: llaves de billetera de usuario cifradas con AES-256-GCM en `billeteras.llave_custodia_ref`, con la clave en `WALLET_ENCRYPTION_KEY`. Relayer y verificador siguen en KMS. Solo se añade `ethers` ^6.17 al backend (`AGENTS.md` §14); `@aws-sdk/client-kms` no, porque el modo KMS opcional no se implementa. Se usan las variables que ya existían (`CADENA_RPC_URL`, `DIRECCION_TOKEN_URC`) en vez de las del plan.

**Razón:** el plan aprobado contradecía `AGENTS.md` §6 y §11, `constitution.md` Art. 6, `ssd.md` §10 y la RN-3 de la spec, que decían "solo en KMS, nunca en la BD". Riesgo aceptado: quien obtenga a la vez la base de datos y esa variable descifra las llaves; el token no tiene valor real.

**Archivos afectados:** `AGENTS.md`, `SPECS/constitution.md`, `SPECS/ssd.md`, `SPECS/features/sprint-2/HU-12-creacion-billetera/{spec,plan}.md`, `SPECS/roadmap.md`, `.env.example`.

---

## 2026-11-06 · HU-12 Creación de billetera y SP125 Keystore nativo: implementadas

**Decisiones:**
1. Se agrega SP125 (HU-09): la firma de dispositivo no podía funcionar en un teléfono real porque el Keystore nativo no estaba instalado, y los endpoints de billetera la exigen. Módulo local de Expo en `mobile/modules/llave-dispositivo` (Kotlin, ECDSA P-256 no exportable, huella en cada firma con `BiometricPrompt` y `CryptoObject`); única dependencia nativa nueva: `androidx.biometric`. Sin paquetes npm de terceros en la firma.
2. `usuarios.suspendida_en` (`TIMESTAMPTZ NULL`) para el caso "cuenta suspendida" de la spec §4: POST y GET responden 403 `CUENTA_SUSPENDIDA`. Nada la escribe hasta una HU de administración.
3. La billetera se crea al aprobarse la identidad; si falla no revierte la verificación, queda auditado y `POST /billetera` reintenta. La cadena se comprueba antes de insertar. `exploradorUrl` es `null` fuera de Amoy.
4. `GET /billetera/mia` también va firmado (`ssd.md` §8), así que leer el saldo pide huella: la pantalla lee una vez al entrar y con un botón de actualizar, no en cada foco. Solo la vista sin billetera relee al recuperar el foco, porque esa consulta no pide firma.
5. El saldo se muestra en formato es-BO sobre el texto de la API, sin pasar por `Number` (`src/formato.ts`). Se añade `expo-clipboard` y la barra de pestañas `src/app/(pestanas)/`. Recargar y Movimientos llegan con HU-13 y HU-14.

**Verificado:** backend 360 unitarias y 241 e2e, cobertura 95,9 %, peticiones reales contra Hardhat local. Móvil 209 pruebas. En teléfono físico (Infinix X669, Android 12, TEE): firma real aceptada por el backend; firma repetida o ajena, 401; cancelar y dedo rechazado no firman; billetera creada; saldo acuñado visto como 1.234,56 URC; nodo apagado da 503 y el reintento funciona.

**Sin verificar:** Polygon Amoy y SP23 (despliegue), enlace a Polygonscan en el teléfono, vista con datos a 412 dp, CI real, Play Integrity real (simulado en desarrollo; en producción la vinculación falla a propósito), StrongBox, invalidación al registrar una huella nueva.

**Pendientes sin bloquear:** pedir huella al vincular (prototipo `m-biometria`); alias de llave por cuenta (hoy, una segunda cuenta en el mismo teléfono deja sin firma a la primera; con HU-10); el texto "Actualiza la app" de `keystore_no_disponible` confunde; UML de despliegue, paquetes y secuencia de creación; prueba `afiliacion CA-8` falló una vez por timeout de 5 s y no se repitió.

**Archivos afectados:** `backend/src/{billetera,blockchain,identidad}`, `backend/prisma/migrations/008_billeteras`, `mobile/modules/llave-dispositivo`, `mobile/src/app/(pestanas)`, `mobile/src/dispositivo`, `mobile/src/formato.ts`, `SPECS/features/sprint-2/HU-12-creacion-billetera/plan.md`.

---

## 2026-11-06 · HU-14 Saldo e historial: implementada

**Evento:** Backend y móvil implementados, apilados sobre HU-12, que aún no está en `develop` (autorizado por el integrante). Pendientes: PR, revisión, CI y aceptación del PO.

**Decisión:**
1. **`/billetera/saldo` y `/billetera/movimientos` van sin firma de dispositivo** (decisión del integrante): token, cuenta activa e identidad verificada. Cada firma pide huella, y el refresco y el scroll infinito (CA-5) no pueden pedirla en cada lectura. Riesgo aceptado: un token robado puede leer saldo e historial, sin mover dinero. `POST /billetera` y `GET /billetera/mia` conservan la firma, así que abrir la pestaña Billetera pide una huella. Corrige `ssd.md` §8.
2. **Fórmula del saldo:** disponible = `balanceOf` y total = `balanceOf` + bloqueado. Corrige el plan, que restaba el escrow: `EscrowUniRide.bloquear` ya saca los tokens de la billetera (`ssd.md` §10).
3. **Libro mayor:** sin `saldo_posterior`, porque el trigger de solo inserción no deja actualizarlo; el saldo contable se calcula sobre los movimientos confirmados. El trigger y el GRANT dejan cambiar solo `estado` y `hash_tx`, y un movimiento `confirmado` ya no cambia: una corrección es un movimiento nuevo.
4. **Conciliación:** en cada lectura real de la cadena sin movimientos pendientes; una diferencia va a `registros_auditoria` y al log, sin cambiar la respuesta. El proceso periódico de `ssd.md` §10 y la alerta quedan fuera de esta HU. Una diferencia persistente agrega hasta 4 filas por minuto por billetera consultada.
5. **Bloqueado:** bloqueos confirmados cuya `reserva_id` no tiene liberación ni reembolso confirmados, en cualquier billetera. `reserva_id` es obligatoria salvo en `recarga`; su llave foránea llega con HU-19.
6. **Desvíos menores:** `tipo` y `estado` son `TEXT` + `CHECK`, como el resto del esquema, no ENUM; CHECK de formato de hash y de hash obligatorio al confirmar; filtro `?tipo=` por los chips del prototipo; `limite` máximo 100. HU-16 y HU-24 deben ampliar los CHECK al agregar `retiro` y `subsidio`.
7. **Móvil:** "Actualizar" relee solo `/saldo`. Con `/mia` en 503 se ve el saldo con el aviso y sin dirección. Etiqueta Pendiente neutra y fecha "mié 21 oct", según `DESIGN_SYSTEM.md`. Sin fila "Billetera creada": no existe ese tipo de movimiento. Sin aviso de recarga pendiente en Billetera ni botón Recargar: llegan con HU-13. Saldo en Inicio: con HU-18.

**Verificado:** backend 394 unitarias y 316 e2e, cobertura 95,7 %, ataques A-09 y A-10, peticiones reales contra Hardhat con nodo caído, colgado y con error (200 y `enLinea: false`). Móvil 246 pruebas y `expo export` de Android. En teléfono físico (Infinix X669): 46 movimientos, filtros, scroll, sin verificar, historial vacío y nodo caído.

**Sin verificar:** Polygon Amoy y SP23, enlace a Polygonscan en pantalla, vistas a 412 dp y web de la billetera, bloqueo real del escrow (HU-19), CI real. El diálogo de huella no sale en el volcado de pantalla: que refrescar y paginar no firman está probado por Jest, no contando diálogos.

**Pendientes sin bloquear:** UML de clases (`MovimientoBilletera`), secuencia de saldo y componentes de mobile. `fallido` → `confirmado` directo sigue permitido. Timeouts de 5 s que no se repitieron: 2 e2e de HU-34 y 2 unitarias de billetera y blockchain en una corrida temprana; causa no demostrada. Otras pantallas sin banda de marca podrían tener la barra de estado blanca sobre blanco.

**Archivos afectados:** `backend/prisma/migrations/009_movimientos_billetera`, `backend/src/{billetera,blockchain}`, `mobile/src/app/movimientos.tsx`, `mobile/src/app/(pestanas)/billetera.tsx`, `mobile/src/componentes/{TarjetaSaldo,FilaMovimiento,Mensajes}.tsx`, `mobile/src/{formato,enlaces}.ts`, `SPECS/ssd.md`, `SPECS/features/sprint-2/HU-14-saldo-historial/plan.md`.

---

## 2026-11-07 · HU-14: verificación con escrow real, web y huellas

**Evento:** Se hicieron las pruebas que la entrada del 06/11 dejó sin verificar. Sin push; pendientes: `/code-review`, PR, revisión, CI y aceptación del PO.

**Decisión:**
1. **Un movimiento confirmado invalida el caché de `/saldo`.** La prueba real mostró que, tras bloquear 15 URC de 150, `/saldo` daba total 165 y disponible 150 durante 15 s: el bloqueado salía de la BD y el `balanceOf` del caché. El caché ahora guarda cuántos movimientos confirmados tenía la billetera y se relee si ese número cambia. Funciona con varias instancias y no agrega lecturas mientras nada cambie. Un movimiento pendiente no gasta otra lectura.
2. **El resumen del libro se lee antes que la cadena.** Así, un movimiento que se confirma entre las dos lecturas sigue contando como pendiente y no genera una diferencia falsa.
3. **Queda abierto para HU-19, sin corregir:** `reembolsar` al 50 % sobre 12,35 URC reparte 6,175 en la cadena y `monto` es `NUMERIC(12,2)`. La diferencia es permanente, en pasajero y conductor, y agrega una fila de auditoría en cada lectura real. Hay que decidir antes de HU-19 si se redondea en el contrato o se limitan los montos.

**Verificado:**
- **Escrow real en Hardhat:** `UniCoin` y `EscrowUniRide` desplegados, `bloquear` con permit firmado, `liberar`, `reembolsar` al 100 % y al 50 %. En cada paso `/saldo` coincidió con `balanceOf`, sin diferencias auditadas salvo el caso impar de arriba. Los hash del historial existen en la cadena con estado exitoso y el escrow terminó en 0 tras los casos resueltos. El backend real leyó la cadena; la prueba llamó al contrato y escribió los asientos por su cuenta, porque ese flujo llega con HU-19.
- **Web a 360 y 412 (Edge headless):** Movimientos sin desborde, 4 chips en una fila, Pendiente y No se completó, 46 de 46 montos únicos al bajar, filtros, historial vacío y CA-6. 26 lecturas de `/saldo` y `/movimientos`, ninguna con firma.
- **Teléfono físico (Infinix X669):** el integrante vio una sola huella al abrir Billetera, y el registro de peticiones muestra una sola firmada (`/mia`). Refrescar, paginar hasta la página 3 y volver no firmaron. Billetera y Movimientos correctas a 412 dp. El enlace abre Chrome en `amoy.polygonscan.com/tx/<hash>`, con la URL agregada por un proxy de prueba.
- **Suites sobre el código final:** backend lint, build, 395 unitarias y 318 e2e, cobertura 95,7 %; mobile lint, build y 246 pruebas.

**Sin verificar:** Polygon Amoy y SP23, explorador con una transacción real, CI real, Billetera con datos en web (sin Keystore no hay firma).

**Archivos afectados:** `backend/src/billetera/{conciliacion,movimientos}.service.ts`, `backend/src/blockchain/blockchain.service.ts`, sus pruebas y `backend/test/billetera/saldo.e2e-spec.ts`; `SPECS/features/sprint-2/HU-14-saldo-historial/{spec,plan}.md`.

---

## 2026-11-07 · HU-14: revisión de código antes de subir

**Evento:** `/code-review` de la rama de HU-14 en `backend` y `mobile`, con 10 hallazgos contrastados contra el código y las decisiones ya tomadas.

**Decisión:**
1. **Corregidos en `mobile`:** reintentar en Movimientos vuelve a crear la billetera si la creación falló (`yaCreo` se marcaba antes de terminar), y recargar Billetera limpia el aviso rojo de refresco.
2. **Se mantienen, ya decididos:** `/saldo` y `/movimientos` sin firma (riesgo aceptado). Una diferencia persistente agrega hasta 4 filas de auditoría por minuto; la revisión añade que cualquiera puede provocarla enviando una fracción de URC a una dirección pública, porque `UniCoin` admite transferencias.
3. **Para definir en HU-13, primer uso del libro:** una clave repetida con otros datos devuelve el original (`a-09-libro-mayor.e2e-spec.ts` lo exige, también de otra billetera); `monto` con más de 2 decimales se redondea en silencio; `fallido` puede pasar a `confirmado`, y un reintento con otra clave contaría doble; con un movimiento `pendiente` atascado la billetera deja de conciliarse.
4. **Sin corregir, no bloquean:** con el nodo caído, `/mia` pide huella y da 503, porque lee la cadena para devolver datos de la BD; el aviso de sincronización sigue tras un refresco en línea si la dirección no cargó; el caché de saldo no guarda fallas ni lecturas en curso; `formatearHoraLocal` y `fallaDe` duplican lógica de `@/i18n` y `billetera.tsx`.

**Verificado:** backend lint, build, 395 unitarias y 318 e2e en Node 24, antes de los arreglos de `mobile`, que no lo tocan; mobile lint, tipos y 247 pruebas en Node 24. Prettier marca 114 archivos de `backend` en Windows: solo difieren los finales de línea (con `--end-of-line auto` pasa).

**Sin verificar:** CI real. Los arreglos de `mobile` no se probaron en el teléfono ni en web; la prueba nueva cubre el reintento y el aviso rojo no tiene prueba propia.

**Archivos afectados:** `mobile/src/app/movimientos.tsx`, `mobile/src/app/(pestanas)/billetera.tsx`, `mobile/src/__tests__/movimientos.test.tsx`.

---

## 2026-11-07 · HU-13: alineación de spec, plan y ssd antes de implementar (Resuelve D-10)

**Evento:** El plan aprobado el 02/11 contradecía a su propia spec y a `ssd.md`. El integrante toma las decisiones pendientes. El ajuste de spec y plan queda por aprobar antes de escribir código.

**Decisión:**
1. **D-10, cola:** tabla `trabajos_onchain` y worker. Confirmar responde 202 "procesando" y la app consulta `GET /recargas/:id`. Se descarta acuñar dentro de la petición: un corte dejaría el movimiento pendiente sin nadie que lo retome, y `spec.md` §4 pide reintento automático.
2. **Doble acuñación (A-09):** `UniCoin.acunar` no tiene id, así que reintentar tras una respuesta perdida acuñaría dos veces. Se agrega `acunarRecarga(destino, monto, idOrden)`, que revierte si el id ya se usó (autorizado, `AGENTS.md` §14). `acunar` queda para subsidios.
3. **Relayer:** `RELAYER_LLAVE_PRIVADA` solo en Hardhat y desarrollo. En producción el arranque falla mientras no exista el firmante KMS, que queda en SP129, al desplegar. Se autoriza `qrcode` en backend.
4. **Libro mayor:** una clave repetida con otros datos falla; un monto con más de 2 decimales se rechaza; `fallido` es final; un `pendiente` atascado se sigue reintentando y alerta en auditoría a los 5 intentos; la conciliación no cambia. Cambian a propósito dos pruebas de `a-09-libro-mayor.e2e-spec.ts`.
5. **Endpoints (lo responde CA-4):** `POST /recargas` sin firma y `POST /recargas/:id/confirmar` con firma. `/simular-pago` sale de `ssd.md`.

**Tareas nuevas:** SP126 (contrato), SP127 (worker), SP128 (libro mayor), SP129 (firmante KMS, al desplegar).

**Archivos afectados:** `SPECS/features/sprint-2/HU-13-recarga-saldo/{spec,plan}.md`, `SPECS/ssd.md`, `SPECS/roadmap.md`, `.agents/STEERING/backlog.md`, `.agents/MEMORY/{MEMORY,HEARTBEAT}.md`.

---

## 2026-11-07 · HU-13: backend y contrato implementados (SP109–SP113, SP126–SP128)

**Evento:** El integrante aprueba el ajuste de spec y plan, y se implementan el contrato y el backend. Rama `feat/HU-13-recarga-saldo` en `contracts` (desde `develop`) y en `backend` (apilada sobre HU-14). Falta móvil (SP114).

**Decisión:**
1. **Respuesta perdida:** el worker consulta `ordenAcunada` antes de enviar y, si ya está acuñada, toma el hash del evento. Es más simple que interpretar el error del envío, porque ethers no decodifica un error propio al estimar gas. El contrato sigue revirtiendo con `OrdenYaAcunada` si dos intentos se cruzan. Se agregó el getter público `ordenAcunada`.
2. **Sin transacción abierta durante la cadena:** a diferencia de la cola de correos, tomar un trabajo lo reserva 5 min en un solo `UPDATE` con `SKIP LOCKED`. Un corte se retoma solo; `idOrden` evita acuñar dos veces.
3. **Caché del proveedor apagada:** con los 250 ms de ethers, dos acuñaciones seguidas leían el mismo nonce y la segunda daba `NONCE_EXPIRED`. Lo encontró la prueba real, no las pruebas con cadena simulada; esta corrección no tiene prueba automatizada.
4. **`monto` no numérico:** responde `VALIDACION_FALLIDA`. `MONTO_INVALIDO` queda para más de 2 decimales.
5. **`@types/qrcode`** se agrega como dependencia de desarrollo junto con `qrcode`, autorizada el 07/11.

**Verificado:** `backend` lint, formato, 434 unitarias (cobertura 92,79 %), 375 e2e y build; `contracts` lint, 18 pruebas y build; `prisma migrate diff` sin diferencias. Prueba real con el backend en su proceso, `UniCoin` en un nodo Hardhat y firmas P-256: montos rechazados, confirmar sin firma da 401, acuñación con `balanceOf` y evento, repetir da 200 con el mismo hash, respuesta perdida sin doble acuñación, dos órdenes seguidas sin reintentos, orden vencida da 410 y nodo caído deja la orden en `procesando`. Tras caer el nodo no se comprobó que la orden termine acreditada contra Hardhat: esa recuperación está probada con la cadena simulada.

**Sin verificar:** Polygon Amoy (`queryFilter` sin `fromBlock` puede chocar con el límite de rango de un RPC público; si pasa, el worker reintenta y alerta). El firmante KMS no existe: **con HU-13 fusionada, producción no arranca hasta SP129**. La firma real con huella se prueba con el móvil.

**Observado:** `test/membresias/decision.e2e-spec.ts` (HU-03) falló una vez con un timeout de 10 s en `beforeAll`, tras colgarse 135 s. Pasó sola y en las dos corridas completas siguientes; no se encontró la causa y no toca código de HU-13. `npm audit` de `backend` sigue en 7 altas, igual que antes de `qrcode`; `contracts` reporta 14 altas, sin revisar. Un `npm audit fix` no se aplicó.

**Diagramas a actualizar:** secuencia de recarga (ya en `plan.md` §5); clases, con `OrdenRecarga` y `TrabajoOnchain`.

**Archivos afectados:** `contracts/contracts/UniCoin.sol`, `contracts/test/UniCoin.ts`; `backend/prisma/`, `backend/src/billetera/`, `backend/src/blockchain/`, `backend/src/i18n/es-BO.json`, `backend/test/`; `.env.example`; `SPECS/features/sprint-2/HU-13-recarga-saldo/{spec,plan}.md`, `SPECS/roadmap.md`, `.agents/STEERING/backlog.md`, `.agents/MEMORY/{MEMORY,HEARTBEAT}.md`.

---

## 2026-11-07 · HU-13: pantalla de recarga en el móvil (SP114)

**Decisión:** `src/app/recargar.tsx` es una sola ruta con pasos en memoria (monto, QR, en camino, acreditada, vencida), así "atrás" nunca vuelve a un QR ya pagado. El QR es la imagen del servidor con `Image`, sin dependencias nuevas. Al llegar a cero, la pantalla consulta `GET /billetera/recargas/:id` antes de decir "no se cobró nada". Billetera muestra un aviso por cada recarga pendiente de la primera página de movimientos, sin sumarlas, y relee saldo y pendientes al recuperar el foco, sin firma.

**Razón:** una confirmación cuya respuesta se perdió ya no vence en el servidor, así que el reloj del teléfono no puede afirmar que no hubo cobro. Sumar montos obligaría a pasar por `Number`. Releer sin firma actualiza el saldo sin gastar una huella (CA-1).

**Verificado:** `mobile` lint, tipos y 282 pruebas. En navegador contra el backend con cadena simulada, a 360 y 412 dp, con una llave P-256 de prueba inyectada como módulo nativo, de modo que el servidor validó firmas reales: monto, errores de rango y decimales, QR, una sola firma al confirmar, en camino, acreditada, saldo actualizado sin otra firma, movimiento en el historial, orden vencida (410), pago repetido (CA-3) y sin identidad (CA-6). El aviso de pendiente se vio con un movimiento insertado por SQL, y el pago repetido y el vencimiento se forzaron por SQL.

**Sin verificar:** huella real en el teléfono y contra `UniCoin` en Hardhat desde la app. Falla de red al confirmar y QR que llega a cero: solo con Jest. Build de `mobile` sin correr en esta parte.

**Diferencia con el prototipo:** "Recarga en camino" no lleva la tarjeta con la fila del movimiento y Billetera no agrega "1 URC = 1 Bs". Decidir en la verificación.

**Archivos afectados:** `mobile/src/app/recargar.tsx`, `mobile/src/app/(pestanas)/billetera.tsx`, `mobile/src/app/movimientos.tsx`, `mobile/src/api/cliente.ts`, `mobile/src/i18n/es-BO.json`, `mobile/src/pruebas/respuestasApi.ts`, `mobile/src/__tests__/`.

---

## 2026-11-07 · HU-13: verificación en sesión limpia

**Evento:** Se verifican CA-1 a CA-6 y las amenazas A-08 a A-13 contra `UniCoin` en un nodo Hardhat, con el worker real y un proxy RPC que apaga el nodo y pierde respuestas, por API y desde la app con una llave P-256 de prueba.

**Defectos corregidos:**
1. **Orden atascada en Amoy (`backend`, `c608dff`):** el RPC público de Amoy rechaza `eth_getLogs` desde el bloque 0 con `exceed maximum block range: 10000`. Con una respuesta perdida, los tokens quedaban acuñados y la orden en `procesando` sin salida. Ahora el hash se busca hacia atrás por ventanas de 1000 bloques, hasta 500 ventanas (unos 11 días en Amoy). Más allá, el worker sigue reintentando con su alerta.
2. **Swagger:** el 401 de `confirmar` no nombraba `FIRMA_DISPOSITIVO_INVALIDA` ni `PETICION_EXPIRADA`.
3. **Nonce:** el arreglo de la caché del proveedor ya tiene prueba automatizada; se comprobó que falla sin el arreglo.
4. **Paridad (`mobile`, `8f51fb3`):** "Recarga en camino" lleva la fila del movimiento y Billetera agrega "1 URC = 1 Bs".

**Verificado:** `backend` lint, formato, 436 unitarias (cobertura 92,98 %), 375 e2e y build; `mobile` lint, formato, tipos, 282 pruebas y build; `contracts` lint, 18 pruebas y build. Contra el contrato: contrato, API y libro mayor coinciden en cada paso; 8 confirmaciones simultáneas dejan un movimiento y un evento; respuesta perdida de verdad sin doble acuñación; con el nodo caído la orden sigue en `procesando`, alerta una vez al quinto intento y termina acreditada al volver el nodo. Desde la app: falla de red al confirmar, QR que llega a cero (pagado y sin pagar), pago repetido sin tocar la base, huella cancelada, sin identidad e historial vacío, a 360 y 412 dp. Con eso sale de "sin verificar" lo que había quedado solo con Jest.

**Diferencias con el prototipo que quedan:** el diálogo de huella es el nativo genérico, sin el monto; el aviso "Tu pago quedó registrado" se ve siempre, porque la API no distingue un nodo caído de una espera normal; "Otro monto" no lleva el sufijo Bs; la etiqueta Pendiente usa reloj de arena (viene de HU-14).

**Sin verificar:** huella y Keystore reales, en el teléfono. Acuñar en Amoy: contrato sin desplegar y relayer sin fondos (SP23, SP129); del RPC solo se comprobó la ventana de bloques. Montos rápidos con TalkBack: usan `selected` sobre `radio`, igual que Movimientos.

**Dependencias:** altas en `backend` 7 y `mobile` 6, sin cambio por esta historia. `contracts` reportó 14 en la implementación, sin revisar. No se tocó ninguna dependencia.

**Archivos afectados:** `backend/src/blockchain/blockchain.service.ts`, `backend/src/blockchain/blockchain.service.spec.ts`, `backend/src/billetera/recargas.controller.ts`; `mobile/src/app/recargar.tsx`, `mobile/src/i18n/es-BO.json`, `mobile/src/__tests__/`; `SPECS/features/sprint-2/HU-13-recarga-saldo/spec.md`, `SPECS/roadmap.md`, `.agents/STEERING/backlog.md`, `.agents/MEMORY/{MEMORY,HEARTBEAT}.md`.

---

## 2026-11-07 · HU-13: huella real en el teléfono

**Evento:** Se prueba la recarga en el teléfono físico (Infinix X669, Android 12, TEE) contra `UniCoin` en un nodo Hardhat, con la huella del integrante y un proxy que cuenta las peticiones firmadas. Sin cambios de código.

**Verificado:** Una firma por confirmación: el integrante vio 2 huellas (abrir Billetera y pagar) y el registro muestra 2 firmadas. Crear la orden, consultarla y volver a Billetera no firman. Recargar 50 Bs acredita: contrato, libro y app coinciden. Cancelar la huella no llama a `confirmar`, no cobra y deja reintentar la misma orden, que acredita 20 Bs (contrato, libro y app en 70, 2 eventos). Cerrar un QR sin pagar no crea movimiento. Billetera, monto y QR sin desbordes a 412 dp.

**TalkBack, montos rápidos:** el elegido dice "Seleccionado, 20 Bs, botón de selección, tocar 2 veces para seleccionar"; los demás no dicen "Seleccionado". Se distinguen. El elegido repite la pista de tocar 2 veces, igual que en Movimientos; queda sin corregir.

**Sin verificar:** dedo no registrado en esta pantalla (probado con el mismo módulo en SP125, sin firma). "Recarga en camino" en el teléfono: Hardhat acuña antes de la consulta de 3 s; vista en web con el nodo caído. Invalidación al registrar una huella nueva, StrongBox, Play Integrity real y Amoy.

**Archivos afectados:** `SPECS/roadmap.md`, `.agents/STEERING/backlog.md`, `.agents/MEMORY/{MEMORY,HEARTBEAT}.md`.

---

## 2026-11-07 · HU-13: revisión de código y últimas pruebas en el teléfono

**Evento:** Revisión de todo el cambio de HU-13 en `backend`, `mobile` y `contracts`, antes de subirlo. 10 hallazgos, comprobados contra el código.

**Corregidos:**
1. Una falla de la BD después de acuñar detenía el lote y nunca sumaba intentos, así que la alerta no salía (`backend` `c6a67e8`).
2. La misma clave de idempotencia con otra reserva pasaba como la misma operación (`backend` `b15640a`, A-09).
3. Billetera no se actualizaba sola con una recarga pendiente: ahora consulta cada 5 s mientras la pantalla está a la vista y hay pendientes, sin huella (`mobile` `5cb8227`, también lo siguiente).
4. Movimientos no recargaba al volver de recargar y seguía invitando a recargar.
5. Consultar una orden aún pendiente borraba el error a la vista.
6. Un rechazo del servidor al consultar se reintentaba sin fin y sin aviso: ahora se muestra y deja de consultar.
7. "Seguimos intentando" salía en toda recarga: ahora solo si tarda más de 30 s (RN-6).

**Pasan a SP129:** esperar N confirmaciones antes de dar por acuñada una recarga, y reemplazar con más gas una transacción atascada. Solo importan con el firmante real.

**Sin cambio:** producción no arranca sin SP129, aprobado el 07/11. La revisión propone una opción más estrecha: arrancar sin relayer y dejar que las recargas reintenten. Queda a decisión del integrante.

**Verificado en el teléfono** (Infinix X669, `UniCoin` en Hardhat, sin compilar el APK): un dedo no registrado dice "no reconocido", y al cancelar no hay petición a `confirmar`, ni evento, ni cambio en el contrato. Con el nodo cortado por un proxy RPC: "Recarga en camino" con su fila, el aviso de reintento a los 30 s y Billetera con la recarga pendiente. Al devolver el nodo, Billetera pasa a 50,00 URC y quita el aviso sin tocar nada y sin otra huella: contrato, libro y app coinciden, 1 evento; después deja de consultar. Desde el historial vacío, recargar y cerrar muestra el movimiento nuevo.

**Regresión:** `backend`, `mobile` y `contracts`: lint, formato, pruebas, e2e y build en verde.

**Sin verificar:** invalidación al registrar una huella nueva, StrongBox, Play Integrity real, Amoy y CI real.

**Archivos afectados:** `backend/src/blockchain/`, `backend/src/billetera/movimientos.service.ts`; `mobile/src/app/recargar.tsx`, `mobile/src/app/movimientos.tsx`, `mobile/src/app/(pestanas)/billetera.tsx`, `mobile/src/__tests__/`; `.agents/STEERING/backlog.md`, `.agents/MEMORY/{MEMORY,HEARTBEAT}.md`.

---

## 2026-11-07 · HU-17: contrato del backend y ajustes al plan

**Evento:** Se implementan SP115 a SP118 en `backend`, rama `feat/HU-17-publicar-viaje`, apilada sobre HU-13: tabla `viajes` con RLS, validaciones, `POST /viajes`, `GET /viajes/mis-viajes` y `GET /viajes/:id`.

**Ajustes al plan aprobado** (la spec y `ssd.md` los responden; no cambia ningún criterio):
1. **Precio:** el plan fijaba `CHECK (precio_por_asiento BETWEEN 1.00 AND 20.00)`, pero CA-3 da 20 URC solo como ejemplo del tope de cada organización y `organizaciones.precio_maximo_urc` admite otros valores. Con el CHECK fijo, una organización con tope 50 respondería 500 al publicar a 30. Queda `CHECK (>= 1)` y la API valida contra el tope de la organización.
2. **Solape entre organizaciones:** el conductor es la misma persona en todas sus organizaciones (HU-07), y RLS le escondería un viaje suyo de otra. Dentro de la transacción, el contexto de plataforma se abre solo para leer sus propios viajes y se cierra antes del INSERT, que sigue sujeto a RLS. No cambia ninguna política. Un candado por conductor evita que dos publicaciones simultáneas pasen juntas la comprobación.
3. **`mis-viajes`:** el plan pide solo sesión; devuelve los viajes de la persona en todas sus organizaciones, siempre filtrados por conductor. Tiene un tope de 100, sin paginar.
4. **Detalle:** el plan omitía `fechaHoraSalida`; se agrega.

**Interpretaciones de la spec:** un viaje ocupa al conductor en `publicado`, `reservado` y `en_curso`; con exactamente 2 horas entre salidas no hay solape. `verificado` y `pagado` ya no ocupan.

**Permisos:** el rol de la API solo tiene SELECT e INSERT sobre `viajes`. Las historias que cambien estado o cupos deben otorgar UPDATE de esas columnas.

**Verificado:** regresión de `backend` en verde (lint, formato, pruebas con cobertura, e2e y build). Prueba real por HTTP contra un backend en marcha, con firma ECDSA de una llave de prueba: CA-1 a CA-7, repetir una petición capturada, el tope de otra organización, el solape entre organizaciones y las 3 rutas en Swagger. En PostgreSQL, con el rol de la API: otra organización no ve ni inserta, sin contexto no se ve nada, no puede actualizar ni borrar, y los CHECK rechazan cupos, precio y coordenadas fuera de rango.

**Sin verificar:** verificación en sesión limpia, móvil y teléfono real.

**Sin decidir:** si una cuenta suspendida puede publicar, y qué rol exige `GET /viajes/{id}` (`ssd.md` pide miembro verificado con firma; el plan, solo miembro). Están en `HEARTBEAT.md`.

**Archivos afectados:** `backend/prisma/schema.prisma`, `backend/prisma/migrations/011_viajes/`, `backend/src/viajes/`, `backend/src/aplicacion.module.ts`, `backend/src/i18n/es-BO.json`, `backend/test/viajes/`, `backend/test/ataques/a-08-publicar-viaje.e2e-spec.ts`, `backend/test/ataques/a-13-viajes.e2e-spec.ts`, `backend/test/ayudas-organizaciones.ts`, `backend/test/billetera/ayudas-billetera.ts`; `SPECS/features/sprint-2/HU-17-publicar-viaje/{spec,plan}.md`, `SPECS/roadmap.md`, `.agents/STEERING/backlog.md`, `.agents/MEMORY/HEARTBEAT.md`.

---
## 2026-11-07 · HU-17: pantalla móvil

**Evento:** Se implementa SP119 en `mobile`, rama `feat/HU-17-publicar-viaje`, apilada sobre HU-13: pestaña Publicar con los requisitos que faltan (CA-6), formulario firmado con la huella (CA-7) y pantalla de resultado.

**Ajustes al plan aprobado** (no cambia ningún criterio):
1. **`GET /viajes/limites`:** `DESIGN_SYSTEM.md` §9.2 y el prototipo piden mostrar el tope de la organización antes de fallar, y ningún endpoint de miembro lo daba. Es un agregado compatible; no se amplió `GET /yo`, que se limita a sus campos por HU-06 CA-7.
2. **Ruta:** la pantalla es la pestaña `app/(pestanas)/publicar.tsx`, como pide el prototipo, no `app/viajes/publicar.tsx`.
3. **Mapa sin librería:** agregar una requiere autorización (`AGENTS.md` §14). Es un mapa fijo con teselas de OpenStreetMap y su atribución, que no se puede mover.
4. **Búsqueda de lugar:** la política de Nominatim prohíbe autocompletar, así que se busca al pedirlo. Solo vale un lugar elegido de la lista, que trae coordenadas.
5. **Fecha y hora:** en vez de los dos campos del prototipo, un chip por cada fecha posible (hoy y 7 días) y la hora escrita con teclado numérico. No hace falta un diálogo nativo, y una fecha fuera de rango no se puede elegir. Es diferencia con el prototipo, a revisar en la paridad.
6. **Validar antes de firmar:** horario y precio se revisan también en la app para no gastar una huella en algo que el servidor rechazará. Decide el servidor.

**Limitaciones:** el aviso de solape no dice con qué viaje choca, porque la API solo devuelve `margenHoras`. La búsqueda cubre toda Bolivia, sin priorizar la ciudad de la organización: un nombre común trae lugares de otros pueblos y se distinguen por la dirección completa.

**Verificado:** pruebas de `mobile` en verde (lint, formato, tipos, Jest y build) y regresión de `backend` con e2e. En navegador, contra un backend real con una llave P-256 inyectada: requisitos, límites, errores, Nominatim y teselas reales, CA-1 con fila en la base, una firma por publicación y CA-5, a 360 y 412 dp.

**Sin verificar:** verificación en sesión limpia y teléfono físico: huella real, Keystore, y Nominatim y teselas desde Android, donde el `User-Agent` sí se envía.

**Archivos afectados:** `mobile/src/app/(pestanas)/{publicar,_layout,index}.tsx`, `mobile/src/componentes/{SelectorLugar,MapaRuta,Mensajes}.tsx`, `mobile/src/servicios/geocoding.ts`, `mobile/src/api/cliente.ts`, `mobile/src/i18n/es-BO.json`, `mobile/src/pruebas/respuestasApi.ts`, `mobile/src/__tests__/publicar.test.tsx`; `backend/src/viajes/`, `backend/test/viajes/publicar.e2e-spec.ts`; `SPECS/features/sprint-2/HU-17-publicar-viaje/{spec,plan}.md`, `SPECS/roadmap.md`, `DESIGN_SYSTEM.md`, `.agents/STEERING/backlog.md`, `.agents/MEMORY/HEARTBEAT.md`.

---

## 2026-11-07 · HU-17: una cuenta suspendida no publica

**Decisión del integrante:** una cuenta suspendida no puede publicar viajes. Con la billetera bloqueada no podría cobrarlos, y los pasajeros verían una oferta de alguien sancionado.

**Cómo queda:** `POST /viajes` y `GET /viajes/limites` responden 403 `CUENTA_SUSPENDIDA`, con el `CuentaActivaGuard` de la billetera, después de la membresía y antes de identidad y firma. Se exige también en `limites` porque firmar pide la huella antes de enviar: así la app lo sabe al abrir la pestaña y no muestra el formulario. El texto del backend deja de nombrar la billetera, porque ya no es exclusivo de ella.

**Sin decidir:** qué pasa con los viajes ya publicados por alguien que luego es suspendido; siguen activos. Toca la máquina de estados (`AGENTS.md` §14). Está en `HEARTBEAT.md`.

**Verificado:** e2e de `backend` y pruebas de `mobile`. Sin mirar todavía en navegador: entra en la verificación en sesión limpia.

**Archivos afectados:** `backend/src/viajes/viajes.{controller,module}.ts`, `backend/src/i18n/es-BO.json`, `backend/test/viajes/publicar.e2e-spec.ts`, `mobile/src/app/(pestanas)/publicar.tsx`, `mobile/src/i18n/es-BO.json`, `mobile/src/__tests__/publicar.test.tsx`; `SPECS/features/sprint-2/HU-17-publicar-viaje/{spec,plan}.md`, `.agents/MEMORY/HEARTBEAT.md`.

---

## 2026-11-07 · HU-17: verificación en sesión limpia

**Evento:** Se verifican CA-1 a CA-7, A-08, A-13 y la cuenta suspendida por criterio y por riesgo, contra el backend real y en la app a 360 y 412 dp.

**Defectos corregidos en `mobile`:**
1. Tras tocar Publicar sin lugar, el error genérico tapaba lo que respondía la búsqueda.
2. Al fallar, la pantalla subía al principio y un error de precio u hora quedaba fuera de la vista. Ahora lleva al primer campo con error, con foco, y avisa arriba si hay más de dos (`DESIGN_SYSTEM.md` §9.2.4).
3. Con la membresía revocada en la organización activa y aprobada en otra decía "No hay conexión". Ahora lo dice y deja elegir otra.
4. Al intercambiar quedaba el error sobre el lugar ya lleno.
5. Al volver de resolver un requisito quedaba el aviso viejo.
6. "Tu vehículo tiene 1 asientos".

**Paridad con el prototipo:** el vehículo hecho muestra la placa, el resultado lleva los puntos del trayecto, y el error de hora dice desde cuándo se puede salir. El rechazo por solape dice con qué viaje choca, para lo que `VIAJE_SOLAPADO` agrega `salidaExistente`: es un viaje del propio conductor y es un agregado compatible.

**Diferencias que quedan:** el micrófono apagado llega con `BotonVoz` (HU-27, HU-28), y "Te avisaremos cuando alguien reserve" no se promete mientras no haya esa notificación. La X del resultado y ocultar las pestañas no cambian el flujo. Fecha en chips con hora escrita, y origen y destino fuera de la tarjeta del mapa, están en `HEARTBEAT.md` para que decida el integrante.

**Verificado:** peticiones reales de cada error del plan, datos forzados, 8 publicaciones simultáneas (entra 1), la misma firma 5 veces a la vez (entra 1), RLS con el rol de la API, Swagger y esquema de Prisma sin diferencias con la base. En la app, cada rechazo del servidor con el formulario abierto, huella cancelada simulada, sin red, cuenta suspendida, datos largos, teclado y foco. Regresión en verde: `backend` 452 unitarias, 455 e2e y cobertura de 92 %; `mobile` 321 pruebas y build.

**Sin verificar:** teléfono físico: huella y Keystore reales, Nominatim y teselas desde Android, TalkBack.

**Sin decidir:** están en `HEARTBEAT.md`.

**Archivos afectados:** `backend/src/viajes/viajes.{controller,service,service.spec}.ts`, `backend/test/viajes/publicar.e2e-spec.ts`, `mobile/src/app/(pestanas)/publicar.tsx`, `mobile/src/componentes/{Campo,SelectorLugar}.tsx`, `mobile/src/i18n/es-BO.json`, `mobile/src/pruebas/respuestasApi.ts`, `mobile/src/__tests__/publicar.test.tsx`; `SPECS/features/sprint-2/HU-17-publicar-viaje/{spec,plan}.md`, `SPECS/roadmap.md`, `.agents/STEERING/backlog.md`, `.agents/MEMORY/HEARTBEAT.md`.

---

## 2026-11-07 · HU-17: prueba en teléfono físico

**Evento:** Se prueba en un Infinix X669 (Android 12, TEE) publicar con huella y Keystore reales, cancelar, solape, error de hora, Nominatim y teselas reales, TalkBack en chips y asientos, y 412 dp, contando las firmas en un registro.

**Defectos corregidos, que no se veían en navegador:**
1. Con un campo con foco, Android devolvía el desplazamiento a ese campo y el aviso de arriba quedaba fuera de la vista. Ahora se suelta el foco.
2. Dos huellas. La hora se firmaba antes de abrir el aviso: tardar más de 30 s daba 401, y el cliente reintentaba cualquier 401 con otra huella.
3. Hueco de 48 dp sobre las pestañas en Publicar e Inicio: `ZonaAccion` contaba otra vez el margen del sistema. Nueva propiedad `enPestanas`.
4. Un nombre de lugar largo se veía sin su comienzo.

**Decisión técnica (firma, a pedido del integrante):** el módulo nativo recibe el mensaje en dos partes y toma la hora tras la huella, con lo que `firmar` devuelve firma y marca. El mensaje canónico, la ventana de 30 s y el servidor no cambian. Un 401 solo se reintenta si es `NO_AUTENTICADO`, y con la misma firma: `JwtGuard` rechaza antes de que `FirmaDispositivoGuard` gaste el nonce (prueba de ataque en `a-08-publicar-viaje.e2e-spec.ts`). `PETICION_EXPIRADA` y `FIRMA_DISPOSITIVO_INVALIDA` van a la pantalla sin otra huella. Vale para toda petición firmada, también billetera y recargas. Exige recompilar el APK.

**Comprobado tras el cambio:** aviso abierto 44 s: 1 firma y 201. Token vencido de verdad: 401, renovación y 201 con 1 solo aviso. Billetera: 1 huella.

**Pruebas:** la animación de `Ilustracion` dejaba un temporizador que rompía otra suite al azar; `publicar.test.tsx` activa "reducir movimiento".
