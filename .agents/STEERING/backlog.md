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
- [x] SP124 · Prototipo navegable de las interfaces de S2 (HU-08, 09, 12, 13, 14, 17, 18): 31 vistas móviles trazadas a los CA y 7 decisiones para el PO, en `prototipos/sprint-2.html` — 4h — @agente 04/11
- [x] SP86 · Aprobación del PO de la identidad más expresiva (`DESIGN_SYSTEM.md` §3.5) — 1h — @PO 17/10 · falta la prueba al sol en un teléfono real (P-07)
- [x] SP83 · Sistema de diseño `DESIGN_SYSTEM.md` (tokens, navegación, componentes, estados, accesibilidad, microcopia); base para SP18–SP19 — 4h — @agente 16/10
- [x] SP84 · Marca (isotipo, logotipo, ícono de app) aprobada por el PO y aplicada a `mobile/` y `web/` en `feat/PB-03-marca` — 2h — @agente 16/10 · falta fusionar los PR
- [x] SP87 · Rediseño de UI de `web/` y `mobile/` sobre `DESIGN_SYSTEM.md` (tokens, componentes, navegación, estados, accesibilidad) — 6h — @agente 23/10 · PR web #6 (sobre #5) y mobile #3; falta revisión y prueba en Android físico

### PB-04 · Token URC y escrow
- [x] SP20 · Scaffolding de `contracts/`: Hardhat + OpenZeppelin + TS — 2h — @[POR DEFINIR] · @agente 14/10
- [x] SP21 · Contrato `UniCoin` (ERC-20 + Permit + AccessControl) con pruebas Hardhat — 5h — @[POR DEFINIR] · @agente 14/10
- [x] SP22 · Contrato `EscrowUniRide` (`bloquear`, `liberar`, `reembolsar` con reparto pasajero/conductor) con pruebas, incluida la de ataque A-09 (liberar sin rol o dos veces) — 8h — @[POR DEFINIR] · 13 pruebas Hardhat (5 de ataque A-09, 1 de A-10) · @agente 14/10
- [ ] SP23 · Despliegue de prueba en Polygon Amoy y script de despliegue en Hardhat local (R-04) — 2h — @[POR DEFINIR]

### Especificación de las HU del Sprint 1 (para que cumplan la DoR el 21/10)
Borradores listos el 14/10; cada tarea se cierra cuando el PO aprueba la spec.
- [x] SP24 · Especificar HU-01 (`SPECS/features/sprint-1/HU-01-alta-organizacion/spec.md`) — 2h — @[POR DEFINIR]
- [x] SP27 · Especificar HU-02 (`SPECS/features/sprint-1/HU-02-reglas-afiliacion/spec.md`) — 2h — @[POR DEFINIR]
- [x] SP28 · Especificar HU-05 (`SPECS/features/sprint-1/HU-05-registro-correo-institucional/spec.md`) — 2h — @[POR DEFINIR]
- [x] SP29 · Especificar HU-06 (`SPECS/features/sprint-1/HU-06-inicio-sesion/spec.md`) — 2h — @[POR DEFINIR]
- [x] SP30 · Especificar HU-03 (`SPECS/features/sprint-1/HU-03-aprobacion-miembros/spec.md`) — 2h — @[POR DEFINIR]
- [x] SP31 · Especificar HU-07 (`SPECS/features/sprint-1/HU-07-varias-organizaciones/spec.md`) — 2h — @[POR DEFINIR]
- [x] SP32 · Especificar HU-11 (`SPECS/features/sprint-1/HU-11-registro-vehiculo/spec.md`) — 2h — @[POR DEFINIR]
- [x] SP35 · Especificar HU-34 (`SPECS/features/sprint-1/HU-34-recuperacion-contrasena/spec.md`) — 2h — @[POR DEFINIR]
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
- [x] SP48 · `enOrganizacion` / `comoSuperAdmin`, `RolPlataformaGuard`, migración `002` con políticas RLS — 4h — @[POR DEFINIR] · @agente 23/10: `PrismaService.enOrganizacion/comoSuperAdmin`, `RolPlataformaGuard` (rol leído de BD), migración `002`
- [x] SP49 · Modelo: organizaciones, membresias, invitaciones, correos_salientes — 2h — @[POR DEFINIR] · @agente 23/10: tablas en `002`; `registros_auditoria` ya tenía RLS
- [x] SP50 · Notificaciones: cola, worker con reintentos, cliente SES, modo consola, plantillas — 4h — @[POR DEFINIR] · @agente 23/10: `CorreosService` + worker cada 30 s, máx. 5 intentos, SES v2 (`@aws-sdk/client-sesv2`), modo consola
- [x] SP51 · Alta y listado de organizaciones (servicio, controlador, DTOs, Swagger, auditoría) — 3h — @[POR DEFINIR] · @agente 23/10: `/admin/organizaciones`, auditoría en la misma transacción
- [x] SP52 · Invitaciones: reenviar, consultar, aceptar (cuenta nueva y existente) — 4h — @[POR DEFINIR] · @agente 23/10: consulta y aceptación públicas (410 uniforme), reenvío; token solo como hash
- [x] SP53 · Web: Organizaciones, Nueva organización, Aceptar invitación — 5h — @[POR DEFINIR] · @agente 23/10: Organizaciones, Nueva organización, Aceptar invitación
- [x] SP54 · Pruebas HU-01 (CA-1 a CA-8, ataques A-13 y de rol, worker) — 4h — @[POR DEFINIR] · @agente 23/10: 38 e2e backend (alta, invitaciones, A-13 API y SQL, rol, worker), 10 pruebas web nuevas

### HU-02 · Reglas de afiliación (13 h)
- [x] SP55 · Migración `003`: dominios_organizacion y función `organizacion_por_dominio` — 2h — @Nannj446 · @agente 24/10: migración `003` con RLS forzado; `organizacion_por_dominio` SECURITY DEFINER (solo el id, solo `activa`); rol de la API con SELECT, INSERT, DELETE en la tabla nueva
- [x] SP56 · `OrganizacionGuard` y `RolOrganizacionGuard` — 2h — @Nannj446 · @agente 24/10: `OrganizacionGuard` (membresía `aprobada` leída de BD), `RolOrganizacionGuard` + `@RolOrganizacion`, `@OrganizacionActual`
- [x] SP57 · Servicio y controlador de afiliación con validaciones y auditoría — 3h — @Nannj446 · @agente 24/10: `GET/PUT /organizaciones/{id}/afiliacion`, normalización, `DOMINIOS_PUBLICOS`, auditoría con anterior/nuevo, Swagger
- [x] SP58 · Web: pantalla Afiliación — 3h — @Nannj446 · @agente 24/10: `/organizacion/afiliacion` con dominios, modo y estados de carga/vacío/error; 14 pruebas nuevas (32 web); probada en navegador contra backend local a 360/768/1280
- [x] SP59 · Pruebas HU-02 (CA-1 a CA-8, ataque A-13) — 3h — @Nannj446 · @agente 24/10: 26 unitarias + 55 e2e backend (CA-1 a CA-8, A-13 en API y SQL, concurrencia); cobertura 80→86,8 %; CA-4/CA-5 de punta a punta con HU-05

### HU-05 · Registro con correo institucional (21 h)
- [x] SP60 · Migración `004`: codigos_otp — 1h — @Nannj446 · @agente 24/10: migración `004` (dato personal, sin RLS; rol de la API sin borrado)
- [x] SP61 · `OtpService` compartido (generar, verificar, bloqueo, límites, invalidación) — 4h — @Nannj446 · @agente 24/10: `OtpService` con HMAC + `timingSafeEqual`, `randomInt`, 10 min, bloqueo 15 min tras 5 errores, 1/min y 5/h, invalidación del anterior
- [x] SP62 · Endpoints de registro, verificación y reenvío; alta de usuario y membresía — 4h — @Nannj446 · @agente 24/10: `POST /autenticacion/registro`, `verificar-otp`, `reenviar-codigo`; alta de usuario y membresía según el modo; `GET /yo` ahora trae `membresias` (cierra HU-06 CA-7)
- [x] SP63 · `enviarAhora()` y plantillas de correo — 1h — @Nannj446 · @agente 24/10: `enviarAhora()`, plantillas `otp_registro` y `ya_tienes_cuenta`
- [x] SP64 · Mobile: pantallas Registro y Código, y navegación al estado o al inicio — 6h — @Nannj446 · @agente 24/10: `registro.tsx`, `codigo.tsx`, `CampoCodigo`, `Casilla`; 27 pruebas nuevas (40 mobile); probado en navegador (expo web) contra backend local a 360/412; falta probar en Android y el texto legal del consentimiento
- [x] SP65 · Pruebas HU-05 (CA-1 a CA-9, ataque A-13) — 5h — @Nannj446 · @agente 24/10: 70 unitarias + 77 e2e backend (CA-1 a CA-9, A-13 y `/yo`); cobertura 86,8→90,1 %

### HU-03 · Aprobación de miembros (11 h)
- [x] SP66 · Módulo `membresias`: listar y decidir (actualización condicional, auditoría, correo) — 4h — @Nannj446 · @agente 24/10: `GET /organizaciones/{id}/membresias?estado=pendiente` y `POST /membresias/{id}/decision`; update condicional, auditoría y correo en la misma transacción; motivo solo al rechazar
- [x] SP67 · Web: pantalla Solicitudes — 4h — @Nannj446 · @agente 25/10: Solicitudes (aprobar directo, rechazar con diálogo y motivo, ya decidida, vacío/error); menú por rol de la organización activa desde `/yo` y nombre de la organización en la barra lateral (pendiente de HU-02); 51 pruebas web; probada en navegador a 360/768/1280
- [x] SP68 · Pruebas HU-03 (CA-1 a CA-7, ataque A-13, concurrencia) — 3h — @Nannj446 · @agente 24/10: 79 unitarias + 95 e2e backend (CA-1 a CA-7, concurrencia 200+409, A-13 404 idéntico a inexistente); cobertura 90,9 %

### HU-07 · Varias organizaciones (13 h)
- [x] SP69 · Agregar organización (validaciones, código, confirmar) — 3h — @Nannj446 · @agente 26/10: `POST /membresias` (202) y `POST /membresias/confirmar`; organización solo por dominio; `YA_ES_MIEMBRO`, `MEMBRESIA_RECHAZADA`, `CORREO_EN_USO`; reenvío con propósito `agregar_organizacion`
- [x] SP70 · Cambiar organización activa con token nuevo — 2h — @Nannj446 · @agente 26/10: `PUT /yo/organizacion-activa` → token de acceso nuevo; `MEMBRESIA_NO_APROBADA` 403 igual sin membresía, pendiente o rechazada
- [x] SP71 · Mobile: Mis organizaciones y Agregar organización — 5h — @Nannj446 · @agente 26/10: `organizaciones.tsx`, `agregar-organizacion.tsx`, pantalla Código reutilizada, token nuevo al cambiar la activa; acceso desde inicio y estado de membresía; 73 pruebas mobile; probado con expo web a 360/412 contra backend local
- [x] SP72 · Pruebas HU-07 (CA-1 a CA-7, ataque A-13) — 3h — @Nannj446 · @agente 26/10: 96 unitarias + 115 e2e backend (CA-1 a CA-7, A-13 entre organizaciones propias); cobertura 92 %

### HU-34 · Recuperación de contraseña (12 h)
- [x] SP73 · Endpoints de recuperar y restablecer (revocación de sesiones, auditoría, correos) — 3h — @Nannj446 · @agente 26/10: `recuperar-contrasena` (202, código por la cola; sin cuenta, fila señuelo que no envía ni valida) y `restablecer-contrasena` (204: hash nuevo, revoca todos los refresh, levanta el bloqueo, auditoría y aviso `contrasena_cambiada`)
- [x] SP74 · Web: pantallas de recuperación — 3h — @Nannj446 · @agente 26/10: `/recuperar-contrasena` en 2 pasos, enlace "Olvidé mi contraseña" y aviso al volver; 68 pruebas web; probada en navegador a 360/768/1280 (sesiones previas → 401)
- [x] SP75 · Mobile: pantalla de recuperación — 3h — @Nannj446 · @agente 26/10: `/recuperar` (correo → código + contraseña nueva → listo) y enlace en Iniciar sesión; 94 pruebas mobile; en vivo: sesiones previas y contraseña vieja → 401, la nueva entra
- [x] SP76 · Pruebas HU-34 (CA-1 a CA-6) — 3h — @Nannj446 · @agente 26/10: 110 unitarias + 124 e2e backend (CA-1 a CA-6; con y sin cuenta: misma respuesta, 429 y bloqueo); cobertura 92,6 %

### HU-11 · Registro de vehículo (16 h)
- [x] SP77 · Migración `005`: vehiculos — 1h — @Nannj446 · @agente 27/10: migración `005` (placa y dueño únicos, CHECK de placa y capacidad 1–6; dato personal sin RLS; rol de la API solo SELECT e INSERT)
- [x] SP78 · `AlmacenamientoService` (S3 + SSE-KMS) y MinIO en `docker compose` — 3h — @Nannj446 · @agente 27/10: `AlmacenamientoService` con `@aws-sdk/client-s3`; cifrado por `S3_CIFRADO` (kms por defecto, `ninguno` prohibido en producción); MinIO del compose pasa a `bitnamilegacy/minio` (minio/minio ya no se publica)
- [x] SP79 · Endpoint de registro con validaciones, normalización y compensación; `GET /vehiculos/mio` — 4h — @Nannj446 · @agente 27/10: `POST /vehiculos` (multipart; JPEG/PNG por sus bytes, 5 MB; placa normalizada; borra la foto si falla la inserción) y `GET /vehiculos/mio`; la clave de la foto nunca sale
- [x] SP80 · Mobile: pantalla Registrar vehículo — 5h — @Nannj446 · @agente 27/10: `/vehiculo` (formulario con foto de cámara o galería y consentimiento; resumen sin foto si ya tiene vehículo), acceso "Mi vehículo" desde Inicio, `expo-image-picker` ~57.0.20; 133 pruebas mobile; probada con expo web a 360/412 contra backend local; falta cámara y galería en Android
- [x] SP81 · Pruebas HU-11 (CA-1 a CA-8) — 3h — @Nannj446 · @agente 27/10: 133 unitarias + 140 e2e backend (CA-1 a CA-4, CA-7, CA-8; placa en paralelo sin foto huérfana); cobertura 93,9 %; CA-5/CA-6 se prueban con HU-17

### Cierre del sprint
- [ ] SP82 · Sprint Review con el docente, Retrospective, velocidad medida y resumen en MEMORY; tag `sprint-1` — 2h — @[POR DEFINIR]

## Sprint 2 · 28/10 – 03/11/2026 · Identidad, billetera y primeros viajes

### HU-08 · Verificación de identidad (22 h)
- [x] SP88 · Modelo Prisma `identidades`, migración `006_identidades` y pruebas de repositorio — 3h — @[POR DEFINIR] · backend @agente 04/11 (rama local, sin push)
- [x] SP89 · `RekognitionService` con soporte para sesiones de vivacidad, comparación facial y colección (con mock `REKOGNITION_SIMULADO`) — 4h — @[POR DEFINIR] · backend @agente 04/11 (rama local, sin push)
- [x] SP90 · Endpoints `/liveness-sesion`, `/verificar`, `/estado` y guard `@RequiereIdentidadVerificada()` — 5h — @[POR DEFINIR] · backend @agente 04/11 (rama local, sin push)
- [x] SP91 · Suite de pruebas automatizadas y pruebas de ataque A-01 y A-02 (cobertura ≥ 70 %) — 4h — @[POR DEFINIR] · backend @agente 04/11 (rama local, sin push)
- [x] SP92 · Mobile: pantallas y flujo de verificación de identidad en Expo (consentimiento, carnet y vivacidad) — 6h — @[POR DEFINIR] · mobile @agente 05/11 (PR uniride-mobile#6; la prueba de vida real queda tras `ejecutarLiveness`, sin módulo nativo)

### HU-09 · Vinculación de dispositivo (26 h)
- [x] SP93 · Modelo Prisma `dispositivos`, migración `007_dispositivos` y pruebas de repositorio — 3h — @[POR DEFINIR] · backend @agente 04/11 (rama local, sin push)
- [x] SP94 · `PlayIntegrityService` (Google Play Integrity API y mock simulado bloqueado en prod) — 4h — @[POR DEFINIR] · backend @agente 04/11 (rama local, sin push)
- [x] SP95 · Endpoints de desafío de atestación, vinculación y consulta de dispositivo — 4h — @[POR DEFINIR] · backend @agente 04/11 (rama local, sin push)
- [x] SP96 · `FirmaDispositivoGuard` con verificación ECDSA P-256, nonce y ventana de 30s — 5h — @[POR DEFINIR] · backend @agente 04/11 (rama local, sin push)
- [x] SP97 · Suite de pruebas y pruebas de ataque A-03 (no íntegro), A-04 (llave ajena) y A-08 (sin firma) — 4h — @[POR DEFINIR] · backend @agente 04/11 (rama local, sin push)
- [x] SP98 · Mobile: integración con Android Keystore y pantalla de vinculación en Expo — 6h — @[POR DEFINIR] · mobile @agente 05/11 (PR uniride-mobile#7; pantalla, firma canónica y pruebas; Keystore/Play Integrity nativos pendientes de dev build)

- [x] SP125 · Mobile: módulo nativo local de Expo para Android Keystore (ECDSA P-256 no exportable, huella en cada firma con `BiometricPrompt` y `CryptoObject`), detrás de `keystore.ts`; prueba en teléfono físico. Requisito de SP103 y SP114 — 6h — @[POR DEFINIR] · mobile @agente 06/11: probado en Infinix X669 (TEE, sin StrongBox): el backend acepta la firma real; repetida, ajena y cancelada no pasan. Play Integrity sigue simulado. 07/11, en la rama de HU-17: la hora se firma tras la huella y una sesión vencida no pide otra

### HU-12 · Creación de billetera (16 h)
- [x] SP99 · Modelo Prisma `billeteras`, migración `008_billeteras` y repositorio — 2h — @[POR DEFINIR] · backend @agente 06/11: también `usuarios.suspendida_en` (spec §4); la API solo tiene SELECT e INSERT sobre `billeteras`
- [x] SP100 · `BlockchainService` (ethers.js, conexión Polygon Amoy/Hardhat y lectura de balance UniCoin) — 4h — @[POR DEFINIR] · backend @agente 06/11: solo redes 31337 y 80002, tope de 5 s; probado contra Hardhat, Amoy sin probar
- [x] SP101 · Endpoints de creación idempotente y consulta de billetera en backend — 3h — @[POR DEFINIR] · backend @agente 06/11: creación automática al aprobar la identidad y firma de dispositivo en ambos endpoints
- [x] SP102 · Suite de pruebas y validación de seguridad A-12 (sin llaves en BD) — 3h — @[POR DEFINIR] · backend @agente 06/11: 360 unitarias y 241 e2e en verde, cobertura 95,9 %, ataques A-02, A-08 y A-12
- [x] SP103 · Mobile: pantalla de Billetera en Expo (tarjeta de balance URC, dirección y accesos) — 4h — @[POR DEFINIR] · mobile @agente 06/11: pestaña Billetera probada en teléfono físico contra Hardhat; Recargar y Movimientos llegan con HU-13 y HU-14

### HU-14 · Saldo e historial (15 h)
- [x] SP104 · Modelo Prisma `movimientos_billetera`, migración `009_movimientos_billetera` e índices contables — 2h — @[POR DEFINIR] · backend @agente 06/11: solo inserción; el trigger congela lo confirmado y la API no tiene DELETE
- [x] SP105 · Lógica de conciliación de saldo (on-chain + escrow en BD) y endpoint `/saldo` — 3h — @[POR DEFINIR] · backend @agente 06/11: caché de 15 s; nodo caído o colgado da 200 con `enLinea: false`; las diferencias van a auditoría; sin firma de dispositivo. Probado contra Hardhat con `EscrowUniRide` real, Amoy sin probar · 07/11: un movimiento confirmado invalida el caché
- [x] SP106 · Endpoint paginado `/movimientos` y servicio de registro inmutable — 3h — @[POR DEFINIR] · backend @agente 06/11: filtro `?tipo=`, sin firma de dispositivo; el registro se usará desde HU-13
- [x] SP107 · Suite de pruebas automatizadas y prueba de conciliación contable — 3h — @[POR DEFINIR] · backend @agente 06/11: 395 unitarias y 318 e2e en verde (07/11), cobertura 95,7 %, ataques A-09 y A-10
- [x] SP108 · Mobile: pantalla de Historial de movimientos y componente `TarjetaSaldo` en Expo — 4h — @[POR DEFINIR] · mobile @agente 06/11: 247 pruebas en verde (07/11); probado en teléfono físico contra Hardhat con 46 movimientos, sin verificar, vacío y nodo caído. 07/11: web a 360 y 412, teléfono a 412 dp, enlace a Polygonscan en pantalla y una sola huella al abrir Billetera. Saldo en Inicio queda para HU-18

### HU-13 · Recarga de saldo (31 h)
- [x] SP109 · Modelo Prisma `ordenes_recarga` y `trabajos_onchain`, migración `010_ordenes_recarga` y repositorio — 2h — @[POR DEFINIR] · backend @agente 07/11: migración 010 aplicada; sin diferencias entre esquema y migraciones
- [x] SP110 · Servicio de generación de QR con expiración y cálculo de idempotencia — 3h — @[POR DEFINIR] · backend @agente 07/11: QR PNG en el servidor; la clave es `recarga:<ordenId>`
- [x] SP111 · Método `acunarRecarga` en `BlockchainService` e integración con relayer — 3h — @[POR DEFINIR] · backend @agente 07/11: probado contra UniCoin en Hardhat, también nodo caído y respuesta perdida; el evento se busca por ventanas de 1000 bloques; producción no arranca sin SP129
- [x] SP112 · Endpoint de confirmación de recarga con `FirmaDispositivoGuard` (D-13) — 4h — @[POR DEFINIR] · backend @agente 07/11: confirmar con firma, 202 o 200 idempotente
- [x] SP113 · Suite de pruebas automatizadas y prueba de ataque A-09 (doble acreditación) — 3h — @[POR DEFINIR] · backend @agente 07/11: e2e de recarga y ataques A-08, A-09, A-10 y A-11
- [x] SP114 · Mobile: pantalla de recarga en Expo (selector, QR y confirmación biométrica), botón Recargar y aviso de pendiente — 5h — @[POR DEFINIR] · mobile @agente 07/11: probada con Jest y en navegador contra UniCoin en Hardhat, con firma real de una llave de prueba; en teléfono físico (Infinix X669) contra UniCoin en Hardhat: una firma por confirmación, cancelar no cobra, reintentar acredita, 412 dp y TalkBack; tras la revisión, Billetera y Movimientos se actualizan solos, y dedo no registrado y "Recarga en camino" probados en el teléfono
- [x] SP126 · `UniCoin.acunarRecarga` idempotente con evento, y sus pruebas — 2h — @[POR DEFINIR] · contracts @agente 07/11: `acunarRecarga`, `ordenAcunada` y evento; contrato sin desplegar en Amoy
- [x] SP127 · Worker de `trabajos_onchain` con reintentos y alerta en auditoría (D-10) — 4h — @[POR DEFINIR] · backend @agente 07/11: reintentos hasta 1 h entre intentos y alerta única al quinto; tras la revisión, una falla de la BD después de acuñar también suma intento y llega a la alerta
- [x] SP128 · Libro mayor: clave en conflicto, decimales y `fallido` final — 2h — @[POR DEFINIR] · backend @agente 07/11: clave en conflicto, decimales y `fallido` final; tras la revisión, otra reserva con la misma clave también es conflicto
- [ ] SP129 · Firmante KMS del relayer (al desplegar; requiere `@aws-sdk/client-kms`), con N confirmaciones antes de dar por acuñada una recarga y reemplazo con más gas de una transacción atascada — 3h — @[POR DEFINIR] · backend

### HU-17 · Publicar viaje (18 h)
- [x] SP115 · Modelo Prisma `viajes`, migración `011_viajes` y políticas RLS por organización — 3h — @[POR DEFINIR] · backend @agente 07/11: el rol de la API solo tiene SELECT e INSERT; el precio máximo es el de cada organización, no un CHECK fijo de 20
- [x] SP116 · Lógica de validación de conductor, vehículo y anti-solapamiento — 3h — @[POR DEFINIR] · backend @agente 07/11: el solape cruza las organizaciones de la persona y es atómico por conductor; un viaje publicado ya pasado no cuenta y origen y destino iguales se rechazan (decisión del integrante)
- [x] SP117 · Endpoints `/viajes`, `/mis-viajes` y consulta de detalle — 4h — @[POR DEFINIR] · backend @agente 07/11: documentados en Swagger; verificados en sesión limpia
- [x] SP118 · Suite de pruebas y validación de amenazas A-08 y A-13 — 3h — @[POR DEFINIR] · backend @agente 07/11: CA-1 a CA-7, A-08 y A-13 en API y en PostgreSQL con el rol de la API; prueba real por HTTP sin diferencias
- [x] SP119 · Mobile: pantalla de Publicar viaje con mapa OSM y selección de cupos en Expo — 5h — @[POR DEFINIR] · mobile y backend (`GET /viajes/limites`) @agente 07/11: requisitos, formulario, resultado y errores con pruebas y firma real en navegador; verificación en sesión limpia (6 defectos corregidos) y en teléfono físico (4 corregidos) hechas; revisión del código hecha (10 corregidos, probados en el teléfono); TalkBack no lee los avisos que aparecen y queda abierto; falta PR

### HU-18 · Buscar viajes (14 h)
- [x] SP120 · Lógica de consulta geoespacial Haversine y filtro de ventana temporal — 3h — @[POR DEFINIR] · backend @agente 07/11: índice `idx_viajes_busqueda`; el `acos` del plan fallaba en PostgreSQL por redondeo y quedó acotado; verificado con 40 500 viajes (26 ms como máximo)
- [x] SP121 · Endpoint `/viajes/buscar` con DTOs seguros y resolución D-17 — 3h — @[POR DEFINIR] · backend @agente 07/11: documentado en Swagger; membresía sin firma, nombre de pila también en el detalle y sin cuentas suspendidas (decisiones del integrante)
- [x] SP122 · Suite de pruebas automatizadas, prueba de aislamiento A-13 y medición de latencia < 2s — 3h — @[POR DEFINIR] · backend @agente 07/11: CA-1 a CA-6 y A-13 en API y en PostgreSQL; prueba real por HTTP sin diferencias; falta verificación en sesión limpia
- [x] SP123 · Mobile: pantalla de Búsqueda de viajes y componente `TarjetaViaje` en Expo — 5h — @[POR DEFINIR] · mobile @agente 07/11: formulario en la pestaña Buscar, resultados y detalle; origen por GPS (`expo-location`, autorizado por el integrante), buscador o mapa; saldo a la vista. Probado en navegador contra el backend real y en teléfono físico: permiso, GPS real, ubicación apagada, tope de 15 s, arrastre con el dedo, zoom y atrás; falta verificación en sesión limpia. Verificado en sesión limpia el 07/11: ícono propio para «Nuevo» y auto con ícono en el detalle. Igual al prototipo (decisión del integrante): nombre de pila en el saludo, voz desactivada, una fila a 360 y «2 de 4» con `cuposTotales` en el detalle. Revisión de código (07/11, `a71e3db`): hora ya pasada, enlace incompleto, aviso en un viaje que ya no está, caché al salir, tope del GPS y redondeo de distancia, con pruebas.
- [x] SP130 · Mobile: mapa con MapLibre, con las funciones habituales de un mapa: pellizco, doble toque, rotar y brújula, punto de mi ubicación y tipos de mapa, con estilo propio; navegador revisado — 6h — @[POR DEFINIR] · mobile @agente 07/11: dependencia autorizada por el integrante; teselas vectoriales de OpenFreeMap (datos OSM) con estilo de `tokens.ts`, tipos calles y relieve; pin en SVG que se coloca al tocar; créditos plegables; la web conserva las teselas. Probado en el teléfono: arrastre, zoom, relieve, atrás, trayecto y Publicar. Rotar, pellizco, doble toque, «Mi ubicación» y TalkBack los probó el integrante en el teléfono.

### PB-01 · Vulnerabilidades de dependencias (`npm audit`)
- [x] SP131 · `npm audit fix` sin `--force` en `backend` y `mobile`, rama `fix/dependencias-audit` desde `develop` — 1h — @[POR DEFINIR] · @agente 07/11: autorizado por el integrante (AGENTS.md §14). Las vulnerabilidades ya estaban en `develop`; las HU no agregaron ninguna. Backend de 14 (7 altas) a 3 moderadas: body-parser, multer, deepmerge-ts, mysql2, fast-uri, qs; Prisma 7.10.0 → 7.10.1 y `allowScripts` aprueba esa versión. Mobile de 31 (6 altas) a 23 (3 altas): zod, node-forge, uuid y parches de Expo dentro del SDK 57; sin cambios en `package.json`. Regresión completa en verde en los dos (backend con e2e, mobile con build Android)
- [x] SP132 · Lo que `audit fix` no corrige y no pide `--force`: `vitest` y `@vitest/coverage-v8` 4.1.11 → 4.1.12 en `backend` (`@vitest/mocker`, moderada, solo desarrollo) — 0,5h — @[POR DEFINIR] · @agente 07/11: pedido por el integrante; `backend` queda con 0 vulnerabilidades y regresión completa en verde. En `mobile` no hay nada más sin versión mayor
- [x] SP133 · Actualizar el SDK de Expo 57 → 58 en `mobile` (React Native 0.88.1, React 19.3, Jest 30, gesture-handler 3, reanimated 4.7): quita las 3 altas de `expo-router` 57 (decode-uri-component, query-string) — 3h — @[POR DEFINIR] · @agente 07/11: confirmado por el integrante (AGENTS.md §14). De 23 (3 altas) a 22 moderadas y 1 baja en producción, dentro del propio `expo` (glob, minimatch), sin versión que las corrija. `testTimeout` a 15 s: en frío, la primera prueba de las pantallas con foto pasaba de 5 s. Regresión completa en verde (163 pruebas también con caché vacía) y APK de debug compilado con Gradle. En Windows, la compilación nativa necesita rutas largas (`LongPathsEnabled=1`) y CMake 3.31.6 del SDK: gesture-handler 3 trae C++ con rutas de más de 260 caracteres

## Sprint 3 · Viaje completo verificado y pagado

### HU-10 · Volver a vincular o cambiar de teléfono (16,5 h)
- [x] SP134 · Migración `013_dispositivos_historial` y ajuste de Prisma (1–N, `findFirst` activo) — 1,5h — @[POR DEFINIR] · backend `6c77d2d` (Smile-HD)
- [x] SP135 · `IdentidadService.comprobarRostroDelTitular` con bloqueo de HU-08 — 2h — @[POR DEFINIR] · backend `6c77d2d` (Smile-HD)
- [x] SP136 · `RevinculacionService` + endpoints + Swagger + correo + auditoría — 3h — @[POR DEFINIR] · backend `6c77d2d` (Smile-HD); @agente 10/11 `1c272cb`, `d979d72`: sesión de vida atada al desafío, 409 con mensaje y en Swagger, auditoría con modelo, fecha local en el correo, sin CORS abierto; verificación 10/11 `86d6e54`: auditoría también al pedir el desafío bloqueado y sufijo del motor simulado solo en sesiones `sim-`
- [x] SP137 · Pruebas e2e y de ataque A-01, A-02, A-03, A-04 — 3h — @[POR DEFINIR] · backend `6c77d2d` (Smile-HD); @agente 10/11 `3d4f6fe`: CA-8, CA-12, 409 en concurrencia y A-08 propia. 482 unitarias, 523 e2e, cobertura 92 %; `8887527`: e2e de CA-12 con el desafío pedido durante el bloqueo (484 unitarias, 524 e2e)
- [x] SP138 · Módulo nativo: códigos `LLAVE_ANULADA`, `SIN_LLAVE`, `SIN_BIOMETRIA`, `BIOMETRIA_BLOQUEADA`; `keystore.ts` — 2h — @[POR DEFINIR] · mobile `a59b287` (Smile-HD); @agente 10/11 `306de57`, `f269314`: la llave nueva firma solo tras el 201 (dos alias, `confirmarLlave`), sin llave ni firma simuladas en web, Kotlin que compila
- [x] SP139 · Mobile: aviso de llave anulada y flujo de revinculación en «Mi teléfono»; textos — 4h — @[POR DEFINIR] · mobile `6a6eda4` (Smile-HD); @agente 10/11 `08167fd`, `690e86b`, `472e22b`: CA-1 en Billetera, Publicar y Recarga, códigos del contrato final, fuera `localStorage`, `globalThis` y script `android`, hora de desbloqueo con el día. 390 pruebas; backend `9951b72`: API sin ETag (304 vacío tras renovar la sesión)
- [x] SP140 · Prueba en teléfono físico: registrar huella nueva y volver a vincular — 1h — @[POR DEFINIR] · @agente 10/11 en Infinix X669 con huella nueva real: aviso CA-1, revinculación con identidad, firma con la llave nueva; rechazo que conserva la llave; teléfono sin llave

### HU-29 · Confirmación biométrica (8 h)
- [x] SP141 · `@AccionSensible` y migración de los controladores existentes; Swagger — 1,5h — @[POR DEFINIR] · @agente 10/11 backend `0aa3d23`, `d9875bd`: crear billetera, confirmar recarga y publicar viaje; texto en Swagger; rechazo auditado con el nombre de la acción
- [x] SP142 · Pruebas de catálogo y de ataque A-08/A-11 — 2h — @[POR DEFINIR] · @agente 10/11 backend `64e9cdb`: catálogo leído de las rutas registradas y A-08/A-04 por acción; 488 unitarias, 543 e2e, cobertura 92 %
- [x] SP143 · Mobile: `ConfirmacionBiometrica`, `useAccionSensible`, textos por acción; adoptarlo en recargar, publicar y billetera — 4h — @[POR DEFINIR] · @agente 10/11 mobile `8fed720`: diálogo con acción y monto en recargar, publicar y crear billetera; CA-1, CA-2 y CA-9 en Jest y en teléfono físico; verificado el 10/11 (`555dc78`: CA-2 al crear la billetera; `10e50d8`: resumen con botón al crear la billetera)
- [x] SP144 · Prueba en teléfono físico: huella ajena, cancelar, bloqueo — 0,5h — @[POR DEFINIR] · @agente 10/11 Infinix X669: CA-5 con dedo no registrado (nada firmado llega al servidor), CA-2, CA-8 sin huellas, resumen de crear la billetera, Movimientos → Billetera, sin PIN ni patrón en el diálogo; bloqueo del sistema no provocable en este teléfono (solo Jest)

### HU-19 · Reserva con escrow (25,5 h)
- [x] SP145 · Migración `014_reservas` (RLS, índices, FK) y modelos Prisma — 2h — @[POR DEFINIR] · backend @agente 12/11: `reservas` con RLS forzado y UNIQUE parcial `(viaje, pasajero)` salvo `fallida`; FK de `movimientos_billetera.reserva_id`; el CHECK de `trabajos_onchain.operacion` admite `bloquear_reserva`; el rol de la API solo actualiza `estado` y `motivo` de la reserva y `cupos_disponibles` y `estado` del viaje. Sin diferencias entre esquema y migraciones
- [x] SP146 · `EstadoViajeService.recalcular` con pruebas — 1,5h — @[POR DEFINIR] · backend @agente 12/11: solo `publicado → reservado` (lo único que HU-19 puede producir); HU-22, HU-23 y HU-24 agregan su transición en el mismo lugar
- [x] SP147 · `ReservasService.reservar` + endpoints + Swagger — 4h — @[POR DEFINIR] · backend @agente 12/11: `POST /viajes/:id/reservas`, `GET /reservas/:id`, `GET /reservas/mias` y `GET /viajes/:id/pasajeros`; una transacción con candado por pasajero (advisory lock, no `FOR UPDATE`: el rol de la API no puede actualizar `billeteras`)
- [x] SP148 · `Cadena.bloquearReserva`/`estadoReservaEscrow` (real y simulada), permit con llave custodiada, worker por `operacion` — 4h — @[POR DEFINIR] · backend @agente 12/11: permit EIP-2612 firmado en el worker con la llave descifrada solo para firmar; las reversiones permanentes se leen de los datos con el ABI (ethers no las decodifica al estimar el gas)
- [x] SP149 · HU-17: precio múltiplo de 0,02; HU-18: sin viajes propios — 1h — @[POR DEFINIR] · backend @agente 12/11: `PRECIO_NO_MULTIPLO` al publicar y la búsqueda excluye `conductor_id = usuario`
- [x] SP150 · Pruebas e2e y de ataque A-08, A-09, A-10, A-13 — 4h — @[POR DEFINIR] · backend @agente 12/11: CA-1 a CA-15 y los cuatro ataques, también en PostgreSQL con el rol de la API; la prueba de catálogo y la A-08 por acción ya incluyen `reserva.crear`
- [x] SP151 · Mobile: confirmación de reserva, resultado y estado — 4h — @[POR DEFINIR] · mobile @agente 12/11: «Reservar y pagar» con huella en el detalle, faltante y «Recargar saldo», clave de idempotencia estable en los reintentos y pantalla de resultado que consulta mientras está pendiente; con Jest; sin probar en teléfono físico
- [x] SP152 · Mobile: pestaña «Mis viajes» y tarjeta del viaje activo — 4h — @[POR DEFINIR] · mobile @agente 12/11: reservas del pasajero y viajes del conductor con sus pasajeros (nombre de pila y estado), y «Tu próximo viaje» en Inicio; con Jest; sin probar en teléfono físico
- [x] SP153 · Prueba real de bloqueo contra `EscrowUniRide` en Hardhat local — 1h — @[POR DEFINIR] · backend @agente 12/11: `test/blockchain/escrow-hardhat.e2e-spec.ts` (se omite sin `HARDHAT_RPC_URL`): bloqueo con permit de un pasajero sin ETH, nonce que avanza, hash recuperado del evento y reversiones `ReservaExistente`, `ERC20InsufficientBalance` y `DatosInvalidos` como fallas permanentes

### HU-22 · Verificación de abordaje (25 h)
- [x] SP154 · Migración `015_presencia` (3 tablas, RLS) y modelos — 2h — @[POR DEFINIR]
- [x] SP155 · Extraer `verificarFirmaPeticion` y crear `FirmaTrayectoGuard` — 2h — @[POR DEFINIR]
- [x] SP156 · Llave de trayecto del conductor y desafíos con QR — 3h — @[POR DEFINIR]
- [x] SP157 · Abordaje: consumo, validaciones, integridad, prueba con hash, estados — 4h — @[POR DEFINIR]
- [x] SP158 · Pruebas e2e y de ataque A-03, A-05, A-06, A-07, A-08, A-13 — 4h — @[POR DEFINIR]
- [x] SP159 · Módulo nativo: llave de trayecto sin biometría; `cabecerasFirmaTrayecto` — 2h — @[POR DEFINIR]
- [x] SP160 · Mobile: «Mostrar código» del conductor — 3h — @[POR DEFINIR]
- [x] SP161 · Mobile: «Escanear QR» con `expo-camera` (dependencia autorizada el 08/11) y resultados — 4h — @[POR DEFINIR]
- [x] SP162 · Prueba con dos teléfonos físicos y medición < 3 s — 1h — @[POR DEFINIR]

### HU-23 · Seguimiento y bajada (24 h)
- [ ] SP163 · Migración `016_puntos_gps` y `reservas.evaluacion` — 1h — @[POR DEFINIR]
- [ ] SP164 · `evaluarTrayecto` con pruebas de borde — 3h — @[POR DEFINIR]
- [ ] SP165 · Endpoints de posiciones (lotes, filtros, idempotencia) — 3h — @[POR DEFINIR]
- [ ] SP166 · Bajada: encuentro, evaluación, estados y alerta — 3h — @[POR DEFINIR]
- [ ] SP167 · Pruebas e2e y de ataque A-05, A-06, A-07, A-08, A-13 — 4h — @[POR DEFINIR]
- [ ] SP168 · Mobile: seguimiento en segundo plano con `expo-task-manager` (dependencia autorizada el 08/11) y permisos — 5h — @[POR DEFINIR]
- [ ] SP169 · Mobile: viaje en curso y bajada — 3h — @[POR DEFINIR]
- [ ] SP170 · Viaje real con dos teléfonos (pantalla apagada, sin señal) — 2h — @[POR DEFINIR]

### HU-24 · Liberación del pago (16 h)
- [ ] SP171 · `Cadena.liberarReserva` con cuenta verificadora (real y simulada), `VERIFICADOR_LLAVE_PRIVADA` y bloqueo en producción — 3h — @[POR DEFINIR]
- [ ] SP172 · `hashPruebaPresencia` y encolado en la bajada verificada — 2h — @[POR DEFINIR]
- [ ] SP173 · Worker `liberar_reserva`: idempotencia, estados y auditoría — 3h — @[POR DEFINIR]
- [ ] SP174 · Pruebas e2e y de ataque A-09, A-10, A-12; viaje completo — 4h — @[POR DEFINIR]
- [ ] SP175 · Mobile: estado del pago para conductor y pasajero — 2h — @[POR DEFINIR]
- [ ] SP176 · Viaje completo real contra Hardhat local y documentación de roles del despliegue — 2h — @[POR DEFINIR]
