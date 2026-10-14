# Roadmap — Product Backlog de UniRide

> Fuente: documento técnico §4–§5 y `AGENTS.md`. Ordenado por dependencia técnica dentro de cada sprint. Los criterios de aceptación **no** van acá: viven en el `spec.md` de cada HU. El detalle técnico vive en `ssd.md`. Este archivo se actualiza cada vez que una HU cambia de estado.
>
> Estados: `pendiente` · `en spec` · `en plan` · `en progreso` · `hecho` · `bloqueado`.
> PHU = puntos de historia (Fibonacci). Las estimaciones vienen del documento técnico y se confirman en el Planning Poker de cada sprint.

## Calendario

| Sprint | Fechas | Objetivo | PHU | Release |
|---|---|---|---|---|
| S0 | 14/10 – 20/10/2026 | Dejar listo el terreno técnico | 18 | — |
| S1 | 21/10 – 27/10/2026 | Organizaciones y cuentas funcionando | 26 | — |
| S2 | 28/10 – 03/11/2026 | Identidad verificada, billetera activa y viajes publicados | 39 | — |
| S3 | 04/11 – 10/11/2026 | Viaje completo verificado y pagado | 32 | 1.0 |
| S4 | 11/11 – 17/11/2026 | Voz, cancelaciones y calidad | 34 | 2.0 |
| Defensa | `[POR DEFINIR]` | Demo en vivo con dos teléfonos y dos organizaciones | — | — |

Sprints de 1 semana, de miércoles a martes (D-14). El mismo alcance se comprimió de 9 a 5 semanas: al cerrar S1 se mide la velocidad y, si queda corta, se aplica la regla de abajo (ver riesgo en `MEMORY.md`).

## Sprint 0 — Fundaciones (resultados esperados)

Al cerrar S0 deben existir:

- Repositorio monorepo en GitHub (`mobile/`, `web/`, `backend/`, `contracts/`) con `main` y `develop` protegidas.
- Scaffolding de las cuatro carpetas con ESLint + Prettier y scripts de lint, pruebas y build.
- CI en GitHub Actions ejecutando lint, pruebas y build en cada PR.
- Entorno local con Docker (PostgreSQL + backend) y `.env.example` documentado.
- Entorno AWS mínimo (RDS, S3, alertas de presupuesto) y Hardhat local como respaldo de Amoy.
- Modelo de datos multi-tenant y arquitectura acordados (PB-02, en `ssd.md`).
- Prototipo Figma del flujo principal (PB-03).
- Token URC y contrato escrow probados en Hardhat (PB-04).
- Criterios de calidad y Definition of Done configurados (`constitution.md` Art. 12) y plantilla de PR con el checklist DoD.
- Roles Scrum asignados y herramienta de backlog elegida.

Tareas concretas: `/.agents/STEERING/backlog.md`.

## Product Backlog

| ID | Nombre | Historia | Prioridad | PHU | Sprint | Estado | Depende de |
|---|---|---|---|---|---|---|---|
| PB-01 | Monorepo, CI y entornos | Como equipo quiero repo, CI y entornos AWS para integrar desde el primer día | Alta (Must) | 5 | S0 | en progreso | — |
| PB-02 | Modelo de datos y arquitectura | Como equipo quiero el modelo multi-tenant y la arquitectura para construir sin rehacer | Alta (Must) | 3 | S0 | pendiente | — |
| PB-03 | Prototipo Figma | Como equipo quiero el prototipo de los flujos principales para validar la usabilidad antes de codificar | Alta (Must) | 5 | S0 | pendiente | — |
| PB-04 | Token URC y escrow | Como equipo quiero el token y el escrow probados para reducir el riesgo R-01 | Alta (Must) | 5 | S0 | en progreso | — |
| HU-06 | Inicio de sesión | Como usuario quiero iniciar sesión de forma segura para no repetir el registro | Alta (Must) | 3 | S1 | en plan | PB-01, PB-02 |
| HU-01 | Alta de organización | Como super administrador quiero registrar una organización para que sus miembros usen UniRide | Alta (Must) | 3 | S1 | en plan | HU-06 |
| HU-02 | Reglas de afiliación | Como admin. de organización quiero definir dominios de correo y tipo de aprobación para controlar quién entra | Alta (Must) | 3 | S1 | en plan | HU-01 |
| HU-05 | Registro con correo institucional | Como estudiante o empleado quiero registrarme con el correo de mi organización para acceder a sus viajes | Alta (Must) | 5 | S1 | en plan | HU-02 |
| HU-03 | Aprobación de miembros | Como admin. de organización quiero aprobar o rechazar solicitudes para que solo entren personas legítimas | Alta (Must) | 3 | S1 | en plan | HU-02, HU-05 |
| HU-07 | Varias organizaciones | Como usuario quiero pertenecer a varias organizaciones para viajar con cada comunidad | Media (Should) | 3 | S1 | en plan | HU-06 |
| HU-34 | Recuperación de contraseña | Como usuario quiero recuperar el acceso si olvido mi contraseña para no perder mi cuenta | Media (Should) | 3 | S1 | en plan | HU-05, HU-06 |
| HU-11 | Registro de vehículo | Como conductor quiero registrar mi vehículo para que los pasajeros me identifiquen | Alta (Must) | 3 | S1 | en plan | HU-06 |
| HU-08 | Verificación de identidad | Como usuario quiero verificar mi identidad con carnet y prueba de vida para que confíen en mí | Alta (Must) | 8 | S2 | pendiente | HU-06 |
| HU-17 | Publicar viaje | Como conductor quiero publicar un viaje para compartir mi trayecto | Alta (Must) | 5 | S2 | pendiente | HU-11, HU-08 |
| HU-09 | Vinculación de dispositivo | Como usuario quiero mi cuenta atada a mi teléfono para que nadie la use desde otro | Alta (Must) | 8 | S2 | pendiente | HU-06 |
| HU-12 | Creación de billetera | Como usuario verificado quiero una billetera automática para pagar y cobrar sin configurar nada | Alta (Must) | 5 | S2 | pendiente | HU-08, PB-04 |
| HU-13 | Recarga de saldo | Como pasajero quiero recargar saldo para pagar mis viajes | Alta (Must) | 5 | S2 | pendiente | HU-12, HU-09 (biometría, ver D-13) |
| HU-14 | Saldo e historial | Como usuario quiero ver saldo y movimientos para controlar mi dinero | Alta (Must) | 3 | S2 | pendiente | HU-12 |
| HU-18 | Buscar viajes | Como pasajero quiero buscar viajes por destino y hora para encontrar uno que me sirva | Alta (Must) | 5 | S2 | pendiente | HU-17 (calificación, ver D-17) |
| HU-29 | Confirmación biométrica | Como usuario quiero confirmar con huella o rostro las acciones sensibles para que nadie las haga en mi nombre | Alta (Must) | 3 | S3 | pendiente | HU-09 |
| HU-19 | Reserva con escrow | Como pasajero quiero reservar y que mi pago quede en garantía para pagar solo si el viaje ocurre | Alta (Must) | 8 | S3 | pendiente | HU-18, HU-13, HU-29, PB-04 |
| HU-22 | Verificación de abordaje | Como conductor y pasajero queremos confirmar que nos encontramos para iniciar el viaje con prueba válida | Alta (Must) | 8 | S3 | pendiente | HU-19, HU-09 |
| HU-23 | Seguimiento y bajada | Como sistema quiero comparar las trazas GPS para confirmar que viajaron juntos | Alta (Must) | 8 | S3 | pendiente | HU-22 |
| HU-24 | Liberación del pago | Como conductor quiero recibir el pago automáticamente tras un viaje verificado para no depender del pasajero | Alta (Must) | 5 | S3 | pendiente | HU-23, PB-04 |
| HU-20 | Cancelación con reembolso | Como pasajero o conductor quiero cancelar con reglas claras para no perder dinero injustamente | Alta (Must) | 5 | S4 | pendiente | HU-19, HU-22 |
| HU-27 | Reservar por voz | Como pasajero quiero buscar y reservar diciendo destino y hora para no escribir | Alta (Must) | 5 | S4 | pendiente | HU-18, HU-19, HU-29 |
| HU-28 | Consultas por voz | Como usuario quiero preguntar saldo, estado del viaje o cancelar por voz para usar la app con las manos ocupadas | Alta (Must) | 5 | S4 | pendiente | HU-14, HU-20, HU-23 |
| PB-05 | Suite de ataques | Como equipo queremos la suite consolidada del modelo de amenazas para demostrar que la verificación no se salta | Alta (Must) | 8 | S4 | pendiente | HU-24, HU-29 |
| HU-30 | Prueba de usabilidad (SUS) | Como equipo queremos medir la usabilidad con 5 usuarios para demostrar que la interfaz es intuitiva | Alta (Must) | 3 | S4 | pendiente | HU-27, HU-28 |
| HU-25 | Detección de anomalías | Como sistema quiero detectar patrones de colusión y bloquear preventivamente para evitar fraude | Media (Should) | 5 | S4 | pendiente | HU-24 |
| HU-04 | Tarifas y viajes entre organizaciones | Como admin. de organización quiero configurar tarifas y con qué organizaciones se comparten viajes | Media (Should) | 3 | S4 | pendiente | HU-02, HU-17 |
| HU-10 | Cambio de dispositivo | Como usuario quiero cambiar de teléfono con nueva verificación para no perder mi cuenta | Media (Should) | 5 | Reserva | pendiente | HU-08, HU-09 |
| HU-16 | Retiro de saldo | Como conductor quiero retirar saldo (simulado) para cobrar lo ganado | Media (Should) | 3 | Reserva | pendiente | HU-14, HU-29 |
| HU-21 | Calificación mutua | Como usuario quiero calificar a la otra parte tras el viaje para construir confianza | Media (Should) | 3 | Reserva | pendiente | HU-24 |
| HU-26 | Alertas de fraude | Como admin. de organización quiero revisar alertas de fraude para actuar a tiempo | Media (Should) | 3 | Reserva | pendiente | HU-25 |
| HU-32 | Panel de organización | Como admin. de organización quiero ver viajes, usuarios y CO₂ evitado para medir el impacto | Media (Should) | 5 | Reserva | pendiente | HU-24 |
| HU-15 | Subsidio de saldo | Como organización quiero subsidiar saldo a mis miembros para fomentar el uso | Baja (Could) | 5 | Reserva | pendiente | HU-13 |
| HU-31 | Accesibilidad | Como usuario quiero modo oscuro, tamaño de texto y contraste para usar la app cómodamente | Baja (Could) | 3 | Reserva | pendiente | PB-03 |
| HU-33 | Métricas globales | Como super administrador quiero métricas globales para supervisar la plataforma | Baja (Could) | 3 | Reserva | pendiente | HU-32 |
| PB-06 | Pruebas de carga | Como equipo queremos pruebas de carga básicas para validar las metas de rendimiento | Baja (Could) | 3 | Reserva | pendiente | HU-18, HU-22 |

`Reserva` = en el backlog pero **no comprometido**: entra solo si la velocidad real lo permite. Si la velocidad de S1 queda bajo 26 PHU, el PO mueve los *Should* de S4 a Reserva.

## Cobertura de los requisitos del docente

| Requisito | HU comprometidas (S0–S4) | Refuerzo en Reserva |
|---|---|---|
| 1. Multi-cliente | PB-02, HU-01, HU-02, HU-03, HU-05, HU-06, HU-07, HU-34, HU-04 | HU-26, HU-32, HU-33 |
| 2. Verificación invulnerable | HU-08, HU-09, HU-29, HU-22, HU-23, HU-24, HU-25, PB-05 | HU-10 |
| 3. Billetera blockchain | PB-04, HU-12, HU-13, HU-14, HU-19, HU-24, HU-20 | HU-15, HU-16 |
| 4. Interfaz navegable con voz | PB-03, HU-27, HU-28, HU-29, HU-30 | HU-31 |

Ningún requisito queda sin HU comprometida.

---

## Fuera de alcance v1 — NO planificado

Excluido explícitamente por el documento técnico §1.4. No se implementa en este semestre.

- Publicación en Play Store o App Store.
- Pasarela de pago real con bancos.
- Dinero real o criptomonedas en red principal (mainnet).
- Validación de licencias de conducir o seguros con entidades estatales.

## Post-v1 — NO planificado

Ideas para después de la defensa. No tienen HU ni estimación.

- Soporte iOS con App Attest (mencionado en el glosario).
- Cálculo de rutas óptimas con varios pasajeros.
- Chat en tiempo real entre usuarios.
- Soporte multi-idioma.
