# AGENTS.md — UniRide

Guía para agentes de IA que analizan, modifican, prueban o mantienen este proyecto. Ubicación: raíz del repositorio principal [Vansiii/uniride](https://github.com/Vansiii/uniride). Cada submódulo (`mobile/`, `web/`, `backend/`, `contracts/`) tiene un `AGENTS.md` breve que remite a este; este archivo rige en todos.

Fuente de verdad funcional: el documento técnico del Grupo 4 (Ingeniería de Software I, INF422-SB, UAGRM), que contiene el PAPS, el Product Backlog, el modelo de seguridad y la Definition of Done. Este archivo resume las reglas operativas de ese documento; si hay conflicto, gana el documento técnico y este archivo debe corregirse.

---

## 1. Qué es UniRide

Plataforma de carpooling para organizaciones (universidades y empresas). Los miembros verificados publican, buscan y reservan viajes compartidos. Cada viaje se verifica criptográficamente al subir y al bajar, y el pago se hace con una billetera blockchain propia: el pasaje queda en garantía (escrow) al reservar y solo se libera al conductor cuando el sistema comprueba que el viaje ocurrió.

Requisitos núcleo fijados por el docente (no se negocian ni se recortan):

1. Múltiples organizaciones (no solo UAGRM).
2. Verificación que no se pueda saltar.
3. Billetera blockchain propia que acredita y descuenta saldo.
4. Interfaz muy navegable e intuitiva, con comandos de voz.

Marco de trabajo: Scrum, sprints de 1 semana (miércoles a martes). Plazo: 5 sprints, del 14/10 al 17/11/2026; equipo de 5 personas. Criterio general del equipo: **elegir siempre la solución más simple que cumpla los cuatro requisitos núcleo y los criterios de calidad**. No añadir capas, librerías ni abstracciones que una historia no necesite.

## 2. Estado actual del repositorio

El proyecto está en el Sprint 0 (14/10 – 20/10/2026). El harness de trabajo (Scrum + SDD) vive en `SPECS/` y `.agents/`; al iniciar una sesión, lee primero `.agents/MEMORY/HEARTBEAT.md`. La estructura y las herramientas de esta guía provienen del documento técnico; los archivos de configuración todavía pueden no existir. Por eso:

- Antes de ejecutar cualquier comando, lee los `package.json`, `hardhat.config.*` y los workflows de `.github/workflows/` que existan. **No inventes scripts.** Si un script no existe, dilo y no lo sustituyas por uno supuesto.
- Hay decisiones aún abiertas (sección 13). No las tomes por tu cuenta: si una tarea depende de ellas, detente y pregunta.

## 3. Estructura de repositorios

Un repositorio principal con un **submódulo de git** por aplicación (decisión del 14/10/2026, ver MEMORY). Clonar con `git clone --recurse-submodules https://github.com/Vansiii/uniride.git`.

| Repositorio | Contenido |
|---|---|
| `Vansiii/uniride` (principal) | `AGENTS.md`, `SPECS/`, `.agents/`, `docker-compose.yml`, `.env.example`, documento técnico |
| `Vansiii/uniride-backend`, `-web`, `-mobile`, `-contracts` | Código de cada aplicación, con su propio CI y protección de ramas |

Carpetas (submódulos) dentro del principal:

| Carpeta | Contenido | Quién lo usa |
|---|---|---|
| `mobile/` | App de conductor y pasajero. React Native (Expo con módulos nativos), TypeScript. Cámara, GPS, biometría, Android Keystore, voz. | Conductor, pasajero |
| `web/` | Paneles de administración de organización y de UniRide. React + Vite, TypeScript. | Admin. de organización, super admin. |
| `backend/` | API REST en NestJS + TypeScript, documentada con Swagger. Motor de verificación y relayer blockchain. | Ambos clientes |
| `contracts/` | Token URC y contrato escrow. Solidity, Hardhat, OpenZeppelin; acceso desde el backend con ethers.js. | Solo el backend |

Regla de dependencias entre carpetas: `mobile/` y `web/` solo hablan con la API de `backend/`. Ningún cliente accede directamente a la base de datos, a AWS KMS ni a la blockchain.

## 4. Stack e integraciones externas

| Capa | Tecnología |
|---|---|
| Móvil | React Native (Expo + módulos nativos), TypeScript |
| Web | React + Vite, TypeScript |
| Backend | NestJS, TypeScript, Swagger, Prisma |
| Base de datos | PostgreSQL en Amazon RDS, con Row-Level Security |
| Blockchain | Solidity, Hardhat, OpenZeppelin, ethers.js; red de prueba Polygon Amoy |
| Nube | AWS: EC2 (backend con Docker), RDS, S3, KMS, Rekognition, SES |
| Seguridad | JWT + refresh token, Google Play Integrity API, Android Keystore |
| Contenedores | Docker; configuración por variables de entorno |
| CI | GitHub Actions: lint, pruebas y build en cada pull request |

Servicios externos y su único uso permitido:

| Servicio | Uso |
|---|---|
| Play Integrity API | Atestar que la app es original y corre en un teléfono real |
| Rekognition Face Liveness | Prueba de vida y comparación del rostro con el carnet |
| AWS KMS | Llaves de las billeteras y de la cuenta verificadora |
| Amazon SES | Códigos OTP e invitaciones |
| Amazon S3 | Fotos de carnets y vehículos, cifradas |
| Polygon Amoy | Token URC y contrato escrow (JSON-RPC vía ethers.js) |
| OpenStreetMap | Mapas de origen, destino y trayecto |
| Reconocimiento de voz del dispositivo | Comandos de voz en español (API nativa de Android) |

No sustituyas ninguna tecnología del stack (el docente la exigió) ni añadas un servicio externo nuevo sin aprobación del equipo.

## 5. Principios de arquitectura (no negociables)

1. **El teléfono nunca decide.** La app solo aporta pruebas firmadas (firma del dispositivo, desafíos, posiciones GPS). El servidor y el contrato inteligente validan y deciden. Nunca muevas una validación de seguridad al cliente ni confíes en un dato del cliente sin verificarlo en el servidor.
2. **La API es la única puerta** a la base de datos, a KMS y a la blockchain.
3. **Aislamiento multi-organización.** Todo registro de datos de una organización (membresías, viajes, reservas, presencia, invitaciones, auditoría) lleva su identificador, toda consulta de esos datos filtra por organización y PostgreSQL aplica Row-Level Security (amenaza A-13). Los datos personales (cuenta, identidad, dispositivo, billetera, vehículo) son de la persona y valen en todas sus organizaciones: se protegen por dueño y a terceros solo se expone lo mínimo. Una consulta o endpoint nuevo sin el filtro que le corresponde es un defecto.
4. **El dinero solo se mueve con verificación válida.** El escrow solo lo libera la cuenta verificadora, solo para viajes verificados y una sola vez por viaje.
5. **Los viajes no crean saldo.** El saldo entra por recarga o subsidio y sale por retiro; simular viajes no debe producir ganancia.
6. **Operaciones de dinero idempotentes.** Pagos, recargas y liberaciones no se ejecutan dos veces aunque la petición se repita.
7. **Consistencia BD ↔ blockchain.** El saldo en PostgreSQL debe coincidir con el de la blockchain; existe un proceso de conciliación que detecta diferencias.
8. **Blockchain asíncrona.** Las transacciones on-chain no bloquean al usuario: la app muestra "pendiente" y las fallidas se reintentan desde una cola sin perder la operación.
9. **El servidor controla los estados del viaje**: `Publicado → Reservado → En curso (abordaje verificado) → Verificado (bajada y traza válidas) → Pagado`. Desde `Publicado` o `Reservado` puede pasar a `Cancelado`; sin abordaje a tiempo pasa a `Expirado` con reembolso. No añadas transiciones ni permitas saltar estados.
10. **Backend modular.** Un módulo de NestJS por responsabilidad. Reutiliza los módulos, servicios, guards y utilidades existentes antes de crear otros.

## 6. Modelo de seguridad: cinco capas y amenazas

| Capa | Mecanismo |
|---|---|
| Identidad | Foto del carnet + prueba de vida + comparación facial. Un carnet y un rostro por cuenta. |
| Dispositivo | Llave de hardware no exportable protegida con biometría; atestación de Play Integrity en cada petición sensible. |
| Encuentro | Desafío de un solo uso con 30 s de vida, doble firma conductor–pasajero, ambos GPS a ≤ 50 m, al subir y al bajar. |
| Trayecto | Posiciones firmadas cada 15 s, cruzadas en el servidor, con detección de saltos imposibles. |
| Dinero | Escrow liberado solo por el verificador. |

| Id | Ataque | Contramedida | Historia |
|---|---|---|---|
| A-01 | Registrarse con foto o video de otro | Prueba de vida + comparación con carnet | HU-08 |
| A-02 | Varias cuentas por persona | Carnet único, rostro duplicado, un dispositivo por cuenta | HU-08, HU-09 |
| A-03 | Emulador, root o app modificada | Play Integrity validada en el servidor | HU-09 |
| A-04 | Teléfono robado o prestado | La llave exige la biometría del dueño | HU-09, HU-29 |
| A-05 | Repetir un handshake capturado | Desafío de un solo uso, vence en 30 s | HU-22 |
| A-06 | Enviar foto del QR a alguien lejos | Doble firma + ambos GPS a ≤ 50 m en el mismo desafío | HU-22 |
| A-07 | Falsificar GPS | Atestación, detección de ubicación simulada, cruce de trazas, límite de velocidad | HU-22, HU-23 |
| A-08 | Llamar a la API sin la app | Firma del dispositivo en toda petición sensible; estados controlados por el servidor | HU-09 |
| A-09 | Liberar pago sin viaje o cobrar dos veces | Solo el verificador libera, solo viajes verificados, una vez | HU-24 |
| A-10 | Colusión para simular viajes | Los viajes no crean saldo; detección de patrones | HU-25 |
| A-11 | Mover dinero con un comando de voz | La voz nunca autoriza; acción sensible pide biometría | HU-29 |
| A-12 | Robar llaves del servidor | Llaves en AWS KMS, nunca en código ni en BD | HU-12 |
| A-13 | Ver o modificar datos de otra organización | Id de organización en cada registro + RLS | HU-01, HU-02 |

Reglas para agentes:

- Si tu cambio toca verificación, billetera, escrow, estados del viaje o aislamiento entre organizaciones, identifica qué amenazas afecta y **mantén o añade su prueba de ataque automatizada**. La prueba debe demostrar que el ataque falla.
- No debilites ninguna capa, ni siquiera "temporalmente" o para facilitar pruebas. El único bypass admitido es un modo de desarrollo para emulador que **nunca llega a producción**; debe estar desactivado por defecto, controlado por configuración y bloqueado en el entorno de producción.
- La atestación solo se valida de verdad en teléfonos Android físicos; no declares verificada una función de atestación probada solo en emulador.

## 7. Convenciones de código

- TypeScript en `mobile/`, `web/` y `backend/`; Solidity en `contracts/`.
- Todo en español, incluidos los identificadores de código, sin tildes ni ñ. Se exceptúan los nombres impuestos por frameworks, estándares o herramientas (sufijos de NestJS, funciones ERC-20, variables de entorno estándar). Detalle en `SPECS/ssd.md` §14.
- Linter y formato obligatorios: oxlint en `backend/` y `web/`, ESLint en `mobile/` (Expo) y Prettier en todas las carpetas. Respeta la configuración existente; no desactives reglas ni añadas comentarios de desactivación sin justificarlo en el PR.
- Backend: estructura estándar de NestJS (módulos, controladores, servicios, DTOs con validación, guards). Todo endpoint nuevo o modificado se documenta en Swagger.
- Contratos: parte de OpenZeppelin en lugar de reimplementar estándares; mantén los contratos pequeños y con pruebas en Hardhat.
- Contraseñas con hash (bcrypt o argon2), nunca en texto plano. Token de acceso de 15 minutos, refresh token revocable al cerrar sesión.
- Sigue el estilo y los nombres del código vecino. No reformatees ni renombres código ajeno a la tarea.
- Si al leer el código encuentras convenciones más específicas (nombres de carpetas, idioma de identificadores, formato de commits), síguelas y propón añadirlas a este archivo.

## 8. Git y flujo de ramas

- Ramas permanentes: `main` y `develop` en **cada** repositorio (principal y submódulos), todas protegidas. **Nunca hagas push directo ni force-push a ellas.**
- Una rama `feat/HU-xx-slug` por historia, creada desde `develop`, en cada repositorio que la historia toque.
- Cuando se fusiona un PR en un submódulo, se actualiza su puntero en el principal con otro PR (`git add <carpeta>` tras `git -C <carpeta> pull`).
- Commits `HU-xx SPyy: descripción`, sin coautoría ni firmas de herramientas de IA.
- Todo cambio entra por pull request revisado por otro integrante y con el pipeline de CI en verde.
- Al cierre de cada sprint se crea un tag.
- No reescribas historial compartido ni borres ramas ajenas.

## 9. Comandos

Requisitos: **Node.js 24 LTS** (`.nvmrc`; trae npm 11 — con npm 10 falla la instalación del backend) y Docker. Instalación en cada carpeta: `npm ci`.

| Carpeta | Desarrollo | Lint | Formato | Pruebas | Build |
|---|---|---|---|---|---|
| `backend/` | `npm run start:dev` | `npm run lint` (oxlint) | `npm run format:verificar` | `npm test` (unitarias) · `npm run test:e2e` | `npm run build` |
| `web/` | `npm run dev` | `npm run lint` (oxlint) | `npm run format:verificar` | `npm test` | `npm run build` |
| `mobile/` | `npm start` / `npm run android` | `npm run lint` (ESLint) | `npm run format:verificar` | `npm test` | `npm run build` (tipos + bundle Android) |
| `contracts/` | `npm run nodo` | `npm run lint` (Prettier) | — | `npm test` | `npm run build` |

Otros: `npm run prisma:generar` y `npm run prisma:migrar` (backend); `npm run desplegar:local` y `npm run desplegar:amoy` (contracts, ver `contracts/README.md`). Entorno completo: `docker compose up --build` desde la raíz.

Procedimiento obligatorio:

1. Usa solo los scripts de la tabla (o los del `package.json` de la carpeta). **No inventes scripts.**
2. El CI de cada submódulo (`.github/workflows/ci.yml` en su repositorio) ejecuta en cada PR lint, formato, pruebas y build. Antes de dar una tarea por terminada, ejecútalos localmente en cada carpeta que tocaste.
3. Instala dependencias de a una carpeta por vez (npm en paralelo corrompe la caché). Los scripts de instalación de paquetes nuevos requieren aprobación explícita (`allowScripts` de npm 11).
4. El sistema debe poder levantarse en local con Docker (plan de respaldo ante costos de AWS); no rompas esa posibilidad.

## 10. Pruebas y validación

- Cada criterio de aceptación de una historia tiene al menos una prueba automatizada.
- Lógica de backend: cobertura mínima del **70 %**. No bajes la cobertura existente.
- Pruebas unitarias y de integración en backend; pruebas de Hardhat en contratos.
- Pruebas de ataque para toda historia que toque verificación o billetera (sección 6). La suite completa se consolida en PB-05.
- Metas de rendimiento: verificación de abordaje < 3 s, búsqueda de viajes < 2 s.
- Usabilidad: flujo principal (buscar, reservar, abordar, pagar) en 4 pasos o menos; resultado SUS ≥ 75.
- No borres, saltes (`skip`/`only`) ni debilites pruebas para que el pipeline pase. Si una prueba falla, corrige la causa o informa por qué.

## 11. Configuración, secretos y datos sensibles

- Toda configuración entra por variables de entorno; el mismo código debe correr en desarrollo, pruebas y producción.
- **Nunca** escribas secretos, tokens, llaves privadas, credenciales de AWS ni frases semilla en el código, en commits, en logs, en pruebas ni en la base de datos. Las llaves de billeteras y del verificador viven solo en AWS KMS.
- Si añades una variable de entorno, documéntala en el archivo de ejemplo de variables del proyecto (sin valores reales).
- Fotos de carnets, datos biométricos y fotos de vehículos son datos sensibles: se recogen con consentimiento explícito, se guardan cifrados en S3 y se usan solo para verificación. No los expongas en respuestas de la API, logs ni mensajes de error.
- Toda comunicación usa HTTPS.
- La billetera opera **solo en red de prueba**; el token URC no tiene valor real. Nunca configures, despliegues ni apuntes a una mainnet.
- Respeta las licencias de dependencias y recursos (Ley N.º 1322). No añadas librerías con licencias incompatibles.

## 12. Errores, logs y trazabilidad

- Ante la falla de un servicio externo (blockchain, prueba de vida, correo), muestra un mensaje claro al usuario y deja la operación en un estado consistente; nunca a medias.
- Cada verificación, pago y cambio de estado de viaje queda registrado con fecha, usuario y resultado.
- Las decisiones de administradores (aprobar o rechazar miembros, etc.) se registran con autor y fecha.
- Los logs no contienen secretos ni datos sensibles (sección 11).
- Las operaciones on-chain fallidas van a la cola de reintentos; no se descartan en silencio.

## 13. Decisiones abiertas (no decidir sin el equipo)

Decididas el 14/10/2026 (ver `.agents/MEMORY/MEMORY.md`):

| Tema | Decisión |
|---|---|
| ORM del backend | Prisma |
| Despliegue del backend | EC2 (App Runner no acepta clientes nuevos desde el 30/04/2026) |
| Gestión del backlog | Trello |
| Roles Scrum | Todos desarrollan; un PO y un Scrum Master nominales (nombres por definir) |

Las decisiones que siguen abiertas están en `.agents/MEMORY/MEMORY.md` (registro `D-xx`) y en `.agents/MEMORY/HEARTBEAT.md`. Si una tarea exige una de ellas, detente, explica las implicaciones y pide confirmación. Cuando se decidan, regístralas en MEMORY y actualiza las secciones afectadas.

## 14. Cambios que requieren confirmación humana explícita

- Migraciones que borran o transforman datos existentes, o cambios en las políticas de Row-Level Security.
- Cambios en los contratos inteligentes ya desplegados o en la interfaz que el backend consume de ellos.
- Cambios en la lógica de escrow, recarga, retiro, subsidio, reembolso o conciliación de saldos.
- Cambios en la máquina de estados del viaje o en cualquier capa de verificación.
- Cambios incompatibles en contratos de la API usados por `mobile/` o `web/`.
- Añadir, quitar o actualizar de versión mayor una dependencia.
- Modificar workflows de CI, protección de ramas, infraestructura de AWS o variables de producción.
- Cualquier operación destructiva (borrar archivos, ramas, datos, recursos en la nube).

## 15. Flujo de trabajo por tarea

El equipo aplica a cada historia cuatro fases: análisis, diseño, implementación y prueba.

**Antes de modificar**
1. Identifica la historia (`HU-xx` / `PB-xx`), sus criterios de aceptación y sus reglas.
2. Localiza los módulos afectados y lee el código existente relacionado.
3. Determina qué amenazas (A-01 a A-13) toca el cambio.
4. Comprueba si depende de una decisión abierta (sección 13).

**Durante**
1. Trabaja en la rama de la historia; cambios mínimos y enfocados en la tarea.
2. Reutiliza componentes, servicios y utilidades existentes.
3. Mantén el filtro por organización, la validación en servidor y la idempotencia donde aplique.
4. Actualiza Swagger si cambia la API.

**Después**
1. Ejecuta lint, pruebas y build en las carpetas tocadas.
2. Verifica cada criterio de aceptación con una prueba y, si aplica, la prueba de ataque.
3. Indica qué diagramas UML 2.5 (casos de uso, clases, paquetes, despliegue, secuencia) deberían actualizarse.
4. Resume lo hecho, lo verificado y lo que quedó sin verificar.

## 16. Definition of Done

Una historia está terminada cuando:

- [ ] cumple todos sus criterios de aceptación;
- [ ] pasó revisión de código de otro integrante;
- [ ] tiene pruebas automatizadas, incluida la prueba de ataque si toca verificación o billetera;
- [ ] pasa el pipeline de CI (lint, pruebas, build);
- [ ] está desplegada en AWS y documentada en Swagger;
- [ ] el Product Owner la aceptó.

Un agente puede dejar listos los tres primeros puntos técnicos y el CI; el despliegue y la aceptación los confirman las personas del equipo. No declares una historia "terminada" si falta alguno.

## 17. Mantenimiento de este archivo

- Actualízalo cuando cambie una decisión, se creen los scripts o aparezca una convención nueva en el código.
- No dupliques aquí contenido largo del documento técnico; resume la regla y referencia la historia o amenaza.
- Si detectas que este archivo contradice el código o el documento técnico, señálalo en lugar de seguir la regla obsoleta.
