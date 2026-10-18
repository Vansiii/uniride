# Sprint Backlog — UniRide

> Lista táctica de tareas. Agrupada por sprint y luego por HU/PB. Las descripciones de las historias viven en `SPECS/roadmap.md` y sus criterios en cada `spec.md`; acá solo hay tareas.
> Las tareas de una HU se agregan solo cuando su `plan.md` está aprobado. Al completar una tarea, marcarla `[x]`; si completa una HU, verificar su DoD y actualizar `roadmap.md`.
> Formato: `- [ ] SPxx · tarea — Xh — @responsable`. Todos los integrantes implementan; los responsables se asignan en Trello y se copian acá.

## Sprint 0 · 14/10 – 20/10/2026 · Dejar listo el terreno técnico

### Gobierno
- [ ] SP01 · Nombrar el PO nominal y el Scrum Master nominal (D-04) y registrarlos en MEMORY — 0,5h — @[POR DEFINIR] · PO: quien dirige las sesiones (falta su nombre); SM: sin nombrar
- [x] SP02 · Reunión de decisiones: D-01 Prisma, D-02 EC2, D-03 Trello, D-04 roles nominales, D-06 Vitest/Jest, D-11 HU-17 a S2, D-14 sprints de 1 semana, D-18 50 % al conductor, D-19 todo en español — 2h — @equipo
- [ ] SP03 · Crear el tablero de Trello y cargar el Product Backlog y estas tareas — 1h — @[POR DEFINIR]
- [ ] SP04 · Asegurar al menos dos teléfonos Android físicos para pruebas de atestación (R-02) — 1h — @[POR DEFINIR]
- [ ] SP26 · Actualizar el documento técnico del Grupo 4 (§2 y §4: sprints de 1 semana, EC2, Prisma, Trello; §2.8 monorepo → repositorio principal con submódulos) — 1h — @[POR DEFINIR]

### PB-01 · Monorepo, CI y entornos
- [x] SP05 · Crear el repositorio GitHub con `mobile/`, `web/`, `backend/`, `contracts/`, `.gitignore`, README; incluir `SPECS/`, `.agents/` y `AGENTS.md`; ramas `main` y `develop` protegidas — 2h — @[POR DEFINIR] · @agente 14/10: principal `Vansiii/uniride` + 4 subrepositorios como submódulos, públicos; `main`/`develop` protegidas con ruleset (PR con 1 aprobación, sin borrado ni force-push; en los subrepositorios además CI `verificar` en verde)
- [x] SP06 · Scaffolding de `backend/`: NestJS + Prisma + Swagger + ESLint/Prettier + Jest + `/api/v1/salud` (fija versiones, D-05) — 4h — @[POR DEFINIR] · backend verde: lint, 1 unitaria, 2 e2e, build · @agente 14/10
- [x] SP07 · Scaffolding de `web/`: React + Vite + TS + ESLint/Prettier + Vitest + Testing Library — 3h — @[POR DEFINIR] · web verde: lint, 2 pruebas, build · @agente 14/10
- [x] SP08 · Scaffolding de `mobile/`: Expo con development build + TS + ESLint/Prettier + Jest (preset Expo) — 4h — @[POR DEFINIR] · mobile verde: lint, 2 pruebas, tipos + bundle Android · @agente 14/10
- [x] SP09 · Archivos `es-BO.json` y helper `t()` en `web/`, `mobile/` y `backend/` — 2h — @[POR DEFINIR] · @agente 14/10
- [ ] SP10 · `docker-compose.yml` (PostgreSQL + backend + nodo Hardhat) y `.env.example` según `ssd.md` §12 — 3h — @[POR DEFINIR] · en progreso: `docker-compose.yml`, Dockerfiles y `.env.example` listos; `docker compose config` válido; falta levantarlo (Docker Desktop apagado)
- [x] SP11 · Workflow de GitHub Actions: lint, pruebas y build por carpeta en cada PR — 4h — @[POR DEFINIR] · @agente 14/10: un `ci.yml` por subrepositorio; corrió en verde en `main` y `develop` de los cuatro
- [x] SP12 · Plantilla de pull request con el checklist DoD de `constitution.md` Art. 12 — 1h — @[POR DEFINIR] · @agente 14/10
- [ ] SP13 · AWS: cuenta del equipo, alertas de presupuesto, RDS, bucket S3 cifrado, instancia EC2 con Docker + Caddy y dominio para HTTPS (staging: D-09) — 6h — @[POR DEFINIR]
- [x] SP14 · Reemplazar `AGENTS.md` §9 con la tabla de comandos reales de cada carpeta — 1h — @[POR DEFINIR] · @agente 14/10

### PB-02 · Modelo de datos y arquitectura
- [ ] SP15 · Validar con el equipo el modelo de datos de `ssd.md` §6 y pasarlo a `schema.prisma` (D-07 resuelta) — 3h — @[POR DEFINIR]
- [ ] SP16 · Prueba de concepto de RLS con Prisma: dos organizaciones, rol sin privilegios, `set_config` en `$transaction`; prueba que demuestra que A-13 falla — 4h — @[POR DEFINIR]
- [ ] SP17 · Diagramas UML 2.5 iniciales: paquetes, despliegue y clases del dominio — 4h — @[POR DEFINIR]

### PB-03 · Prototipo Figma
- [ ] SP18 · Prototipo del flujo principal (buscar, reservar, abordar, pagar) en ≤ 4 pasos, con puntos de entrada de voz — 8h — @[POR DEFINIR]
- [x] SP19 · Prototipo de paneles web (alta de organización, afiliación, aprobación de miembros) — 4h — @agente 17/10 · en HTML (`prototipos/sprint-1.html`), no en Figma; confirmar con el equipo
- [x] SP85 · Prototipo navegable de todas las interfaces de S1: 16 vistas móviles y 10 web, trazadas a los CA, en `prototipos/sprint-1.html` — 4h — @agente 17/10
- [x] SP86 · Aprobación del PO de la identidad más expresiva (`DESIGN_SYSTEM.md` §3.5) — 1h — @PO 17/10 · falta la prueba al sol en un teléfono real (P-07)
- [x] SP83 · Sistema de diseño `DESIGN_SYSTEM.md` (tokens, navegación, componentes, estados, accesibilidad, microcopia); base para SP18–SP19 — 4h — @agente 16/10
- [x] SP84 · Marca (isotipo, logotipo, ícono de app) aprobada por el PO y aplicada a `mobile/` y `web/` en `feat/PB-03-marca` — 2h — @agente 16/10 · falta fusionar los PR

### PB-04 · Token URC y escrow
- [x] SP20 · Scaffolding de `contracts/`: Hardhat + OpenZeppelin + TS — 2h — @[POR DEFINIR] · @agente 14/10
- [x] SP21 · Contrato `UniCoin` (ERC-20 + Permit + AccessControl) con pruebas Hardhat — 5h — @[POR DEFINIR] · @agente 14/10
- [x] SP22 · Contrato `EscrowUniRide` (`bloquear`, `liberar`, `reembolsar` con reparto pasajero/conductor) con pruebas, incluida la de ataque A-09 (liberar sin rol o dos veces) — 8h — @[POR DEFINIR] · 13 pruebas Hardhat (5 de ataque A-09, 1 de A-10) · @agente 14/10
- [ ] SP23 · Despliegue de prueba en Polygon Amoy y script de despliegue en Hardhat local (R-04) — 2h — @[POR DEFINIR]

### Especificación de las HU del Sprint 1 (para que cumplan la DoR el 21/10)
Borradores listos el 14/10; cada tarea se cierra cuando el PO aprueba la spec.
- [x] SP24 · Especificar HU-01 (`SPECS/features/HU-01-alta-organizacion/spec.md`) — 2h — @[POR DEFINIR]
- [x] SP27 · Especificar HU-02 (`SPECS/features/HU-02-reglas-afiliacion/spec.md`) — 2h — @[POR DEFINIR]
- [x] SP28 · Especificar HU-05 (`SPECS/features/HU-05-registro-correo-institucional/spec.md`) — 2h — @[POR DEFINIR]
- [x] SP29 · Especificar HU-06 (`SPECS/features/HU-06-inicio-sesion/spec.md`) — 2h — @[POR DEFINIR]
- [x] SP30 · Especificar HU-03 (`SPECS/features/HU-03-aprobacion-miembros/spec.md`) — 2h — @[POR DEFINIR]
- [x] SP31 · Especificar HU-07 (`SPECS/features/HU-07-varias-organizaciones/spec.md`) — 2h — @[POR DEFINIR]
- [x] SP32 · Especificar HU-11 (`SPECS/features/HU-11-registro-vehiculo/spec.md`) — 2h — @[POR DEFINIR]
- [x] SP35 · Especificar HU-34 (`SPECS/features/HU-34-recuperacion-contrasena/spec.md`) — 2h — @[POR DEFINIR]
- [x] SP33 · Resolver con el equipo los valores sin definir de las specs, D-12, D-16, D-20, D-21 y agregar la HU de recuperación de contraseña (HU-34) — 2h — @equipo
- [x] SP36 · El PO nominal marca como `aprobada` cada spec de S1 (cierra SP24, SP27–SP32 y SP35) — 1h — @PO
- [x] SP34 · Escribir los `plan.md` de las 8 HU de S1 (borradores listos el 14/10; 142 h estimadas en total) — 4h — @agente
- [x] SP37 · Revisar y aprobar los 8 `plan.md` de S1 (incluye confirmar las dependencias nuevas y el cambio de RLS de HU-01) y copiar sus tareas a este backlog — 2h — @equipo
- [ ] SP38 · Planning Poker de las HU de S1 (confirmar PHU) en la Sprint Planning del 21/10 — 1h — @equipo

### Cierre del sprint
- [ ] SP25 · Sprint Review con el docente, Retrospective y resumen en MEMORY; tag `sprint-0` — 2h — @[POR DEFINIR]

## Sprint 1 · 21/10 – 27/10/2026 · Organizaciones y cuentas funcionando

Tareas copiadas de los `plan.md` aprobados el 14/10. Orden de implementación: HU-06 → HU-01 → HU-02 → HU-05 → HU-03 → HU-07 → HU-34 → HU-11. Total: 142 h. Si a mitad del sprint la velocidad no alcanza, HU-07 y HU-34 pasan a S2.

### HU-06 · Inicio de sesión (30 h)
- [x] SP39 · Infraestructura común backend: `PrismaService`, `ValidationPipe`, filtro de errores con `codigo`, Swagger, `t()` — 4h — @[POR DEFINIR] · @agente 17/10: `PrismaService` (adaptador pg), `ValidationPipe`, filtro con `codigo`, `t()`; se añadieron `@prisma/adapter-pg`, `pg` y `@types/pg` (Prisma 7 los exige; aprobado por el PO)
- [x] SP40 · Migración `001`: usuarios, tokens_refresco, registros_auditoria, roles de BD; semilla del super admin — 3h — @[POR DEFINIR] · @agente 17/10: migración `001` con RLS en la auditoría y semilla (`npm run prisma:semilla`); rol `uniride_app` lo crea `docker/postgres/01-rol-app.sh`
- [x] SP41 · `AuditoriaService` — 1h — @[POR DEFINIR] · @agente 17/10
- [x] SP42 · Iniciar sesión con bloqueo y respuesta uniforme — 3h — @[POR DEFINIR] · @agente 17/10
- [x] SP43 · Refrescar (rotación, límite absoluto, reuso) y cerrar sesión — 4h — @[POR DEFINIR] · @agente 17/10
- [x] SP44 · `JwtGuard` global, `@Publico`, `@UsuarioActual`, `GET /yo` — 2h — @[POR DEFINIR] · @agente 17/10: `membresias` de `GET /yo` va vacío hasta HU-05 (tabla `membresias`)
- [x] SP45 · Web: shell, router, cliente HTTP con renovación, pantalla de inicio de sesión — 4h — @[POR DEFINIR] · @agente 17/10
- [x] SP46 · Mobile: shell, cliente HTTP, almacenamiento seguro, pantallas de inicio de sesión y estado de membresía — 4h — @[POR DEFINIR] · @agente 17/10: `expo-secure-store`
- [x] SP47 · Pruebas HU-06 (CA-1 a CA-10) — 5h — @[POR DEFINIR] · @agente 17/10: 11 e2e + 5 unitarias backend, 8 web, 12 mobile; CA-7 del backend se prueba en HU-05 cuando exista `membresias`; CI con PostgreSQL

### HU-01 · Alta de organización (26 h)
- [ ] SP48 · `enOrganizacion` / `comoSuperAdmin`, `RolPlataformaGuard`, migración `002` con políticas RLS — 4h — @[POR DEFINIR]
- [ ] SP49 · Modelo: organizaciones, membresias, invitaciones, correos_salientes — 2h — @[POR DEFINIR]
- [ ] SP50 · Notificaciones: cola, worker con reintentos, cliente SES, modo consola, plantillas — 4h — @[POR DEFINIR]
- [ ] SP51 · Alta y listado de organizaciones (servicio, controlador, DTOs, Swagger, auditoría) — 3h — @[POR DEFINIR]
- [ ] SP52 · Invitaciones: reenviar, consultar, aceptar (cuenta nueva y existente) — 4h — @[POR DEFINIR]
- [ ] SP53 · Web: Organizaciones, Nueva organización, Aceptar invitación — 5h — @[POR DEFINIR]
- [ ] SP54 · Pruebas HU-01 (CA-1 a CA-8, ataques A-13 y de rol, worker) — 4h — @[POR DEFINIR]

### HU-02 · Reglas de afiliación (13 h)
- [ ] SP55 · Migración `003`: dominios_organizacion y función `organizacion_por_dominio` — 2h — @[POR DEFINIR]
- [ ] SP56 · `OrganizacionGuard` y `RolOrganizacionGuard` — 2h — @[POR DEFINIR]
- [ ] SP57 · Servicio y controlador de afiliación con validaciones y auditoría — 3h — @[POR DEFINIR]
- [ ] SP58 · Web: pantalla Afiliación — 3h — @[POR DEFINIR]
- [ ] SP59 · Pruebas HU-02 (CA-1 a CA-8, ataque A-13) — 3h — @[POR DEFINIR]

### HU-05 · Registro con correo institucional (21 h)
- [ ] SP60 · Migración `004`: codigos_otp — 1h — @[POR DEFINIR]
- [ ] SP61 · `OtpService` compartido (generar, verificar, bloqueo, límites, invalidación) — 4h — @[POR DEFINIR]
- [ ] SP62 · Endpoints de registro, verificación y reenvío; alta de usuario y membresía — 4h — @[POR DEFINIR]
- [ ] SP63 · `enviarAhora()` y plantillas de correo — 1h — @[POR DEFINIR]
- [ ] SP64 · Mobile: pantallas Registro y Código, y navegación al estado o al inicio — 6h — @[POR DEFINIR]
- [ ] SP65 · Pruebas HU-05 (CA-1 a CA-9, ataque A-13) — 5h — @[POR DEFINIR]

### HU-03 · Aprobación de miembros (11 h)
- [ ] SP66 · Módulo `membresias`: listar y decidir (actualización condicional, auditoría, correo) — 4h — @[POR DEFINIR]
- [ ] SP67 · Web: pantalla Solicitudes — 4h — @[POR DEFINIR]
- [ ] SP68 · Pruebas HU-03 (CA-1 a CA-7, ataque A-13, concurrencia) — 3h — @[POR DEFINIR]

### HU-07 · Varias organizaciones (13 h)
- [ ] SP69 · Agregar organización (validaciones, código, confirmar) — 3h — @[POR DEFINIR]
- [ ] SP70 · Cambiar organización activa con token nuevo — 2h — @[POR DEFINIR]
- [ ] SP71 · Mobile: Mis organizaciones y Agregar organización — 5h — @[POR DEFINIR]
- [ ] SP72 · Pruebas HU-07 (CA-1 a CA-7, ataque A-13) — 3h — @[POR DEFINIR]

### HU-34 · Recuperación de contraseña (12 h)
- [ ] SP73 · Endpoints de recuperar y restablecer (revocación de sesiones, auditoría, correos) — 3h — @[POR DEFINIR]
- [ ] SP74 · Web: pantallas de recuperación — 3h — @[POR DEFINIR]
- [ ] SP75 · Mobile: pantalla de recuperación — 3h — @[POR DEFINIR]
- [ ] SP76 · Pruebas HU-34 (CA-1 a CA-6) — 3h — @[POR DEFINIR]

### HU-11 · Registro de vehículo (16 h)
- [ ] SP77 · Migración `005`: vehiculos — 1h — @[POR DEFINIR]
- [ ] SP78 · `AlmacenamientoService` (S3 + SSE-KMS) y MinIO en `docker compose` — 3h — @[POR DEFINIR]
- [ ] SP79 · Endpoint de registro con validaciones, normalización y compensación; `GET /vehiculos/mio` — 4h — @[POR DEFINIR]
- [ ] SP80 · Mobile: pantalla Registrar vehículo — 5h — @[POR DEFINIR]
- [ ] SP81 · Pruebas HU-11 (CA-1 a CA-8) — 3h — @[POR DEFINIR]

### Cierre del sprint
- [ ] SP82 · Sprint Review con el docente, Retrospective, velocidad medida y resumen en MEMORY; tag `sprint-1` — 2h — @[POR DEFINIR]
