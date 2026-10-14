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
| D-10 | Cola de reintentos on-chain | Propuesta: tabla PostgreSQL + worker. Alternativa: SQS | HU-12 | No definido |
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
