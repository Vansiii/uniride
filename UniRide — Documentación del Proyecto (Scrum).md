# UniRide — Documentación del Proyecto (Scrum)

Oct 3, 2026 · @Vansi

## Cómo usar este documento

Este documento reúne los artefactos Scrum iniciales de UniRide para Ingeniería de Software I (INF-422). Incluye los cinco artefactos pedidos y cuatro añadidos que sostienen los requisitos del docente, sobre todo la verificación.

| Artefacto | Sección | Para qué sirve | Origen |
| --- | --- | --- | --- |
| Perfil del Proyecto | 1 | Qué se construye, para quién y por qué es innovador | Pedido |
| Gobierno del Producto | 2 | Roles, eventos, reglas de trabajo, DoR y DoD | Pedido |
| Arquitectura y modelo de amenazas | 3 | Demuestra por qué la verificación no se puede saltar | Añadido |
| Roadmap Oficial | 4 | Qué se entrega en cada sprint hasta la defensa | Pedido |
| Product Backlog maestro | 5 | Lista priorizada y estimada de todo el trabajo | Pedido |
| Historias de usuario | 6 | Detalle y criterios de aceptación de las historias clave | Pedido |
| Matriz de calidad ISO/IEC 25010 | 2 | Conecta el proyecto con los estándares de calidad de la materia | Añadido |
| Riesgos | 7 | Qué puede fallar y cómo se responde | Añadido |
| Glosario | 7 | Términos técnicos para todo el equipo | Añadido |

Quedan para después, sprint a sprint: Sprint Backlogs, diagramas UML (casos de uso, clases, secuencia), prototipo en Figma y plan de pruebas.

## 1. Perfil del Proyecto

**UniRide** es una plataforma de carpooling para organizaciones (universidades y empresas) donde cada viaje se verifica criptográficamente y se paga con una billetera blockchain propia.

### 1.1 Problema

Estudiantes y empleados de una misma organización recorren a diario rutas parecidas, muchas veces solos en su vehículo o en transporte público saturado. El carpooling informal (grupos de WhatsApp, acuerdos de palabra) existe, pero tiene tres fallas: no hay certeza de quién es la otra persona, el pago depende de la confianza y nadie puede comprobar que el viaje ocurrió.

### 1.2 Objetivo general

Desarrollar una plataforma multi-organización de viajes compartidos, con verificación de identidad y de presencia imposible de eludir desde el cliente, pagos en una billetera blockchain y una interfaz operable por voz.

### 1.3 Objetivos específicos

1. Permitir que varias organizaciones operen en la plataforma con sus propios miembros, reglas y administradores.
2. Verificar la identidad de cada usuario y vincularla a un único dispositivo físico.
3. Verificar que conductor y pasajero estuvieron juntos al inicio y al fin de cada viaje antes de mover dinero.
4. Gestionar saldos en una billetera blockchain, con recargas, pagos en garantía (escrow) y descuentos automáticos.
5. Ofrecer una interfaz donde el flujo principal tome como máximo cuatro pasos y las acciones frecuentes funcionen por voz.

### 1.4 Alcance

| Incluye | No incluye |
| --- | --- |
| App móvil para conductores y pasajeros (React Native, Android como plataforma de demostración) | Publicación en Play Store o App Store |
| Panel web para administradores de organización y de UniRide (React + Vite) | Pasarela de pago real con bancos |
| Registro, verificación de identidad y vinculación de dispositivo | Uso de dinero real o criptomonedas en red principal |
| Publicar, buscar y reservar viajes | Cálculo de rutas óptimas con varios pasajeros |
| Verificación de presencia al abordar y al bajar | Seguros o validación de licencias de conducir con entidades estatales |
| Billetera en red de prueba blockchain con token propio | Chat en tiempo real entre usuarios |
| Comandos de voz en español para acciones frecuentes | Soporte multi-idioma |
| Calificaciones, reportes básicos y alertas de fraude |  |

### 1.5 Clientes y usuarios

| Actor | Quién es | Qué hace en UniRide |
| --- | --- | --- |
| Organización cliente | Universidad (UAGRM u otra) o empresa | Contrata la plataforma para sus miembros; puede subsidiar saldo |
| Administrador de organización | Encargado designado por la organización | Aprueba miembros, define reglas y tarifas, revisa reportes |
| Conductor | Miembro con vehículo registrado | Publica viajes, verifica abordaje y recibe pagos |
| Pasajero | Miembro verificado | Busca y reserva viajes, paga con su billetera |
| Super administrador | Equipo UniRide | Da de alta organizaciones, supervisa fraude y salud del sistema |

Una persona puede ser conductor y pasajero, y pertenecer a más de una organización. Cada organización decide si sus miembros comparten viajes con otras.

### 1.6 Requisitos del docente y cómo se cumplen

| Requisito | Cómo lo cumple UniRide | Evidencia en la defensa |
| --- | --- | --- |
| Diferentes clientes | Arquitectura multi-tenant: cada organización con miembros, reglas, tarifas y panel propios | Demostrar dos organizaciones (una universidad y una empresa) operando a la vez |
| Verificación invulnerable | Cinco capas: identidad con prueba de vida, dispositivo vinculado por hardware, handshake criptográfico de abordaje, trazas GPS cruzadas y pago en escrow. El servidor decide; la app nunca | Modelo de amenazas (sección 3) con una prueba ejecutable por cada ataque |
| Billetera blockchain | Token propio en red de prueba y contrato escrow: el pasaje se bloquea al reservar y se libera solo con verificación válida | Mostrar las transacciones en el explorador de bloques |
| Interfaz navegable con voz | Flujo principal en máximo cuatro pasos, comandos de voz en español, pruebas de usabilidad con usuarios reales | Completar una reserva solo con voz, salvo la confirmación biométrica |

### 1.7 Innovación

Lo innovador no es el carpooling, sino que **cada pago depende de una prueba criptográfica de que el viaje ocurrió**. La verificación, la billetera y la interfaz forman un solo mecanismo: la voz agiliza, la biometría autoriza, el handshake prueba y el contrato paga.

### 1.8 Stack tecnológico

| Capa | Tecnología | Uso |
| --- | --- | --- |
| Móvil | React Native (Expo con módulos nativos) | App de conductor y pasajero; acceso a cámara, GPS, Keystore y biometría |
| Web | React + Vite | Paneles de administración de organización y de UniRide |
| Backend | NestJS + PostgreSQL | API, reglas de negocio, motor de verificación, relayer blockchain |
| Blockchain | Solidity, Hardhat, OpenZeppelin, ethers.js; red de prueba Polygon Amoy | Token UniCoin (URC) y contrato escrow |
| Cloud | AWS: RDS (PostgreSQL), EC2 o App Runner, S3, KMS, Rekognition Face Liveness, SES | Despliegue, almacenamiento, llaves, prueba de vida, correos |
| Voz | Reconocimiento de voz del dispositivo (Android SpeechRecognizer) | Comandos en español |

### 1.9 Supuestos y restricciones

- La demostración se hace en teléfonos Android físicos. Los emuladores no pasan la atestación de dispositivo, y eso es parte del diseño de seguridad.
- El saldo es simulado: 1 URC equivale a 1 Bs y las recargas se aprueban de forma simulada.
- El proyecto se desarrolla en el semestre 2-2026 con sprints de dos semanas.

## 2. Gobierno del Producto

El equipo trabaja con Scrum en sprints de dos semanas. El Product Owner decide prioridades y el docente actúa como cliente principal que valida cada incremento.

### 2.1 Roles

| Rol | Responsable | Responsabilidades |
| --- | --- | --- |
| Stakeholder / cliente | Docente de Software I | Define requisitos, valida incrementos en cada Sprint Review |
| Product Owner | \[Nombre\] | Mantiene y prioriza el Product Backlog, acepta o rechaza historias |
| Scrum Master | \[Nombre\] | Facilita eventos, elimina impedimentos, cuida el cumplimiento de Scrum |
| Equipo de desarrollo | \[Nombres\] | Construye el incremento; se autoorganiza por áreas |

Áreas sugeridas dentro del equipo (una persona puede cubrir dos): backend y verificación, blockchain, móvil, web y UX, QA y DevOps en AWS.

### 2.2 Eventos

| Evento | Cuándo | Duración máxima | Resultado |
| --- | --- | --- | --- |
| Sprint Planning | Primer día del sprint | 2 h | Objetivo del sprint y Sprint Backlog |
| Daily Scrum | Lunes a viernes (puede ser por Discord o WhatsApp) | 15 min | Avance, plan del día, impedimentos |
| Sprint Review | Último día del sprint, con el docente | 1 h | Incremento demostrado y feedback |
| Sprint Retrospective | Tras la Review | 45 min | Una o dos mejoras concretas para el siguiente sprint |
| Refinamiento del backlog | Una vez por semana | 1 h | Historias listas (DoR) para los próximos dos sprints |

### 2.3 Artefactos y compromisos

| Artefacto | Compromiso | Dónde vive |
| --- | --- | --- |
| Product Backlog | Objetivo del producto (sección 1.2) | Sección 5 y herramienta de gestión |
| Sprint Backlog | Objetivo del sprint | Herramienta de gestión |
| Incremento | Definition of Done | Rama `main` desplegada en AWS |

### 2.4 Definition of Ready (DoR)

Una historia entra a un sprint solo si cumple todo esto:

- [ ] Está redactada como "Como… quiero… para…" y tiene criterios de aceptación verificables.
- [ ] Está estimada en puntos y mide 8 puntos o menos; si no, se divide.
- [ ] Sus dependencias están resueltas o planificadas en el mismo sprint.
- [ ] Si toca verificación o billetera, indica qué amenazas de la sección 3 cubre.
- [ ] El equipo la entiende y el PO la aprobó.

### 2.5 Definition of Done (DoD)

Una historia está terminada solo si cumple todo esto:

- [ ] Cumple todos sus criterios de aceptación.
- [ ] El código pasó revisión de al menos un compañero mediante pull request.
- [ ] Tiene pruebas automatizadas; la lógica de backend tiene al menos 70 % de cobertura.
- [ ] Si toca verificación o billetera, tiene una prueba que intenta el ataque correspondiente y demuestra que falla.
- [ ] Pasa el pipeline de integración continua (lint, pruebas, build).
- [ ] Está desplegada en el entorno de AWS y documentada en la API (Swagger).
- [ ] El PO la aceptó en la Sprint Review.

### 2.6 Priorización y estimación

- **Priorización:** MoSCoW. *Must* son los requisitos del docente y el flujo mínimo de viaje; *Should* mejora la experiencia; *Could* se hace si sobra capacidad; *Won't* queda fuera de este semestre.
- **Estimación:** Planning Poker con Fibonacci (1, 2, 3, 5, 8, 13). Una historia de 13 se divide antes de entrar a un sprint.
- **Velocidad:** se mide desde el Sprint 1 y ajusta la carga de los sprints siguientes.

### 2.7 Gestión de cambios

1. Cualquier cambio (del docente o del equipo) entra como ítem nuevo al Product Backlog, nunca directo al sprint en curso.
2. El PO lo prioriza en el siguiente refinamiento.
3. Si el cambio invalida el objetivo del sprint, el PO puede cancelar el sprint y replanificar.
4. Los cambios de alcance se registran en una tabla de control de cambios (fecha, cambio, origen, impacto).

### 2.8 Herramientas y flujo de trabajo

| Necesidad | Herramienta |
| --- | --- |
| Gestión del backlog y tablero | Jira o Trello |
| Código y revisión | GitHub (monorepo con carpetas `mobile`, `web`, `backend`, `contracts`) |
| Integración continua | GitHub Actions |
| Diseño de interfaz | Figma |
| Comunicación | Discord o WhatsApp |
| Documentación de API | Swagger (OpenAPI) generado por NestJS |

Flujo de ramas: `main` (lo desplegado), `develop` (integración del sprint) y ramas `feature/HU-xx` por historia. Nadie hace push directo a `main` ni a `develop`.

### 2.9 Matriz de calidad ISO/IEC 25010

| Característica | Cómo se aplica en UniRide | Métrica objetivo |
| --- | --- | --- |
| Seguridad | Verificación en cinco capas, cifrado en tránsito y reposo, llaves en KMS | 100 % de los ataques del modelo de amenazas bloqueados en pruebas |
| Usabilidad | Flujo principal corto, comandos de voz, diseño accesible | Reserva completa en 4 pasos o menos; SUS de 75 o más con 5 usuarios |
| Adecuación funcional | Cumplimiento de criterios de aceptación | 100 % de historias *Must* aceptadas |
| Fiabilidad | El dinero solo se mueve si la verificación termina bien; reintentos seguros | Cero saldos inconsistentes entre base de datos y blockchain |
| Eficiencia de desempeño | Respuestas rápidas de la API | Verificación de abordaje en menos de 3 s |
| Mantenibilidad | Arquitectura modular de NestJS, revisión de código, pruebas | 70 % de cobertura en backend |
| Compatibilidad | API REST documentada, consumida por web y móvil | Swagger completo y actualizado |
| Portabilidad | Despliegue con contenedores Docker | El sistema levanta con un solo comando en local |

## 3. Arquitectura y modelo de amenazas

La verificación no se puede saltar porque ninguna decisión ocurre en el teléfono: la app solo aporta pruebas firmadas, y el servidor y el contrato inteligente deciden.

### 3.1 Arquitectura

&#91;embedded content: arquitectura de UniRide · clientes, AWS y servicios externos\]

Los dos clientes hablan solo con la API; la API es la única que toca la base de datos, las llaves de KMS y la blockchain.

### 3.2 Qué significa "invulnerable" en este proyecto

Ningún sistema real es absolutamente invulnerable, y afirmarlo sin evidencia es lo primero que un evaluador ataca. Por eso el equipo propone al docente este criterio medible:

1. Ninguna acción que dependa de verificación (publicar, reservar, abordar, pagar) se ejecuta sin que el servidor valide todas las capas.
2. Cada ataque del modelo de amenazas tiene una prueba automatizada que demuestra que falla.
3. El contrato escrow rechaza cualquier liberación que no venga de la cuenta verificadora.

### 3.3 Las cinco capas de verificación

1. **Identidad:** foto del CI, prueba de vida y comparación facial. Un CI y un rostro por cuenta.
2. **Dispositivo:** llave de hardware no exportable y protegida con biometría; atestación de Play Integrity en cada petición sensible.
3. **Encuentro:** desafío de un solo uso con 30 s de vida, doble firma y ambos GPS a 50 m o menos, al subir y al bajar.
4. **Trayecto:** posiciones firmadas cada 15 s, cruzadas en el servidor, con detección de saltos imposibles.
5. **Dinero:** el pasaje queda en escrow y solo el verificador lo libera. Los viajes no crean saldo nuevo, así que simular viajes no deja ganancia.

Estados de un viaje: Publicado → Reservado → En curso (abordaje verificado) → Verificado (bajada y traza válidas) → Pagado. Desde Publicado o Reservado puede pasar a Cancelado; si no hay abordaje a tiempo, a Expirado con reembolso.

### 3.4 Modelo de amenazas

| ID | Ataque | Contramedida | Capa | Historia |
| --- | --- | --- | --- | --- |
| A-01 | Registrarse con la foto o un video de otra persona | Prueba de vida de Rekognition y comparación con el CI | Identidad | HU-08 |
| A-02 | Una persona con varias cuentas | CI único, búsqueda de rostro duplicado y un dispositivo por cuenta | Identidad | HU-08, HU-09 |
| A-03 | Usar un emulador, root o una app modificada | Atestación de Play Integrity validada en el servidor | Dispositivo | HU-09 |
| A-04 | Usar el teléfono robado o prestado de otro | La llave de firma exige la biometría del dueño | Dispositivo | HU-09, HU-29 |
| A-05 | Repetir un handshake capturado | Desafío de un solo uso que vence en 30 s | Encuentro | HU-22 |
| A-06 | Enviar una foto del QR a alguien lejos | Doble firma y ambos GPS a 50 m o menos dentro del mismo desafío | Encuentro | HU-22 |
| A-07 | Falsificar la ubicación GPS | Atestación, detección de ubicación simulada, cruce de trazas y límite de velocidad | Trayecto | HU-22, HU-23 |
| A-08 | Llamar a la API directamente sin la app | Toda petición sensible exige firma del dispositivo; el servidor controla la máquina de estados | Dispositivo | HU-09 |
| A-09 | Liberar un pago sin viaje o cobrar dos veces | Solo el verificador libera, solo viajes "Verificado", una vez por viaje | Dinero | HU-24 |
| A-10 | Conductor y pasajero se ponen de acuerdo para simular viajes | Los viajes no crean saldo; detección de patrones repetitivos | Dinero | HU-25 |
| A-11 | Usar un comando de voz para mover dinero | La voz nunca autoriza; toda acción sensible pide biometría | Dispositivo | HU-29 |
| A-12 | Robar las llaves del servidor | Llaves en AWS KMS, nunca en el código ni en la base de datos | Dinero | HU-12 |
| A-13 | Ver o modificar datos de otra organización | Identificador de organización en cada registro y Row-Level Security de PostgreSQL | Organización | HU-01, HU-02 |

## 4. Roadmap Oficial

El producto se entrega en cinco sprints: la Release 1.0 (viaje completo verificado y pagado) cierra el 22 de noviembre y la Release 2.0 (voz y calidad) el 6 de diciembre.

&#91;embedded content: roadmap · 5 sprints y defensa final\]

El Sprint 0 dura una semana porque solo prepara el terreno; desde el Sprint 1 cada Review muestra algo usable al docente.

| Sprint | Objetivo del sprint | Se demuestra en la Review | SP | Release |
| --- | --- | --- | --- | --- |
| S0 | Dejar listo el terreno técnico | Repositorio con CI, AWS levantado, prototipo en Figma, contratos probados en Hardhat | 18 | — |
| S1 | Organizaciones y cuentas funcionando | Dos organizaciones con sus miembros; un conductor publica un viaje | 28 | — |
| S2 | Identidad verificada y billetera activa | Registro con prueba de vida, teléfono vinculado y una recarga visible en el explorador de bloques | 34 | — |
| S3 | Viaje completo verificado y pagado | Reserva en escrow, abordaje y bajada verificados, pago liberado; intentos de ataque rechazados en vivo | 32 | 1.0 |
| S4 | Voz, cancelaciones y calidad | Reserva por voz, resultado SUS de 75 o más, suite de ataques completa | 34 | 2.0 |
| Defensa | Presentación final | Demo en vivo con dos teléfonos y dos organizaciones | — | — |

## 5. Product Backlog maestro

El backlog tiene 39 ítems en 9 épicas: 6 habilitadores técnicos (PB) y 33 historias de usuario (HU). Todos los *Must* caben en los sprints 0 a 4; los ítems marcados como *Reserva* entran solo si la velocidad real lo permite.

### 5.1 Épicas

| ID | Épica | Objetivo | Requisito del docente |
| --- | --- | --- | --- |
| E0 | Fundaciones | Repositorio, CI, AWS, diseño y contratos base | — |
| E1 | Organizaciones | Operar varias universidades y empresas | Diferentes clientes |
| E2 | Cuentas | Registro, acceso y pertenencia a organizaciones | Diferentes clientes |
| E3 | Verificación de identidad | Persona real, única y atada a un dispositivo | Verificación |
| E4 | Billetera blockchain | Saldo, recargas y movimientos on-chain | Billetera blockchain |
| E5 | Viajes | Publicar, buscar, reservar y cancelar | — |
| E6 | Verificación de presencia | Probar que el viaje ocurrió antes de pagar | Verificación |
| E7 | Interfaz y voz | Navegación simple y comandos por voz | Interfaz con voz |
| E8 | Administración y reportes | Paneles y métricas por organización | Diferentes clientes |
| E9 | Seguridad y calidad | Pruebas de ataques y desempeño | Verificación |

### 5.2 Backlog priorizado

| ID | Épica | Ítem | Prioridad | SP | Sprint |
| --- | --- | --- | --- | --- | --- |
| PB-01 | E0 | Configurar monorepo, CI en GitHub Actions y entornos AWS (RDS, App Runner o EC2, S3) | Must | 5 | S0 |
| PB-02 | E0 | Diseñar modelo de datos multi-tenant y arquitectura | Must | 3 | S0 |
| PB-03 | E0 | Prototipo en Figma de los flujos principales | Must | 5 | S0 |
| PB-04 | E0 | Token URC y contrato escrow con pruebas en Hardhat | Must | 5 | S0 |
| HU-01 | E1 | Super administrador da de alta una organización | Must | 3 | S1 |
| HU-02 | E1 | Administrador define dominios de correo y reglas de afiliación | Must | 3 | S1 |
| HU-03 | E1 | Administrador aprueba o rechaza miembros | Must | 3 | S1 |
| HU-05 | E2 | Registro con correo institucional y código OTP | Must | 5 | S1 |
| HU-06 | E2 | Inicio de sesión seguro (JWT con refresh token) | Must | 3 | S1 |
| HU-11 | E3 | Conductor registra su vehículo | Must | 3 | S1 |
| HU-17 | E5 | Conductor publica un viaje | Must | 5 | S1 |
| HU-07 | E2 | Usuario pertenece a varias organizaciones | Should | 3 | S1 |
| HU-08 | E3 | Verificación de identidad con CI y prueba de vida | Must | 8 | S2 |
| HU-09 | E3 | Vinculación de cuenta a dispositivo con llave de hardware y atestación | Must | 8 | S2 |
| HU-12 | E4 | Creación automática de billetera on-chain | Must | 5 | S2 |
| HU-13 | E4 | Recarga de saldo (simulada) | Must | 5 | S2 |
| HU-14 | E4 | Consulta de saldo e historial con enlace al explorador | Must | 3 | S2 |
| HU-18 | E5 | Pasajero busca viajes por destino y hora | Must | 5 | S2 |
| HU-19 | E5 | Reserva con pasaje bloqueado en escrow | Must | 8 | S3 |
| HU-22 | E6 | Verificación de abordaje por handshake criptográfico | Must | 8 | S3 |
| HU-23 | E6 | Seguimiento GPS y verificación de bajada | Must | 8 | S3 |
| HU-24 | E6 | Liberación del pago al conductor tras verificación | Must | 5 | S3 |
| HU-29 | E7 | Confirmación biométrica de acciones sensibles | Must | 3 | S3 |
| HU-20 | E5 | Cancelación con reembolso según reglas | Must | 5 | S4 |
| HU-27 | E7 | Buscar y reservar viajes por voz | Must | 5 | S4 |
| HU-28 | E7 | Consultar saldo, estado del viaje y cancelar por voz | Must | 5 | S4 |
| HU-30 | E7 | Prueba de usabilidad (SUS) con 5 usuarios | Must | 3 | S4 |
| PB-05 | E9 | Suite consolidada de pruebas de ataque del modelo de amenazas | Must | 8 | S4 |
| HU-25 | E6 | Detección de anomalías y bloqueo preventivo | Should | 5 | S4 |
| HU-04 | E1 | Administrador configura tarifas y viajes entre organizaciones | Should | 3 | S4 |
| HU-10 | E3 | Cambio de dispositivo con nueva verificación | Should | 5 | Reserva |
| HU-16 | E4 | Conductor retira saldo (simulado) | Should | 3 | Reserva |
| HU-21 | E5 | Calificación mutua tras el viaje | Should | 3 | Reserva |
| HU-26 | E8 | Administrador revisa alertas de fraude | Should | 3 | Reserva |
| HU-32 | E8 | Panel de organización con viajes, usuarios y CO₂ evitado | Should | 5 | Reserva |
| HU-15 | E4 | Organización subsidia saldo a sus miembros | Could | 5 | Reserva |
| HU-31 | E7 | Accesibilidad: modo oscuro, tamaño de texto y contraste | Could | 3 | Reserva |
| HU-33 | E8 | Métricas globales para el super administrador | Could | 3 | Reserva |
| PB-06 | E9 | Pruebas de carga básicas | Could | 3 | Reserva |

Carga planificada: S0 = 18 SP (sprint de una semana), S1 = 28, S2 = 34, S3 = 32, S4 = 34 y Reserva = 33. Si la velocidad del Sprint 1 queda por debajo de 28, el PO mueve los *Should* de S4 a Reserva.

## 6. Historias de usuario

Se detallan las 22 historias *Must* de los sprints 1 a 4. Las demás se refinan cuando entren a un sprint. Los códigos A-xx remiten a las amenazas de la sección 3.4.

### Sprint 1 — Organizaciones y cuentas

**HU-01 · Alta de organización** (Must · 3 SP) Como super administrador, quiero registrar una organización con su tipo (universidad o empresa), nombre y administrador inicial, para que sus miembros puedan usar UniRide.

- Dado un formulario completo, cuando lo guardo, entonces la organización queda activa y su administrador recibe un correo de invitación.
- Dado un nombre ya registrado, cuando intento guardarlo, entonces el sistema lo rechaza.
- Cada registro de la base de datos lleva el identificador de su organización (A-13).

**HU-02 · Reglas de afiliación** (Must · 3 SP) Como administrador de organización, quiero definir los dominios de correo válidos (por ejemplo @uagrm.edu.bo) y si la aprobación es automática o manual, para controlar quién entra.

- Puedo registrar uno o más dominios.
- Si elijo aprobación manual, los nuevos miembros quedan en estado "pendiente".
- Un administrador no puede ver ni modificar datos de otra organización (A-13).

**HU-03 · Aprobación de miembros** (Must · 3 SP) Como administrador de organización, quiero aprobar o rechazar solicitudes de ingreso, para que solo personas legítimas usen la plataforma.

- Veo una lista de pendientes con nombre, correo y fecha.
- Al aprobar o rechazar, el usuario recibe una notificación.
- Toda decisión queda registrada con autor y fecha.

**HU-05 · Registro con correo institucional** (Must · 5 SP) Como estudiante o empleado, quiero registrarme con el correo de mi organización, para acceder a los viajes de mi comunidad.

- Dado un correo de un dominio registrado, cuando me registro, entonces recibo un código OTP de 6 dígitos que vence en 10 minutos.
- Dado un dominio no registrado, entonces el sistema me informa que mi organización no está afiliada.
- Tras 5 códigos erróneos, la cuenta se bloquea 15 minutos.

**HU-06 · Inicio de sesión** (Must · 3 SP) Como usuario, quiero iniciar sesión de forma segura, para usar la app sin repetir el registro.

- El token de acceso dura 15 minutos y se renueva con un refresh token.
- Al cerrar sesión, el refresh token queda revocado.
- Las contraseñas se guardan con hash (bcrypt o argon2), nunca en texto plano.

**HU-11 · Registro de vehículo** (Must · 3 SP) Como conductor, quiero registrar mi vehículo con placa, marca, modelo, color, capacidad y foto, para que los pasajeros me identifiquen.

- La placa es única en todo el sistema.
- La capacidad define el máximo de cupos que puedo ofrecer.
- No puedo publicar viajes sin un vehículo registrado.

**HU-17 · Publicar viaje** (Must · 5 SP) Como conductor, quiero publicar un viaje con origen, destino, fecha, hora, cupos y precio, para compartir mi trayecto.

- Los cupos no superan la capacidad del vehículo.
- El precio no supera el tope definido por la organización.
- Solo miembros de las organizaciones permitidas ven el viaje.

### Sprint 2 — Identidad y billetera

**HU-08 · Verificación de identidad** (Must · 8 SP) Como usuario, quiero verificar mi identidad con mi carnet y una prueba de vida, para que los demás confíen en que soy una persona real.

- Subo foto del anverso del CI y hago la prueba de vida de Rekognition Face Liveness.
- El rostro de la prueba de vida debe coincidir con la foto del CI con una similitud de 90 % o más.
- Un mismo CI o un mismo rostro no puede verificar dos cuentas (A-01, A-02).
- Sin verificación aprobada no puedo publicar, reservar ni recibir pagos.

**HU-09 · Vinculación de dispositivo** (Must · 8 SP) Como usuario, quiero que mi cuenta quede atada a mi teléfono, para que nadie la use desde otro dispositivo.

- La app genera un par de llaves en el Android Keystore, no exportable y protegido con biometría.
- El servidor guarda la llave pública y valida la atestación de Play Integrity.
- Un emulador, un teléfono con root o una app modificada no logran vincularse (A-03).
- Cada petición sensible a la API va firmada con esa llave; sin firma válida, el servidor responde 401 (A-04, A-08).

**HU-12 · Creación de billetera** (Must · 5 SP) Como usuario verificado, quiero tener una billetera blockchain automáticamente, para pagar y cobrar viajes sin configurar nada.

- Al aprobarse mi verificación se crea una dirección en Polygon Amoy.
- La llave privada vive en AWS KMS y nunca sale de ahí (A-12).
- Veo mi dirección y un saldo inicial de 0 URC.

**HU-13 · Recarga de saldo** (Must · 5 SP) Como pasajero, quiero recargar saldo, para pagar mis viajes.

- Elijo un monto entre 10 y 500 Bs y se genera un QR de pago simulado.
- Al confirmarse el pago, el contrato acuña la misma cantidad de URC en mi billetera.
- La recarga aparece en mi historial con el hash de la transacción.

**HU-14 · Saldo e historial** (Must · 3 SP) Como usuario, quiero ver mi saldo y mis movimientos, para controlar mi dinero.

- El saldo mostrado coincide con el saldo on-chain.
- Cada movimiento muestra tipo, monto, fecha y un enlace al explorador de bloques.
- Distingo saldo disponible de saldo bloqueado en escrow.

**HU-18 · Buscar viajes** (Must · 5 SP) Como pasajero, quiero buscar viajes por destino y hora, para encontrar uno que me sirva.

- Veo viajes con salida a 1 km o menos de mi ubicación y una ventana de ± 30 minutos.
- Cada resultado muestra conductor, calificación, vehículo, hora, precio y cupos.
- Solo aparecen viajes de organizaciones a las que tengo acceso.

### Sprint 3 — Reserva, presencia y pago

**HU-19 · Reserva con escrow** (Must · 8 SP) Como pasajero, quiero reservar un cupo y que mi pago quede en garantía, para pagar solo si el viaje ocurre.

- Al confirmar con biometría, el precio pasa de mi saldo disponible al contrato escrow.
- Si mi saldo no alcanza, la reserva no se crea y se me ofrece recargar.
- Dos pasajeros no pueden tomar el último cupo a la vez.

**HU-22 · Verificación de abordaje** (Must · 8 SP) Como conductor y pasajero, queremos confirmar que nos encontramos, para iniciar el viaje con prueba válida.

- El servidor emite un desafío de un solo uso que vence en 30 segundos.
- La app del conductor muestra un QR rotativo firmado con su llave; el pasajero lo escanea y lo firma con la suya.
- El servidor acepta solo si ambas firmas, la atestación y el desafío son válidos y los dos GPS están a 50 m o menos.
- Un QR reutilizado, vencido o enviado a alguien lejos se rechaza (A-05, A-06, A-07).

**HU-23 · Seguimiento y verificación de bajada** (Must · 8 SP) Como sistema, quiero comparar las trazas GPS de conductor y pasajero, para confirmar que viajaron juntos.

- Ambas apps envían su posición firmada cada 15 segundos durante el viaje.
- Al bajar se repite el handshake de HU-22.
- El viaje se valida solo si al menos 80 % de los puntos de ambas trazas están a 100 m o menos entre sí y no hay saltos imposibles (más de 150 km/h) (A-07).

**HU-24 · Liberación del pago** (Must · 5 SP) Como conductor, quiero recibir el pago automáticamente al terminar un viaje verificado, para no depender de la buena voluntad del pasajero.

- Solo la cuenta verificadora del backend puede liberar el escrow, y solo para viajes en estado "verificado" (A-09).
- El contrato guarda el hash de la prueba de presencia junto a la transacción.
- Un mismo viaje no se puede pagar dos veces.

**HU-29 · Confirmación biométrica** (Must · 3 SP) Como usuario, quiero confirmar con mi huella o rostro las acciones que mueven dinero o verifican viajes, para que nadie las haga en mi nombre.

- Reservar, cancelar, recargar, retirar y verificar abordaje piden biometría.
- Ningún comando de voz salta este paso (A-11).

### Sprint 4 — Voz, cancelaciones y calidad

**HU-20 · Cancelación con reembolso** (Must · 5 SP) Como pasajero o conductor, quiero cancelar un viaje con reglas claras, para no perder dinero injustamente.

- Si el pasajero cancela con más de 30 minutos de anticipación, recibe el 100 % del escrow; con menos, el 50 %.
- Si el conductor cancela o no se verifica el abordaje en 15 minutos desde la hora pactada, el pasajero recibe el 100 %.

**HU-27 · Reservar por voz** (Must · 5 SP) Como pasajero, quiero decir "busca un viaje a la UAGRM a las 7", para reservar sin escribir.

- La app reconoce destino y hora en español y muestra los resultados.
- Puedo decir "reserva el primero" y la app pide confirmación biométrica.
- Si no entiende, repregunta en vez de adivinar.

**HU-28 · Consultas por voz** (Must · 5 SP) Como usuario, quiero preguntar mi saldo, el estado de mi viaje o cancelarlo por voz, para usar la app con las manos ocupadas.

- Comandos mínimos: "¿cuál es mi saldo?", "¿dónde está mi conductor?", "cancela mi viaje", "ayúdame".
- La respuesta se muestra en pantalla y se lee en voz alta.

**HU-30 · Prueba de usabilidad** (Must · 3 SP) Como equipo, queremos medir la usabilidad con usuarios reales, para demostrar que la interfaz es intuitiva.

- Cinco personas ajenas al equipo completan buscar, reservar y consultar saldo sin ayuda.
- Se aplica el cuestionario SUS y el promedio es 75 o más.
- Los problemas encontrados entran al backlog.

## 7. Riesgos y glosario

El riesgo más alto es técnico: la verificación y la blockchain son tecnologías nuevas para el equipo, por eso se prueban en el Sprint 0 antes de construir encima.

### 7.1 Registro de riesgos

| ID | Riesgo | Probabilidad | Impacto | Respuesta |
| --- | --- | --- | --- | --- |
| R-01 | El equipo no domina Solidity ni Play Integrity | Alta | Alto | Prueba de concepto en S0 (PB-04) y en el primer día de S2; una persona responsable por tecnología |
| R-02 | Se necesitan teléfonos Android físicos para probar la verificación | Alta | Medio | Asegurar al menos dos teléfonos del equipo desde S0; las demás funciones se prueban en emulador con un modo de desarrollo que nunca llega a producción |
| R-03 | Costos de AWS fuera de la capa gratuita | Media | Medio | Alertas de presupuesto en AWS, instancias pequeñas, apagar entornos fuera de horario |
| R-04 | La red de prueba Polygon Amoy falla o se satura en la defensa | Baja | Alto | Tener una red local de Hardhat lista como respaldo |
| R-05 | Baja velocidad del equipo por otras materias | Alta | Medio | Historias de 8 SP o menos; mover *Should* a Reserva según la velocidad |
| R-06 | El docente agrega requisitos a mitad del semestre | Media | Medio | Gestión de cambios de la sección 2.7 |
| R-07 | El reconocimiento de voz falla con ruido o acento local | Media | Bajo | Repreguntar ante dudas; la interfaz táctil siempre está disponible |
| R-08 | Integrar cuatro proyectos (móvil, web, backend, contratos) al final | Media | Alto | Integración continua desde S1 y despliegue al cierre de cada sprint |

### 7.2 Glosario

| Término | Significado |
| --- | --- |
| Atestación de dispositivo | Prueba firmada por Google (Play Integrity) o Apple (App Attest) de que la app es original y corre en un dispositivo real sin modificar |
| Escrow | Garantía: el dinero queda retenido en un contrato hasta que se cumple una condición |
| Handshake | Intercambio de mensajes firmados entre dos dispositivos para probar que estuvieron juntos |
| Keystore / Secure Enclave | Chip seguro del teléfono donde se guardan llaves que no se pueden copiar |
| Multi-tenant | Una sola plataforma que atiende a varias organizaciones con datos aislados entre sí |
| Nonce | Valor aleatorio de un solo uso que impide repetir un mensaje capturado |
| Prueba de vida | Verificación de que frente a la cámara hay una persona real y no una foto o video |
| Relayer | Servicio del backend que firma y envía transacciones a la blockchain en nombre de los usuarios y paga el gas |
| Red de prueba (testnet) | Red blockchain para desarrollo, con tokens sin valor real |
| SUS | System Usability Scale: cuestionario estándar de 10 preguntas que mide usabilidad de 0 a 100 |
| URC (UniCoin) | Token propio de UniRide; 1 URC equivale a 1 Bs en este proyecto |
