# HU-29 · Confirmación biométrica — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-08)` · Épica: E7 Interfaz y voz · Prioridad: Must · PHU: 3 · Sprint: S3
> **Orden en S3: 1.ª.** HU-19, HU-22 y HU-23 aplican la regla que fija esta historia.
> Requisito del docente que cubre: **2 — Verificación que no se pueda saltar** y **4 — Interfaz con voz** (la voz nunca autoriza)
> Amenazas que toca: **A-04** (teléfono robado o prestado), **A-08** (llamar a la API sin la app), **A-11** (mover dinero con un comando de voz)

## 1. Historia

**Como** usuario verificado
**quiero** confirmar con mi huella o mi rostro las acciones que mueven dinero o verifican un viaje
**para** que nadie las haga en mi nombre, ni con mi teléfono ni con un comando de voz.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | una persona verificada con su teléfono vinculado | confirma una acción sensible (RN-1) | la app muestra antes un resumen con la acción, el monto y su efecto, y el diálogo biométrico del sistema nombra la acción y el monto |
| CA-2 | el diálogo biométrico abierto | la persona lo cancela o la huella no coincide | no se envía nada al servidor, nada cambia y aparece el aviso «No se confirmó {acción}.» |
| CA-3 | una acción sensible confirmada con la biometría del dueño | el servidor la recibe | la acepta solo si viene firmada por el teléfono vinculado de esa cuenta con la llave protegida por biometría, y la registra en auditoría con fecha, usuario y resultado |
| CA-4 | **ataque A-11:** una acción sensible iniciada por un comando de voz | llega a la confirmación | se abre el mismo diálogo biométrico; sin huella no se ejecuta. No existe ningún camino en que la voz complete la acción sin biometría |
| CA-5 | **ataque A-04:** otra persona con el teléfono desbloqueado del dueño | intenta confirmar una acción sensible con su propia huella o rostro | la llave no firma y el servidor no recibe nada válido |
| CA-6 | **ataque A-08:** un atacante con un token de sesión válido pero sin el teléfono | llama directamente a cualquier acción sensible sin firma, con la firma de otro teléfono o repitiendo una firma ya usada | el servidor responde 401 y no ejecuta nada |
| CA-7 | todas las acciones de la RN-1 que existen en el código | se revisa el catálogo de acciones del servidor | cada una exige la firma biométrica; una acción sensible nueva sin ella hace fallar las pruebas |
| CA-8 | un teléfono sin huella ni rostro registrados en el sistema | la persona intenta una acción sensible | la app explica que debe registrar una huella en los ajustes del teléfono y no ofrece otra forma de confirmar |
| CA-9 | la confirmación enviada | el servidor todavía no responde | la app nunca muestra «Confirmado» antes de la respuesta del servidor |

## 3. Reglas de negocio

- RN-1: **Acciones sensibles** (piden biometría): reservar (HU-19), cancelar una reserva o un viaje (HU-20), recargar (HU-13), retirar (HU-16), verificar abordaje y bajada (HU-22, HU-23), crear la billetera (HU-12) y publicar un viaje (HU-17). Las historias de S4 y Reserva heredan esta regla.
- RN-2: **No piden biometría** las consultas: saldo y movimientos (decisión de HU-14), búsqueda y detalle de viajes, y el estado de una reserva. Tampoco la piden las posiciones automáticas del trayecto ni la renovación del código del conductor (ver D-22).
- RN-3: **Una huella por acción.** No hay ventana de validez: confirmar una acción no deja confirmadas las siguientes.
- RN-4: Solo valen la huella o el rostro de clase fuerte que el sistema acepta. El PIN, el patrón o la contraseña del teléfono **no** sustituyen a la biometría.
- RN-5: El bloqueo tras intentos fallidos lo aplica el sistema del teléfono (5 fallos → espera); la app no lo debilita ni ofrece un camino alternativo.
- RN-6: La voz navega y prepara; nunca confirma (`constitution.md` Art. 5.2).

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Diálogo cancelado (CA-2) | Nada se envía; el botón vuelve a reposo | `comun.biometria.no_confirmado` |
| Demasiados intentos fallidos | El sistema bloquea; la acción no se ejecuta | `comun.biometria.bloqueada` |
| Sin biometría registrada (CA-8) | No se ofrece otra forma de confirmar | `comun.biometria.sin_registrar` |
| Huella nueva registrada en el teléfono (la llave queda anulada) | La acción no se puede firmar; se indica que debe volver a vincular el teléfono | `dispositivo.llave_anulada.explicacion` (HU-10 CA-1) |
| Firma válida que llega después de la ventana de 30 s o repetida | Rechazo 401 sin ejecutar | `comun.errores.peticion_expirada` |
| Sin conexión tras confirmar | La acción no se da por hecha; se puede reintentar con una huella nueva | `comun.errores.sin_conexion` |

## 5. Fuera de alcance de esta HU

- Los comandos de voz en sí (HU-27, HU-28): esta HU fija que la voz desemboca en el mismo diálogo.
- Volver a vincular tras registrar una huella nueva → HU-10 (sube a S3, D-28).
- Las acciones de cancelar y retirar: las construyen HU-20 y HU-16 aplicando esta regla.

## 6. Dependencias

- HU / PB: HU-09 (llave de hardware con biometría, ya construida en SP125).
- Decisiones resueltas: **D-22** (08/11): el código rotativo y las posiciones se firman con una llave de trayecto sin biometría, que solo se crea con una confirmación biométrica (RN-2).
- Decisiones resueltas: **D-28**: la llave anulada por una huella nueva se recupera con HU-10.
- Decisiones abiertas que la afectan: accesibilidad de los avisos con TalkBack.

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque A-04, A-08 y A-11 en verde; A-04 y la biometría probadas en teléfono Android físico.
- [ ] PR revisado por otro integrante.
- [ ] CI en verde (lint, pruebas, build).
- [ ] Correctitud · Eficiencia · Fiabilidad · Facilidad de uso · Mantenimiento · Seguridad e integridad · Portabilidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Esta spec refleja lo realmente construido.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-08 | Creación (borrador) | 2026-11-08 · Specs del Sprint 3 en borrador y decisiones D-22 a D-27 |
| 2026-11-08 | Aprobada por el PO | 2026-11-08 · Specs del Sprint 3 aprobadas |
