# PB-05 · Informe de la suite de ataques

Fecha: 2026-11-18T00:58:09.373Z
Commits: principal `d75bc59` · backend `4f47f63` · contracts `39eb263` · mobile `a7b347c`

**13 de 13 amenazas bloqueadas.**

| Id | Ataque | Contramedida | Capa | Historia | Pruebas | Resultado |
|---|---|---|---|---|---|---|
| A-01 | Registrarse con foto o video de otro | Prueba de vida + comparación con carnet | Identidad | HU-08 | 12 | **bloqueado** |
| A-02 | Varias cuentas por persona | Carnet único, rostro duplicado, un dispositivo por cuenta | Identidad | HU-08, HU-09 | 19 | **bloqueado** |
| A-03 | Emulador, root o app modificada | Play Integrity validada en el servidor | Dispositivo | HU-09 | 26 | **bloqueado** (simulada en desarrollo) |
| A-04 | Teléfono robado o prestado | La llave exige la biometría del dueño | Dispositivo | HU-09, HU-29 | 33 | **bloqueado** |
| A-05 | Repetir un handshake capturado | Desafío de un solo uso, vence en 30 s | Encuentro | HU-22 | 24 | **bloqueado** |
| A-06 | Enviar foto del QR a alguien lejos | Doble firma + ambos GPS a ≤ 50 m en el mismo desafío | Encuentro | HU-22 | 4 | **bloqueado** |
| A-07 | Falsificar GPS | Atestación, ubicación simulada, cruce de trazas, límite de velocidad | Encuentro / Trayecto | HU-22, HU-23, HU-25 | 25 | **bloqueado** |
| A-08 | Llamar a la API sin la app | Firma del dispositivo en toda petición sensible; estados controlados por el servidor | Dispositivo | HU-09 | 139 | **bloqueado** |
| A-09 | Liberar pago sin viaje o cobrar dos veces | Solo el verificador libera, solo viajes verificados, una vez | Dinero | HU-24 | 93 | **bloqueado** |
| A-10 | Colusión para simular viajes | Los viajes no crean saldo; detección de patrones | Dinero | HU-25 | 28 | **bloqueado** |
| A-11 | Mover dinero con un comando de voz | La voz nunca autoriza; acción sensible pide biometría | Dispositivo | HU-29 | 34 | **bloqueado** |
| A-12 | Robar llaves del servidor | Relayer y verificador en AWS KMS; llaves de usuario solo cifradas (AES-256-GCM) | Dinero | HU-12 | 18 | **bloqueado** |
| A-13 | Ver o modificar datos de otra organización | Id de organización en cada registro + RLS | Aislamiento | HU-01, HU-02 | 87 | **bloqueado** |

## Pruebas por amenaza

### A-01 · Registrarse con foto o video de otro

- comun/motor-facial-simulado.spec.ts › MotorFacialSimulado ~spoof y las sesiones desconocidas fallan (A-01)
- comun/rekognition.service.spec.ts › RekognitionService REKOGNITION_SIMULADO=true en producción detiene el arranque (A-01)
- identidad/identidad.service.spec.ts › IdentidadService.verificar CA-2 / A-01: spoofing (sesión sin vivacidad) → 422 PRUEBA_VIDA_FALLIDA; no se compara ni se sube nada
- identidad/identidad.service.spec.ts › IdentidadService.verificar A-01: confianza 84 (< 85) → PRUEBA_VIDA_FALLIDA
- identidad/identidad.service.spec.ts › IdentidadService.verificar A-01: Status distinto de SUCCEEDED → PRUEBA_VIDA_FALLIDA
- identidad/identidad.service.spec.ts › IdentidadService.verificar A-01: sin imagen de referencia → PRUEBA_VIDA_FALLIDA
- identidad/identidad.service.spec.ts › IdentidadService.verificar A-01: confianza exactamente 85 aprueba
- identidad/identidad.service.spec.ts › IdentidadService.verificar CA-3 / A-01: carnet de otra persona → 422 ROSTRO_NO_COINCIDE; no se sube ni se indexa
- ataques/a-04-revinculacion.e2e-spec.ts › A-04 · Revinculación de dispositivo y suplantación (e2e) CA-4 / A-01: atacante con contraseña intenta revincular con su propio rostro o foto ajena -> rechazado y el dueño sigue vinculado
- identidad/verificacion.e2e-spec.ts › HU-08 · Verificación de identidad (e2e) CA-2 · A-01 spoofing: foto impresa, pantalla o máscara sin vivacidad → 422 PRUEBA_VIDA_FALLIDA; sigue no verificada, sin carnet en S3 ni rostro indexado
- identidad/verificacion.e2e-spec.ts › HU-08 · Verificación de identidad (e2e) CA-2 · A-01 spoofing: foto impresa, pantalla o máscara una sesión inventada o ajena al motor tampoco sirve
- identidad/verificacion.e2e-spec.ts › HU-08 · Verificación de identidad (e2e) CA-3 · A-01 carnet con el rostro de otra persona similitud < 90 → 422 ROSTRO_NO_COINCIDE; cuenta no verificada, nada guardado

### A-02 · Varias cuentas por persona

- identidad/documento.spec.ts › documento el hash es el HMAC-SHA256 del carnet normalizado con el secreto del servidor (A-02)
- identidad/identidad.service.spec.ts › IdentidadService.verificar CA-4 / A-02: documento de otra cuenta → 409 antes de gastar llamadas biométricas; cuenta intento
- identidad/identidad.service.spec.ts › IdentidadService.verificar CA-5 / A-02: rostro de otra cuenta → 409 ROSTRO_DUPLICADO; no se sube ni se indexa
- identidad/identidad.service.spec.ts › IdentidadService.verificar A-02 en paralelo: si tras indexar aparece el mismo rostro de otra cuenta → 409 ROSTRO_DUPLICADO, se deshace todo y cuenta intento
- identidad/identidad.service.spec.ts › IdentidadService.verificar A-02 en paralelo: si el UNIQUE del documento salta al guardar → 409, se deshace todo y cuenta intento
- ataques/a-04-revinculacion.e2e-spec.ts › A-04 · Revinculación de dispositivo y suplantación (e2e) CA-5 / A-02: atacante intenta usar el rostro de otra cuenta verificada para apropiarse de la cuenta -> rechazado
- billetera/creacion.e2e-spec.ts › HU-12 · creación de billetera (e2e) CA-2 y A-02: una sola billetera por usuario POST repetido responde 200 con la misma billetera
- billetera/creacion.e2e-spec.ts › HU-12 · creación de billetera (e2e) CA-2 y A-02: una sola billetera por usuario A-02: peticiones simultáneas dejan una sola billetera
- billetera/creacion.e2e-spec.ts › HU-12 · creación de billetera (e2e) CA-2 y A-02: una sola billetera por usuario A-02: la BD rechaza una segunda billetera y una dirección repetida
- billetera/creacion.e2e-spec.ts › HU-12 · creación de billetera (e2e) CA-2 y A-02: una sola billetera por usuario el rol de la API no puede modificar ni borrar billeteras
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) CA-6: una cuenta, un dispositivo (A-02) quien ya tiene dispositivo no puede pedir otro desafío
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) CA-6: una cuenta, un dispositivo (A-02) tampoco vinculando con un desafío emitido antes de tener dispositivo
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) CA-6: una cuenta, un dispositivo (A-02) dos vinculaciones simultáneas: una gana, la otra recibe DISPOSITIVO_YA_VINCULADO y no queda nada a medias
- identidad/verificacion.e2e-spec.ts › HU-08 · Verificación de identidad (e2e) CA-4 · A-02 documento duplicado otro usuario con el mismo carnet (aunque lo escriba distinto) → 409 antes de gastar llamadas biométricas
- identidad/verificacion.e2e-spec.ts › HU-08 · Verificación de identidad (e2e) CA-4 · A-02 documento duplicado un intento fallido no reserva el carnet: su dueño real puede verificarse después
- identidad/verificacion.e2e-spec.ts › HU-08 · Verificación de identidad (e2e) CA-4 · A-02 documento duplicado en paralelo: dos cuentas envían el mismo carnet a la vez → una sola queda verificada, la otra recibe 409 y no deja nada
- identidad/verificacion.e2e-spec.ts › HU-08 · Verificación de identidad (e2e) CA-4 · A-02 documento duplicado en paralelo: el mismo usuario envía dos veces → una verificación y un 400; sin archivos ni rostros huérfanos
- identidad/verificacion.e2e-spec.ts › HU-08 · Verificación de identidad (e2e) CA-5 · A-02 rostro duplicado el mismo rostro con otro carnet y otro documento → 409 ROSTRO_DUPLICADO; nada guardado
- identidad/verificacion.e2e-spec.ts › HU-08 · Verificación de identidad (e2e) CA-5 · A-02 rostro duplicado en paralelo: la misma cara con dos documentos a la vez nunca deja las dos cuentas verificadas

### A-03 · Emulador, root o app modificada

- comun/play-integrity.service.spec.ts › crearPlayIntegrity A-03: MODO_EMULADOR_DEV=true con NODE_ENV=production hace fallar el arranque
- comun/play-integrity.service.spec.ts › PlayIntegritySimulado A-03: emulador, root o cualquier otro valor se rechaza como no íntegro
- comun/play-integrity.service.spec.ts › PlayIntegrityReal A-03: rechaza por dispositivo_no_integro
- comun/play-integrity.service.spec.ts › PlayIntegrityReal A-03: rechaza por dispositivo_no_integro
- comun/play-integrity.service.spec.ts › PlayIntegrityReal A-03: rechaza por app_no_reconocida
- comun/play-integrity.service.spec.ts › PlayIntegrityReal A-03: rechaza por paquete
- comun/play-integrity.service.spec.ts › PlayIntegrityReal A-03: rechaza por paquete
- comun/play-integrity.service.spec.ts › PlayIntegrityReal A-03: rechaza por nonce
- comun/play-integrity.service.spec.ts › PlayIntegrityReal A-03: rechaza por token_vencido
- dispositivos/dispositivos.service.spec.ts › DispositivosService.vincular CA-2 / A-03: dispositivo no íntegro, 422 sin guardar nada y con motivo solo en auditoría
- ataques/a-03-abordaje.e2e-spec.ts › A-03 · integridad en el abordaje (e2e) pasajero con simulado:root: «Este teléfono no puede verificar viajes», sin detalle, y nada cambia
- ataques/a-03-abordaje.e2e-spec.ts › A-03 · integridad en el abordaje (e2e) pasajero con simulado:emulador: «Este teléfono no puede verificar viajes», sin detalle, y nada cambia
- ataques/a-03-abordaje.e2e-spec.ts › A-03 · integridad en el abordaje (e2e) Play Integrity caído: 503 temporal, la reserva intacta, y con un código nuevo se puede reintentar
- ataques/a-03-abordaje.e2e-spec.ts › A-03 · integridad en el abordaje (e2e) conductor desde un teléfono no íntegro: no registra la llave de trayecto
- ataques/a-03-revinculacion.e2e-spec.ts › A-03 · Revinculación desde emulador o app modificada (e2e) CA-6 / A-03: intento de revinculación desde emulador es rechazado con 422 DISPOSITIVO_NO_INTEGRO
- ataques/a-03-revinculacion.e2e-spec.ts › A-03 · Revinculación desde emulador o app modificada (e2e) CA-6 / A-03: intento de revinculación desde root es rechazado con 422 DISPOSITIVO_NO_INTEGRO
- ataques/a-03-revinculacion.e2e-spec.ts › A-03 · Revinculación desde emulador o app modificada (e2e) CA-6 / A-03: intento de revinculación desde app modificada es rechazado con 422 DISPOSITIVO_NO_INTEGRO
- ataques/a-03-revinculacion.e2e-spec.ts › A-03 · Revinculación desde emulador o app modificada (e2e) CA-11: si Play Integrity no responde (503), nada cambia y el dispositivo sigue activo
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) CA-2 / A-03: dispositivo no íntegro simulado:emulador se rechaza con 422 DISPOSITIVO_NO_INTEGRO y no guarda nada
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) CA-2 / A-03: dispositivo no íntegro simulado:root se rechaza con 422 DISPOSITIVO_NO_INTEGRO y no guarda nada
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) CA-2 / A-03: dispositivo no íntegro token-falso se rechaza con 422 DISPOSITIVO_NO_INTEGRO y no guarda nada
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) CA-2 / A-03: dispositivo no íntegro la auditoría guarda el motivo; la respuesta no
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) CA-2 / A-03: dispositivo no íntegro si Google Play no responde: 503 SERVICIO_NO_DISPONIBLE y nada guardado
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) CA-2 / A-03: dispositivo no íntegro una llave que no es EC P-256 pública se rechaza con 400 LLAVE_INVALIDA
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) CA-2 / A-03: dispositivo no íntegro campos faltantes: 400 VALIDACION_FALLIDA
- __tests__/keystore.test.ts › Token de integridad (Play Integrity real queda fuera) producción aunque la bandera esté puesta (A-03): falla
- Manual (teléfono): Vincular y abordar con la integridad real de Google en un teléfono físico — pendiente

### A-04 · Teléfono robado o prestado

- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde A-04: firma hecha con la llave de otro teléfono
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde cuerpo alterado
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde ruta alterada
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde query alterada
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde método alterado
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde firma con basura en lugar de ECDSA
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde firma en formato P1363 (r||s): solo se acepta DER
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde dispositivo inactivo o inexistente para la cuenta
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde X-Dispositivo-Id de otra cuenta (no es el dispositivo activo de este usuario)
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde llave guardada ilegible: rechaza sin romper
- ataques/a-04-revinculacion.e2e-spec.ts › A-04 · Revinculación de dispositivo y suplantación (e2e) CA-3 / A-04: peticion firmada con la llave del telefono anterior es rechazada con 401 tras revincular
- ataques/a-04-revinculacion.e2e-spec.ts › A-04 · Revinculación de dispositivo y suplantación (e2e) CA-4 / A-01: atacante con contraseña intenta revincular con su propio rostro o foto ajena -> rechazado y el dueño sigue vinculado
- ataques/a-04-revinculacion.e2e-spec.ts › A-04 · Revinculación de dispositivo y suplantación (e2e) CA-5 / A-02: atacante intenta usar el rostro de otra cuenta verificada para apropiarse de la cuenta -> rechazado
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) billetera.crear A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) recarga.confirmar A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) viaje.publicar A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.crear A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) trayecto.llave A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.abordaje A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.bajada A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.cancelar A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) viaje.cancelar A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado el teléfono de otra persona con mi sesión (A-04): 401
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) CA-4: bien firmada por el dispositivo de la cuenta responde 200 y marca el último uso
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) CA-3 / A-08: sin encabezados de firma (curl, Postman) responde 401
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) sin sesión responde 401 NO_AUTENTICADO antes de mirar la firma
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-08: cuerpo alterado en tránsito
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-08: ruta o query alterada
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-04: firma hecha con la llave de otro teléfono
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-04: usar el dispositivo de Ana desde la sesión de Beto no sirve
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-05: reenviar la misma petición (mismo nonce) se rechaza
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-05: petición firmada hace más de 30 s se rechaza
- __tests__/keystore.test.ts › Keystore con módulo nativo cancelar la huella no firma y da BIOMETRIA_CANCELADA (CA-7, A-04)
- Manual (teléfono): Huella ajena en una acción sensible — pendiente

### A-05 · Repetir un handshake capturado

- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-5 / A-05: replay timestamp caducado (más de 30 s) y a futuro: PETICION_EXPIRADA
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-5 / A-05: replay un timestamp dentro de la ventana (-29 s) todavía pasa
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-5 / A-05: replay la misma petición reenviada (mismo nonce) es PETICION_EXPIRADA
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-5 / A-05: replay una petición con firma inválida no "quema" el nonce de la legítima
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-5 / A-05: replay nonce distinto con el mismo contenido sí pasa
- comun/firma-trayecto.guard.spec.ts › FirmaTrayectoGuard (HU-22, D-22) A-05: la misma petición dos veces: la segunda es PETICION_EXPIRADA
- dispositivos/dispositivos.service.spec.ts › DispositivosService.vincular A-05: el desafío es de un solo uso
- ataques/a-05-repeticion-handshake.e2e-spec.ts › A-05 · repetir un código de abordaje (e2e) CA-3: un código ya usado por otro pasajero se rechaza con «Ese código ya no sirve»
- ataques/a-05-repeticion-handshake.e2e-spec.ts › A-05 · repetir un código de abordaje (e2e) CA-3: un código gastado en un intento rechazado tampoco vuelve a servir
- ataques/a-05-repeticion-handshake.e2e-spec.ts › A-05 · repetir un código de abordaje (e2e) CA-4: un código emitido hace más de 30 s se rechaza
- ataques/a-05-repeticion-handshake.e2e-spec.ts › A-05 · repetir un código de abordaje (e2e) dos escaneos simultáneos del mismo código: solo uno gana
- ataques/a-05-repeticion-handshake.e2e-spec.ts › A-05 · repetir un código de abordaje (e2e) un código inventado se rechaza igual
- ataques/a-05-repeticion-handshake.e2e-spec.ts › A-05 · repetir un código de abordaje (e2e) HU-23: el código de bajada tampoco sirve dos veces
- ataques/a-05-repeticion-handshake.e2e-spec.ts › A-05 · repetir un código de abordaje (e2e) HU-23: un código de abordaje no sirve para bajar, ni uno de bajada para abordar
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) CA-4: bien firmada por el dispositivo de la cuenta responde 200 y marca el último uso
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) CA-3 / A-08: sin encabezados de firma (curl, Postman) responde 401
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) sin sesión responde 401 NO_AUTENTICADO antes de mirar la firma
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-08: cuerpo alterado en tránsito
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-08: ruta o query alterada
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-04: firma hecha con la llave de otro teléfono
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-04: usar el dispositivo de Ana desde la sesión de Beto no sirve
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-05: reenviar la misma petición (mismo nonce) se rechaza
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-05: petición firmada hace más de 30 s se rechaza
- __tests__/seguimiento.test.tsx › HU-23 · bajada del pasajero (CA-3, CA-4, CA-11) un código de abordaje o ya gastado se rechaza y se puede volver a escanear (A-05)

### A-06 · Enviar foto del QR a alguien lejos

- ataques/a-06-qr-lejos.e2e-spec.ts › A-06 · código enviado a alguien lejos (e2e) a ~60 m: se rechaza con la distancia y el código queda consumido
- ataques/a-06-qr-lejos.e2e-spec.ts › A-06 · código enviado a alguien lejos (e2e) en el límite: a 50 m pasa, a 51 m no
- ataques/a-06-qr-lejos.e2e-spec.ts › A-06 · código enviado a alguien lejos (e2e) HU-23: la bajada a ~60 m se rechaza, el código queda gastado y la reserva sigue abordada
- ataques/a-07-trayecto.e2e-spec.ts › A-07 · trayecto falso (e2e) el pasajero que envía la traza del conductor pero nunca estuvo cerca al bajar no baja (A-06 en la bajada)

### A-07 · Falsificar GPS

- fraude/patrones.spec.ts › P-3 verificaciones fallidas repetidas (A-07) 2 no es anomalía; 3 sí, con su cantidad
- fraude/patrones.spec.ts › P-3 verificaciones fallidas repetidas (A-07) borde de 7 días: una de hace exactamente 7 días ya no cuenta
- presencia/trayecto.spec.ts › evaluarTrayecto (HU-23 RN-2 a RN-6) CA-5 / A-07: salto imposible (RN-4) 150 km/h entre dos puntos seguidos todavía vale
- presencia/trayecto.spec.ts › evaluarTrayecto (HU-23 RN-2 a RN-6) CA-5 / A-07: salto imposible (RN-4) 151 km/h en la traza del pasajero → salto_imposible
- presencia/trayecto.spec.ts › evaluarTrayecto (HU-23 RN-2 a RN-6) CA-5 / A-07: salto imposible (RN-4) un solo salto en la traza del conductor basta
- presencia/trayecto.spec.ts › evaluarTrayecto (HU-23 RN-2 a RN-6) CA-6 / A-07: trayectos separados (RN-3) 80 % de los pares a ≤ 100 m (16 de 20) → verificada
- presencia/trayecto.spec.ts › evaluarTrayecto (HU-23 RN-2 a RN-6) CA-6 / A-07: trayectos separados (RN-3) menos del 80 % (15 de 20) → trayectos_separados
- presencia/trayecto.spec.ts › evaluarTrayecto (HU-23 RN-2 a RN-6) CA-6 / A-07: trayectos separados (RN-3) 79,5 % (31 de 39) → trayectos_separados; 80 % exacto con 15 puntos (12) → verificada
- presencia/trayecto.spec.ts › evaluarTrayecto (HU-23 RN-2 a RN-6) CA-6 / A-07: trayectos separados (RN-3) un punto del pasajero sin pareja cuenta como no coincidente
- presencia/trayecto.spec.ts › evaluarTrayecto (HU-23 RN-2 a RN-6) CA-7 / A-07: ubicación simulada (RN-6) un solo punto simulado del pasajero invalida
- presencia/trayecto.spec.ts › evaluarTrayecto (HU-23 RN-2 a RN-6) CA-7 / A-07: ubicación simulada (RN-6) uno del conductor también, y tiene prioridad sobre el salto
- ataques/a-07-abordaje.e2e-spec.ts › A-07 · GPS falso o débil en el abordaje (e2e) posición del pasajero simulada (CA-6): se rechaza y la reserva sigue confirmada
- ataques/a-07-abordaje.e2e-spec.ts › A-07 · GPS falso o débil en el abordaje (e2e) posición del pasajero con precisión de 80 m (CA-12): se rechaza y la reserva sigue confirmada
- ataques/a-07-abordaje.e2e-spec.ts › A-07 · GPS falso o débil en el abordaje (e2e) posición del pasajero tomada hace 40 s (CA-12): se rechaza y la reserva sigue confirmada
- ataques/a-07-abordaje.e2e-spec.ts › A-07 · GPS falso o débil en el abordaje (e2e) posición del conductor simulada: no se emite el código
- ataques/a-07-abordaje.e2e-spec.ts › A-07 · GPS falso o débil en el abordaje (e2e) posición del conductor con precisión de 80 m: no se emite el código
- ataques/a-07-abordaje.e2e-spec.ts › A-07 · GPS falso o débil en el abordaje (e2e) posición del conductor tomada hace 40 s: no se emite el código
- ataques/a-07-trayecto.e2e-spec.ts › A-07 · trayecto falso (e2e) CA-5: un salto de más de 150 km/h → verificación fallida y el viaje no se verifica
- ataques/a-07-trayecto.e2e-spec.ts › A-07 · trayecto falso (e2e) CA-6: trayectorias que se separan (75 % a ≤ 100 m) → trayectos_separados
- ataques/a-07-trayecto.e2e-spec.ts › A-07 · trayecto falso (e2e) CA-7: un solo punto simulado del conductor invalida la verificación
- ataques/a-07-trayecto.e2e-spec.ts › A-07 · trayecto falso (e2e) el pasajero que envía la traza del conductor pero nunca estuvo cerca al bajar no baja (A-06 en la bajada)
- ataques/a-07-verificaciones-repetidas.e2e-spec.ts › A-07 · verificaciones fallidas repetidas (e2e) A-07: con el bloqueo, publicar, reservar y recargar se rechazan con la fecha de fin
- ataques/a-07-verificaciones-repetidas.e2e-spec.ts › A-07 · verificaciones fallidas repetidas (e2e) A-07: lo ya reservado sigue disponible: consultar saldo y reserva, y cancelar
- ataques/a-07-verificaciones-repetidas.e2e-spec.ts › A-07 · verificaciones fallidas repetidas (e2e) A-07: el conductor con bloqueo de cuenta deja de aparecer para reservar (como una cuenta suspendida)
- ataques/a-07-verificaciones-repetidas.e2e-spec.ts › A-07 · verificaciones fallidas repetidas (e2e) A-08: ninguna ruta de la API toca los bloqueos y el rol de la API no puede cambiarlos ni borrarlos
- Manual (teléfono): App de ubicación falsa en el encuentro — pendiente

### A-08 · Llamar a la API sin la app

- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-3 / A-08: sin firma o con encabezados defectuosos sin x-dispositivo-id responde 401 FIRMA_DISPOSITIVO_INVALIDA
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-3 / A-08: sin firma o con encabezados defectuosos sin x-timestamp responde 401 FIRMA_DISPOSITIVO_INVALIDA
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-3 / A-08: sin firma o con encabezados defectuosos sin x-nonce responde 401 FIRMA_DISPOSITIVO_INVALIDA
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-3 / A-08: sin firma o con encabezados defectuosos sin x-firma responde 401 FIRMA_DISPOSITIVO_INVALIDA
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-3 / A-08: sin firma o con encabezados defectuosos curl sin ningún encabezado de firma
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-3 / A-08: sin firma o con encabezados defectuosos id que no es UUID
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-3 / A-08: sin firma o con encabezados defectuosos timestamp no numérico
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-3 / A-08: sin firma o con encabezados defectuosos timestamp con signo
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-3 / A-08: sin firma o con encabezados defectuosos nonce corto
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-3 / A-08: sin firma o con encabezados defectuosos nonce con salto de línea
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-3 / A-08: sin firma o con encabezados defectuosos firma que no es Base64
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-3 / A-08: sin firma o con encabezados defectuosos sin sesión (no pasó por el JwtGuard) rechaza
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-3 / A-08: sin firma o con encabezados defectuosos un cuerpo que no llegó crudo (multipart) no se firma "vacío": se rechaza
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde A-04: firma hecha con la llave de otro teléfono
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde cuerpo alterado
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde ruta alterada
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde query alterada
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde método alterado
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde firma con basura en lugar de ECDSA
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde firma en formato P1363 (r||s): solo se acepta DER
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde dispositivo inactivo o inexistente para la cuenta
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde X-Dispositivo-Id de otra cuenta (no es el dispositivo activo de este usuario)
- comun/firma-dispositivo.guard.spec.ts › FirmaDispositivoGuard CA-4 / A-04 / A-08: firma que no corresponde llave guardada ilegible: rechaza sin romper
- comun/firma-trayecto.guard.spec.ts › FirmaTrayectoGuard (HU-22, D-22) A-08: firmada con otra llave: 401 con el mismo error
- dispositivos/revinculacion.service.spec.ts › RevinculacionService · revincular A-08: un teléfono no íntegro se rechaza antes de la identidad y no suma intento
- ataques/a-07-verificaciones-repetidas.e2e-spec.ts › A-07 · verificaciones fallidas repetidas (e2e) A-08: ninguna ruta de la API toca los bloqueos y el rol de la API no puede cambiarlos ni borrarlos
- ataques/a-08-abordaje.e2e-spec.ts › A-08 · firmas del abordaje (e2e) código del conductor cuerpo alterado después de firmar (otra posición): 401
- ataques/a-08-abordaje.e2e-spec.ts › A-08 · firmas del abordaje (e2e) código del conductor firmado con una llave que no es la registrada: 401
- ataques/a-08-abordaje.e2e-spec.ts › A-08 · firmas del abordaje (e2e) código del conductor la llave de trayecto de otro conductor, aun firmando bien, no sirve con otra sesión: 401
- ataques/a-08-abordaje.e2e-spec.ts › A-08 · firmas del abordaje (e2e) código del conductor la llave de otro viaje del mismo conductor no emite códigos de este: 401
- ataques/a-08-abordaje.e2e-spec.ts › A-08 · firmas del abordaje (e2e) código del conductor la llave de trayecto de un pasajero no emite códigos: 401
- ataques/a-08-abordaje.e2e-spec.ts › A-08 · firmas del abordaje (e2e) código del conductor HU-10 CA-9: si el teléfono se desactiva (revinculación), su llave de trayecto deja de valer
- ataques/a-08-abordaje.e2e-spec.ts › A-08 · firmas del abordaje (e2e) código del conductor sin cabeceras de firma: 401
- ataques/a-08-abordaje.e2e-spec.ts › A-08 · firmas del abordaje (e2e) código del conductor registrar la llave sin la firma biométrica del teléfono: 401
- ataques/a-08-abordaje.e2e-spec.ts › A-08 · firmas del abordaje (e2e) escaneo del pasajero sin la firma biométrica válida del pasajero (otra llave): 401 y el código no se gasta
- ataques/a-08-abordaje.e2e-spec.ts › A-08 · firmas del abordaje (e2e) escaneo del pasajero el estado no se fija desde el cliente: un campo `estado` da 400
- ataques/a-08-abordaje.e2e-spec.ts › A-08 · firmas del abordaje (e2e) escaneo del pasajero una llave de trayecto que no es EC P-256: 400 sin gastar el código
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) billetera.crear sin firma (un comando de voz o un script con el token): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) billetera.crear firmada por el teléfono de otra persona: 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) billetera.crear A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) billetera.crear CA-3: con la firma del dueño se ejecuta y se audita; repetir esa firma da 401
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) recarga.confirmar sin firma (un comando de voz o un script con el token): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) recarga.confirmar firmada por el teléfono de otra persona: 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) recarga.confirmar A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) recarga.confirmar CA-3: con la firma del dueño se ejecuta y se audita; repetir esa firma da 401
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) viaje.publicar sin firma (un comando de voz o un script con el token): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) viaje.publicar firmada por el teléfono de otra persona: 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) viaje.publicar A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) viaje.publicar CA-3: con la firma del dueño se ejecuta y se audita; repetir esa firma da 401
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.crear sin firma (un comando de voz o un script con el token): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.crear firmada por el teléfono de otra persona: 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.crear A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.crear CA-3: con la firma del dueño se ejecuta y se audita; repetir esa firma da 401
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) trayecto.llave sin firma (un comando de voz o un script con el token): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) trayecto.llave firmada por el teléfono de otra persona: 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) trayecto.llave A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) trayecto.llave CA-3: con la firma del dueño se ejecuta y se audita; repetir esa firma da 401
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.abordaje sin firma (un comando de voz o un script con el token): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.abordaje firmada por el teléfono de otra persona: 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.abordaje A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.abordaje CA-3: con la firma del dueño se ejecuta y se audita; repetir esa firma da 401
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.bajada sin firma (un comando de voz o un script con el token): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.bajada firmada por el teléfono de otra persona: 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.bajada A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.bajada CA-3: con la firma del dueño se ejecuta y se audita; repetir esa firma da 401
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.cancelar sin firma (un comando de voz o un script con el token): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.cancelar firmada por el teléfono de otra persona: 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.cancelar A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) reserva.cancelar CA-3: con la firma del dueño se ejecuta y se audita; repetir esa firma da 401
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) viaje.cancelar sin firma (un comando de voz o un script con el token): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) viaje.cancelar firmada por el teléfono de otra persona: 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) viaje.cancelar A-04: otra llave con el id del teléfono del dueño (no la de su huella): 401 y nada cambia
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) viaje.cancelar CA-3: con la firma del dueño se ejecuta y se audita; repetir esa firma da 401
- ataques/a-08-acciones-sensibles.e2e-spec.ts › A-08 · acciones sensibles sin la firma del teléfono del dueño (e2e) cada acción sensible registrada tiene aquí su prueba de ataque
- ataques/a-08-cancelacion.e2e-spec.ts › Ataque A-08 · Cancelación con datos alterados por el cliente (e2e) A-08 · el cliente no puede forzar 100 % cuando la política del servidor dicta 50 %
- ataques/a-08-cancelacion.e2e-spec.ts › Ataque A-08 · Cancelación con datos alterados por el cliente (e2e) A-08 · el cliente no puede inyectar campos no permitidos (monto, estado) en el cuerpo
- ataques/a-08-distancia-conductor.e2e-spec.ts › A-08 · distancia del conductor sin sesión válida o sin membresía (e2e) sin cabecera Authorization responde 401
- ataques/a-08-distancia-conductor.e2e-spec.ts › A-08 · distancia del conductor sin sesión válida o sin membresía (e2e) con token inválido responde 401
- ataques/a-08-distancia-conductor.e2e-spec.ts › A-08 · distancia del conductor sin sesión válida o sin membresía (e2e) persona sin membresía aprobada en la organización responde 403
- ataques/a-08-distancia-conductor.e2e-spec.ts › A-08 · distancia del conductor sin sesión válida o sin membresía (e2e) con sesión válida solo responde distancia redondeada y nunca coordenadas (RN-6)
- ataques/a-08-posiciones.e2e-spec.ts › A-08 · posiciones por la API sin la app (e2e) sin firma: 401 y nada guardado
- ataques/a-08-posiciones.e2e-spec.ts › A-08 · posiciones por la API sin la app (e2e) firma de otro cuerpo (posiciones cambiadas después de firmar): 401
- ataques/a-08-posiciones.e2e-spec.ts › A-08 · posiciones por la API sin la app (e2e) una llave inventada con un id real: 401
- ataques/a-08-posiciones.e2e-spec.ts › A-08 · posiciones por la API sin la app (e2e) la llave del pasajero no envía la traza del conductor, ni la del conductor la del pasajero
- ataques/a-08-posiciones.e2e-spec.ts › A-08 · posiciones por la API sin la app (e2e) con la llave de su reserva no envía por la reserva de otro pasajero
- ataques/a-08-posiciones.e2e-spec.ts › A-08 · posiciones por la API sin la app (e2e) una persona ajena con la llave robada de un pasajero: 401 (la llave es de la cuenta)
- ataques/a-08-posiciones.e2e-spec.ts › A-08 · posiciones por la API sin la app (e2e) una llave de trayecto revocada (el pasajero volvió a escanear) ya no firma posiciones
- ataques/a-08-posiciones.e2e-spec.ts › A-08 · posiciones por la API sin la app (e2e) el estado de la reserva lo fija el servidor: un `estado` en el cuerpo no se acepta
- ataques/a-08-publicar-viaje.e2e-spec.ts › A-08 · publicar un viaje sin la firma del teléfono (e2e) sin firma: 401 FIRMA_DISPOSITIVO_INVALIDA
- ataques/a-08-publicar-viaje.e2e-spec.ts › A-08 · publicar un viaje sin la firma del teléfono (e2e) sin sesión: 401, aunque la firma sea válida
- ataques/a-08-publicar-viaje.e2e-spec.ts › A-08 · publicar un viaje sin la firma del teléfono (e2e) con la sesión vencida la firma no se gasta: vale una vez con la sesión renovada
- ataques/a-08-publicar-viaje.e2e-spec.ts › A-08 · publicar un viaje sin la firma del teléfono (e2e) otro cuerpo que el firmado (subir el precio o cambiar la hora): 401
- ataques/a-08-publicar-viaje.e2e-spec.ts › A-08 · publicar un viaje sin la firma del teléfono (e2e) firmado con la llave de otra persona, con el id de su dispositivo: 401
- ataques/a-08-publicar-viaje.e2e-spec.ts › A-08 · publicar un viaje sin la firma del teléfono (e2e) dispositivo de otra persona: 401
- ataques/a-08-publicar-viaje.e2e-spec.ts › A-08 · publicar un viaje sin la firma del teléfono (e2e) dispositivo desactivado: 401
- ataques/a-08-publicar-viaje.e2e-spec.ts › A-08 · publicar un viaje sin la firma del teléfono (e2e) firma de otra ruta: 401
- ataques/a-08-publicar-viaje.e2e-spec.ts › A-08 · publicar un viaje sin la firma del teléfono (e2e) repetir una publicación firmada capturada no crea otro viaje
- ataques/a-08-publicar-viaje.e2e-spec.ts › A-08 · publicar un viaje sin la firma del teléfono (e2e) las lecturas no gastan firma, pero sí exigen sesión
- ataques/a-08-recarga.e2e-spec.ts › A-08 y A-11 · confirmar una recarga sin firma de dispositivo (e2e) sin firma: 401 FIRMA_DISPOSITIVO_INVALIDA, como un comando de voz sin interacción física
- ataques/a-08-recarga.e2e-spec.ts › A-08 y A-11 · confirmar una recarga sin firma de dispositivo (e2e) sin sesión: 401
- ataques/a-08-recarga.e2e-spec.ts › A-08 y A-11 · confirmar una recarga sin firma de dispositivo (e2e) firma de otra llave con el id del dispositivo vinculado: 401
- ataques/a-08-recarga.e2e-spec.ts › A-08 y A-11 · confirmar una recarga sin firma de dispositivo (e2e) dispositivo de otra persona: 401
- ataques/a-08-recarga.e2e-spec.ts › A-08 y A-11 · confirmar una recarga sin firma de dispositivo (e2e) firma de otra ruta: 401
- ataques/a-08-recarga.e2e-spec.ts › A-08 y A-11 · confirmar una recarga sin firma de dispositivo (e2e) firma basura: 401
- ataques/a-08-recarga.e2e-spec.ts › A-08 y A-11 · confirmar una recarga sin firma de dispositivo (e2e) repetir una petición firmada capturada no pasa del nonce
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado sin firma: 401 FIRMA_DISPOSITIVO_INVALIDA y no reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado sin sesión, aunque la firma sea válida: 401
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado sin teléfono vinculado: 401
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado el teléfono de otra persona con mi sesión (A-04): 401
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado la llave de otra persona con el id de mi teléfono: 401
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado una firma de otro cuerpo no sirve: no se puede cambiar la clave después de firmar
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado una firma de otro viaje no sirve: la ruta va dentro del mensaje firmado
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado la misma petición firmada repetida palabra por palabra: 401 PETICION_EXPIRADA y una sola reserva
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado un rechazo por otro motivo no gasta la firma: con la cuenta suspendida, 403 antes que 401
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor un monto en el cuerpo se rechaza y no se reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor un precio en el cuerpo se rechaza y no se reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor un conductor en el cuerpo se rechaza y no se reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor un pasajero en el cuerpo se rechaza y no se reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor un estado en el cuerpo se rechaza y no se reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor un organización en el cuerpo se rechaza y no se reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor un viaje en el cuerpo se rechaza y no se reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor la reserva cobra el precio publicado del viaje y paga a su conductor, no a quien diga el cliente
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) A-11 · la voz no es un camino no existe ninguna ruta de reserva distinta de la firmada
- ataques/a-08-revinculacion.e2e-spec.ts › A-08 · revincular armando las peticiones sin la app (e2e) una prueba de vida de otro desafío (repetida o inventada) no vale: 422 PRUEBA_VIDA_FALLIDA y cuenta como intento
- ataques/a-08-revinculacion.e2e-spec.ts › A-08 · revincular armando las peticiones sin la app (e2e) sin prueba de vida ni token de integridad se rechaza y el teléfono del dueño sigue
- billetera/creacion.e2e-spec.ts › HU-12 · creación de billetera (e2e) A-08: sesión y firma de dispositivo sin sesión responde 401
- billetera/creacion.e2e-spec.ts › HU-12 · creación de billetera (e2e) A-08: sesión y firma de dispositivo verificado pero sin firma responde 401 y no crea nada
- billetera/creacion.e2e-spec.ts › HU-12 · creación de billetera (e2e) A-08: sesión y firma de dispositivo la firma con el dispositivo de otra persona responde 401
- billetera/creacion.e2e-spec.ts › HU-12 · creación de billetera (e2e) A-08: sesión y firma de dispositivo repetir una petición firmada (mismo nonce) responde 401
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) CA-4: bien firmada por el dispositivo de la cuenta responde 200 y marca el último uso
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) CA-3 / A-08: sin encabezados de firma (curl, Postman) responde 401
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) sin sesión responde 401 NO_AUTENTICADO antes de mirar la firma
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-08: cuerpo alterado en tránsito
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-08: ruta o query alterada
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-04: firma hecha con la llave de otro teléfono
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-04: usar el dispositivo de Ana desde la sesión de Beto no sirve
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-05: reenviar la misma petición (mismo nonce) se rechaza
- dispositivos/vinculacion.e2e-spec.ts › HU-09 · vinculación de dispositivo y firma de peticiones (e2e) firma de peticiones sensibles de punta a punta (A-04, A-05, A-08) A-05: petición firmada hace más de 30 s se rechaza
- __tests__/billetera.test.tsx › Billetera · CA-5: saldo, dirección y enlace la lectura de la dirección lleva la sesión y la firma del dispositivo (A-08)

### A-09 · Liberar pago sin viaje o cobrar dos veces

- ⚠ 2 prueba(s) omitida(s): no cuentan.
- blockchain/blockchain.service.spec.ts › crearCadena A-09: rechaza la misma llave para relayer y verificador
- blockchain/trabajos-onchain.service.spec.ts › TrabajosOnchainService · liberar_reserva (HU-24) CA-3 / A-09: una reserva confirmada nunca se libera: sin cadena, movimiento fallido y pago.rechazado
- blockchain/trabajos-onchain.service.spec.ts › TrabajosOnchainService · liberar_reserva (HU-24) CA-3 / A-09: una reserva abordada nunca se libera: sin cadena, movimiento fallido y pago.rechazado
- blockchain/trabajos-onchain.service.spec.ts › TrabajosOnchainService · liberar_reserva (HU-24) CA-3 / A-09: una reserva verificacion_fallida nunca se libera: sin cadena, movimiento fallido y pago.rechazado
- blockchain/trabajos-onchain.service.spec.ts › TrabajosOnchainService · liberar_reserva (HU-24) CA-3 / A-09: una reserva pendiente nunca se libera: sin cadena, movimiento fallido y pago.rechazado
- blockchain/trabajos-onchain.service.spec.ts › TrabajosOnchainService · liberar_reserva (HU-24) A-09: escrow reembolsada: no paga, falla permanente con alerta
- blockchain/trabajos-onchain.service.spec.ts › TrabajosOnchainService · liberar_reserva (HU-24) A-09: escrow nunca bloqueada: no paga, falla permanente con alerta
- blockchain/trabajos-onchain.service.spec.ts › TrabajosOnchainService · liberar_reserva (HU-24) A-09: escrow para otro conductor: no paga, falla permanente con alerta
- blockchain/trabajos-onchain.service.spec.ts › TrabajosOnchainService · liberar_reserva (HU-24) A-09: escrow por otro monto: no paga, falla permanente con alerta
- blockchain/trabajos-onchain.service.spec.ts › operacion reembolsar_reserva (HU-20, A-09, CA-17) éxito 100 %: reembolsa en cadena, confirma movimiento y registra auditoría
- blockchain/trabajos-onchain.service.spec.ts › operacion reembolsar_reserva (HU-20, A-09, CA-17) éxito 50/50: si existe compensación para el conductor, también la confirma con el mismo hash
- blockchain/trabajos-onchain.service.spec.ts › operacion reembolsar_reserva (HU-20, A-09, CA-17) idempotencia: si el escrow ya dice reembolsada recupera el hash sin llamar a reembolsarReserva
- blockchain/trabajos-onchain.service.spec.ts › operacion reembolsar_reserva (HU-20, A-09, CA-17) A-09: reserva en estado confirmada no se reembolsa y se rechaza
- blockchain/trabajos-onchain.service.spec.ts › operacion reembolsar_reserva (HU-20, A-09, CA-17) A-09: reserva en estado abordada no se reembolsa y se rechaza
- blockchain/trabajos-onchain.service.spec.ts › operacion reembolsar_reserva (HU-20, A-09, CA-17) A-09: reserva en estado verificada no se reembolsa y se rechaza
- blockchain/trabajos-onchain.service.spec.ts › operacion reembolsar_reserva (HU-20, A-09, CA-17) A-09: reserva en estado pagada no se reembolsa y se rechaza
- blockchain/trabajos-onchain.service.spec.ts › operacion reembolsar_reserva (HU-20, A-09, CA-17) A-09: escrow incompatible (liberada): no reembolsa, falla permanente con alerta
- blockchain/trabajos-onchain.service.spec.ts › operacion reembolsar_reserva (HU-20, A-09, CA-17) A-09: escrow incompatible (nunca bloqueada): no reembolsa, falla permanente con alerta
- blockchain/trabajos-onchain.service.spec.ts › operacion reembolsar_reserva (HU-20, A-09, CA-17) A-09: escrow incompatible (para otro pagador): no reembolsa, falla permanente con alerta
- blockchain/trabajos-onchain.service.spec.ts › operacion reembolsar_reserva (HU-20, A-09, CA-17) A-09: escrow incompatible (por otro monto): no reembolsa, falla permanente con alerta
- blockchain/trabajos-onchain.service.spec.ts › operacion reembolsar_reserva (HU-20, A-09, CA-17) CA-17: red caída: suma intento y a los 5 queda alerta reembolso.atascado
- ataques/a-09-liberacion.e2e-spec.ts › A-09 · liberar sin viaje verificado o pagar dos veces (e2e) CA-3: no existe ninguna ruta para pedir una liberación
- ataques/a-09-liberacion.e2e-spec.ts › A-09 · liberar sin viaje verificado o pagar dos veces (e2e) CA-3: pendiente, confirmada, abordada, fallida o con la verificación fallida no encolan pago; forzado, el worker lo rechaza
- ataques/a-09-liberacion.e2e-spec.ts › A-09 · liberar sin viaje verificado o pagar dos veces (e2e) CA-4: respuesta perdida: el reintento recupera el hash y el conductor cobra una vez
- ataques/a-09-liberacion.e2e-spec.ts › A-09 · liberar sin viaje verificado o pagar dos veces (e2e) CA-4: dos workers a la vez: un solo movimiento y un solo pago
- ataques/a-09-liberacion.e2e-spec.ts › A-09 · liberar sin viaje verificado o pagar dos veces (e2e) CA-6: con la red caída queda pendiente, alerta a los 5 intentos sin la URL del nodo y se paga al volver
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) clave_idempotencia repetida el servicio no registra dos veces y devuelve el original
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) clave_idempotencia repetida con otro monto falla y no cambia el original
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) clave_idempotencia repetida con otro tipo falla y no cambia el original
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) clave_idempotencia repetida con otra billetera falla y no cambia el original
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) clave_idempotencia repetida un monto con más de 2 decimales se rechaza, sin redondear
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) clave_idempotencia repetida peticiones simultáneas: solo una inserta
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) clave_idempotencia repetida la repetición no aborta la transacción de quien llama
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) clave_idempotencia repetida la BD la rechaza con el rol de la API aunque se salte el servicio
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia UPDATE de monto: rechazado al rol de la API
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia UPDATE de tipo: rechazado al rol de la API
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia UPDATE de billetera_id: rechazado al rol de la API
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia UPDATE de clave_idempotencia: rechazado al rol de la API
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia UPDATE de creado_en: rechazado al rol de la API
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia UPDATE de reserva_id: rechazado al rol de la API
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia UPDATE de metadatos: rechazado al rol de la API
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia UPDATE de monto: el trigger frena hasta al dueño
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia UPDATE de clave_idempotencia: el trigger frena hasta al dueño
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia UPDATE de metadatos: el trigger frena hasta al dueño
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia DELETE y TRUNCATE: rechazados al rol de la API
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia solo avanza estado y hash_tx, con el rol de la API
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia lo confirmado queda congelado, con el rol de la API revertir a pendiente: rechazado
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia lo confirmado queda congelado, con el rol de la API pasar a fallido: rechazado
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia lo confirmado queda congelado, con el rol de la API borrarle el hash y revertir: rechazado
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia lo confirmado queda congelado, con el rol de la API cambiarle el hash: rechazado
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia lo confirmado queda congelado, con el rol de la API tampoco por el servicio
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia pendiente pasa a fallido, y fallido es final: ni el servicio ni el rol de la API lo cambian
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) la fila escrita no cambia sin hash no se confirma; con hash mal formado tampoco
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) monto 0: la BD lo rechaza
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) monto negativo: la BD lo rechaza
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) tipo desconocido: la BD lo rechaza
- ataques/a-09-libro-mayor.e2e-spec.ts › A-09 · libro mayor inmutable (e2e) bloqueo sin reserva: la BD lo rechaza
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) repetir la confirmación mientras procesa: 202, sin otro movimiento ni trabajo
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) repetirla ya acreditada: 200 con el mismo hash, sin acuñar
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) confirmaciones simultáneas: solo una gana
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) workers simultáneos no toman el mismo trabajo
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) respuesta perdida: el nodo acuñó y el reintento no acuña de nuevo
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) corte del proceso tras tomar el trabajo: al vencer la reserva otro lo retoma
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) con el rol de la API UPDATE de monto de una orden: rechazado
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) con el rol de la API UPDATE de usuario_id de una orden: rechazado
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) con el rol de la API UPDATE de billetera_id de una orden: rechazado
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) con el rol de la API UPDATE de expira_en de una orden: rechazado
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) con el rol de la API DELETE y TRUNCATE de ordenes_recarga: rechazados
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) con el rol de la API DELETE y TRUNCATE de trabajos_onchain: rechazados
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) con el rol de la API INSERT con monto fuera de rango: la BD lo rechaza
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) con el rol de la API INSERT con monto bajo: la BD lo rechaza
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) con el rol de la API INSERT con estado desconocido: la BD lo rechaza
- ataques/a-09-recarga.e2e-spec.ts › A-09 · una recarga no se acredita dos veces (e2e) con el rol de la API INSERT con completada sin hash: la BD lo rechaza
- ataques/a-09-reembolso.e2e-spec.ts › Ataque A-09 · Doble reembolso y cobro indebido (e2e) A-09 · peticiones de cancelación repetidas no duplican movimientos ni reembolsos
- ataques/a-09-reembolso.e2e-spec.ts › Ataque A-09 · Doble reembolso y cobro indebido (e2e) A-09 · dos ejecuciones del worker sobre el mismo trabajo son idempotentes
- ataques/a-09-reserva.e2e-spec.ts › A-09 · reservas simultáneas y repetidas (e2e) CA-3 · el último asiento dos pasajeros a la vez: uno obtiene la reserva y el otro «Ya no quedan asientos», sin bloqueo para él
- ataques/a-09-reserva.e2e-spec.ts › A-09 · reservas simultáneas y repetidas (e2e) CA-3 · el último asiento seis pasajeros por dos asientos: exactamente dos reservas
- ataques/a-09-reserva.e2e-spec.ts › A-09 · reservas simultáneas y repetidas (e2e) CA-4 · la misma petición repetida con la misma clave y firmas nuevas: una sola reserva, un solo bloqueo y un solo trabajo
- ataques/a-09-reserva.e2e-spec.ts › A-09 · reservas simultáneas y repetidas (e2e) CA-4 · la misma petición repetida seis peticiones iguales a la vez (doble toque, red lenta): una sola reserva
- ataques/a-09-reserva.e2e-spec.ts › A-09 · reservas simultáneas y repetidas (e2e) CA-4 · la misma petición repetida con claves distintas, a la vez, tampoco se duplica: una reserva y las demás YA_RESERVADO
- ataques/a-09-reserva.e2e-spec.ts › A-09 · reservas simultáneas y repetidas (e2e) CA-4 · la misma petición repetida dos workers a la vez sobre el mismo trabajo bloquean una sola vez
- ataques/a-09-reserva.e2e-spec.ts › A-09 · reservas simultáneas y repetidas (e2e) CA-5 · el mismo saldo en dos viajes a la vez con 15 URC y dos viajes de 10,50: solo se acepta uno, y ninguno queda a medias
- ataques/a-09-reserva.e2e-spec.ts › A-09 · reservas simultáneas y repetidas (e2e) CA-5 · el mismo saldo en dos viajes a la vez con saldo para ambos se aceptan los dos
- ataques/a-09-reserva.e2e-spec.ts › A-09 · reservas simultáneas y repetidas (e2e) CA-5 · el mismo saldo en dos viajes a la vez con exactamente el precio de saldo se reserva; con un centavo menos, no
- billetera/saldo.e2e-spec.ts › HU-14 · saldo de la billetera (e2e) nodo caído o colgado: 200 con enLinea false, nunca 503 A-09: un movimiento confirmado invalida el caché; no se ve como disponible lo ya retenido
- test/EscrowUniRide.ts › ataque A-09: una cuenta sin rol verificador no puede liberar
- test/EscrowUniRide.ts › ataque A-09: no se cobra dos veces la misma reserva
- test/EscrowUniRide.ts › ataque A-09: no se libera una reserva que nunca se bloqueó
- test/EscrowUniRide.ts › ataque A-09: no se reembolsa dos veces la misma reserva
- test/EscrowUniRide.ts › ataque A-09: no se reembolsa una reserva que nunca se bloqueó
- test/EscrowUniRide.ts › ataque A-09: el operador (relayer) tampoco puede reembolsar
- test/EscrowUniRide.ts › ataque A-09: una cuenta sin rol verificador no puede reembolsar
- test/EscrowUniRide.ts › A-09: la misma orden no acuña dos veces, aunque cambien destino o monto

### A-10 · Colusión para simular viajes

- fraude/patrones.spec.ts › P-1 viajes repetidos (A-10) 2 viajes en 24 h (ida y vuelta) no es anomalía
- fraude/patrones.spec.ts › P-1 viajes repetidos (A-10) 3 viajes en menos de 24 h es anomalía
- fraude/patrones.spec.ts › P-1 viajes repetidos (A-10) borde: 3 salidas separadas por exactamente 24 h no cuentan; 23:59 sí
- fraude/patrones.spec.ts › P-1 viajes repetidos (A-10) un tercer viaje lejano no se suma a los dos primeros
- fraude/patrones.spec.ts › P-2 viaje sin desplazamiento (A-10) 999 m es anomalía y 1000 m no
- fraude/patrones.spec.ts › P-2 viaje sin desplazamiento (A-10) 2:59 es anomalía y 3:00 no
- fraude/patrones.spec.ts › P-2 viaje sin desplazamiento (A-10) las cifras no llevan coordenadas
- ataques/a-10-cancelacion.e2e-spec.ts › Ataque A-10 · Conservación contable de URC en cancelaciones y reembolsos (e2e) A-10 · cancelación al 100 % conserva el total exacto de URC
- ataques/a-10-cancelacion.e2e-spec.ts › Ataque A-10 · Conservación contable de URC en cancelaciones y reembolsos (e2e) A-10 · cancelación al 50/50 conserva el total exacto de URC
- ataques/a-10-cancelacion.e2e-spec.ts › Ataque A-10 · Conservación contable de URC en cancelaciones y reembolsos (e2e) A-10 · expiración conserva el total exacto de URC
- ataques/a-10-colusion.e2e-spec.ts › A-10 · colusión para simular viajes (e2e) A-10: tres viajes pagados del par en 24 h bloquean la reserva entre ellos, en los dos roles, sin decir el motivo
- ataques/a-10-colusion.e2e-spec.ts › A-10 · colusión para simular viajes (e2e) A-10: dos viajes «sin moverse» del par en 7 días bloquean al par
- ataques/a-10-colusion.e2e-spec.ts › A-10 · colusión para simular viajes (e2e) A-10: los viajes no crean saldo, así que la colusión no genera ganancia aunque el bloqueo tarde
- ataques/a-10-movimientos.e2e-spec.ts › A-10 · cada persona solo ve sus movimientos (e2e) el historial de una persona no trae nada de otra
- ataques/a-10-movimientos.e2e-spec.ts › A-10 · cada persona solo ve sus movimientos (e2e) pedir los de otra con ?billeteraId= se rechaza con 400
- ataques/a-10-movimientos.e2e-spec.ts › A-10 · cada persona solo ve sus movimientos (e2e) pedir los de otra con ?usuarioId= se rechaza con 400
- ataques/a-10-movimientos.e2e-spec.ts › A-10 · cada persona solo ve sus movimientos (e2e) pedir los de otra con ?usuario_id= se rechaza con 400
- ataques/a-10-movimientos.e2e-spec.ts › A-10 · cada persona solo ve sus movimientos (e2e) pedir los de otra con ?billetera_id= se rechaza con 400
- ataques/a-10-movimientos.e2e-spec.ts › A-10 · cada persona solo ve sus movimientos (e2e) el saldo de cada persona sale de su propia billetera y su propio bloqueo
- ataques/a-10-movimientos.e2e-spec.ts › A-10 · cada persona solo ve sus movimientos (e2e) el caché de saldo es por dirección: no cruza a otra persona
- ataques/a-10-reserva.e2e-spec.ts › A-10 · reservar no crea saldo (e2e) el total del pasajero, del conductor y de la garantía es el mismo antes, con el bloqueo pendiente y después
- ataques/a-10-reserva.e2e-spec.ts › A-10 · reservar no crea saldo (e2e) el libro tampoco inventa nada: el bloqueo resta al pasajero y no suma a nadie
- ataques/a-10-reserva.e2e-spec.ts › A-10 · reservar no crea saldo (e2e) colusión: reservar y reservar viajes sin parar no le da un URC al conductor
- ataques/a-10-reserva.e2e-spec.ts › A-10 · reservar no crea saldo (e2e) una reserva que no se completa deja el total intacto: nada se descuenta
- ataques/a-10-viaje-completo.e2e-spec.ts › A-10 · el viaje completo no crea saldo (e2e) CA-7: pasajeros, conductor y garantía suman lo mismo antes de reservar y después de pagar, en la cadena y en la API
- billetera/recarga.e2e-spec.ts › HU-13 · recarga de saldo (e2e) A-10: la orden de otra persona no existe para ti leerla o confirmarla da 404 y la orden no cambia
- billetera/recarga.e2e-spec.ts › HU-13 · recarga de saldo (e2e) A-10: la orden de otra persona no existe para ti una orden inexistente da 404, y un id mal formado 400
- test/EscrowUniRide.ts › solo el acuñador crea saldo (los viajes no crean saldo, A-10)

### A-11 · Mover dinero con un comando de voz

- ataques/a-08-recarga.e2e-spec.ts › A-08 y A-11 · confirmar una recarga sin firma de dispositivo (e2e) sin firma: 401 FIRMA_DISPOSITIVO_INVALIDA, como un comando de voz sin interacción física
- ataques/a-08-recarga.e2e-spec.ts › A-08 y A-11 · confirmar una recarga sin firma de dispositivo (e2e) sin sesión: 401
- ataques/a-08-recarga.e2e-spec.ts › A-08 y A-11 · confirmar una recarga sin firma de dispositivo (e2e) firma de otra llave con el id del dispositivo vinculado: 401
- ataques/a-08-recarga.e2e-spec.ts › A-08 y A-11 · confirmar una recarga sin firma de dispositivo (e2e) dispositivo de otra persona: 401
- ataques/a-08-recarga.e2e-spec.ts › A-08 y A-11 · confirmar una recarga sin firma de dispositivo (e2e) firma de otra ruta: 401
- ataques/a-08-recarga.e2e-spec.ts › A-08 y A-11 · confirmar una recarga sin firma de dispositivo (e2e) firma basura: 401
- ataques/a-08-recarga.e2e-spec.ts › A-08 y A-11 · confirmar una recarga sin firma de dispositivo (e2e) repetir una petición firmada capturada no pasa del nonce
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado sin firma: 401 FIRMA_DISPOSITIVO_INVALIDA y no reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado sin sesión, aunque la firma sea válida: 401
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado sin teléfono vinculado: 401
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado el teléfono de otra persona con mi sesión (A-04): 401
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado la llave de otra persona con el id de mi teléfono: 401
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado una firma de otro cuerpo no sirve: no se puede cambiar la clave después de firmar
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado una firma de otro viaje no sirve: la ruta va dentro del mensaje firmado
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado la misma petición firmada repetida palabra por palabra: 401 PETICION_EXPIRADA y una sola reserva
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-6 · sin la firma válida del teléfono vinculado un rechazo por otro motivo no gasta la firma: con la cuenta suspendida, 403 antes que 401
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor un monto en el cuerpo se rechaza y no se reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor un precio en el cuerpo se rechaza y no se reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor un conductor en el cuerpo se rechaza y no se reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor un pasajero en el cuerpo se rechaza y no se reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor un estado en el cuerpo se rechaza y no se reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor un organización en el cuerpo se rechaza y no se reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor un viaje en el cuerpo se rechaza y no se reserva nada
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) CA-7 · monto, conductor y estado los fija el servidor la reserva cobra el precio publicado del viaje y paga a su conductor, no a quien diga el cliente
- ataques/a-08-reserva.e2e-spec.ts › A-08 / A-11 · reservar sin la firma del teléfono (e2e) A-11 · la voz no es un camino no existe ninguna ruta de reserva distinta de la firmada
- ataques/a-11-catalogo-sensible.e2e-spec.ts › HU-29 CA-7, CA-4 y A-11 · catálogo de acciones sensibles (e2e) lee las rutas de verdad (si devolviera pocas, las demás pruebas pasarían en vacío)
- ataques/a-11-catalogo-sensible.e2e-spec.ts › HU-29 CA-7, CA-4 y A-11 · catálogo de acciones sensibles (e2e) CA-7: cada acción del catálogo que existe exige la firma biométrica con su nombre
- ataques/a-11-catalogo-sensible.e2e-spec.ts › HU-29 CA-7, CA-4 y A-11 · catálogo de acciones sensibles (e2e) CA-7: una escritura de billetera, viajes, reservas o presencia sin firma ni motivo hace fallar
- ataques/a-11-catalogo-sensible.e2e-spec.ts › HU-29 CA-7, CA-4 y A-11 · catálogo de acciones sensibles (e2e) toda ruta marcada como sensible está en el catálogo y lleva el guard de firma
- ataques/a-11-catalogo-sensible.e2e-spec.ts › HU-29 CA-7, CA-4 y A-11 · catálogo de acciones sensibles (e2e) CA-4 / A-11: ninguna acción sensible tiene otra ruta sin firma (la voz no tiene atajo)
- ataques/a-11-catalogo-sensible.e2e-spec.ts › HU-29 CA-7, CA-4 y A-11 · catálogo de acciones sensibles (e2e) Swagger dice en cada acción sensible que requiere la firma biométrica
- __tests__/voz-cancelar.test.tsx › HU-28 · Cancelación por voz (voz-cancelar) Amenaza A-11 / CA-11: La voz nunca autoriza cancelación sin biometría A-11: «cancela mi viaje» NUNCA envía una firma de dispositivo ni petición mutating
- __tests__/voz-reservar.test.tsx › HU-27 · Amenaza A-11 (Seguridad: mover dinero con la voz) A-11: la voz no puede confirmar reservas: decir sí, confirma o reserva sin número no firma ni envía petición
- __tests__/voz-reservar.test.tsx › HU-27 · Amenaza A-11 (Seguridad: mover dinero con la voz) A-11: si la huella dactilar es cancelada o no coincide, la reserva iniciada por voz no se envía

### A-12 · Robar llaves del servidor

- billetera/custodia.spec.ts › custodia de llaves (A-12) cifra y descifra
- billetera/custodia.spec.ts › custodia de llaves (A-12) guarda IV, etiqueta y texto cifrado, sin la llave legible
- billetera/custodia.spec.ts › custodia de llaves (A-12) cada cifrado usa otro IV
- billetera/custodia.spec.ts › custodia de llaves (A-12) otra clave no descifra
- billetera/custodia.spec.ts › custodia de llaves (A-12) una referencia copiada a la fila de otra billetera no descifra
- billetera/custodia.spec.ts › custodia de llaves (A-12) una referencia alterada no descifra
- billetera/custodia.spec.ts › custodia de llaves (A-12) sin WALLET_ENCRYPTION_KEY falla claro
- billetera/custodia.spec.ts › custodia de llaves (A-12) WALLET_ENCRYPTION_KEY vacía se rechaza sin mostrar su valor
- billetera/custodia.spec.ts › custodia de llaves (A-12) WALLET_ENCRYPTION_KEY corta se rechaza sin mostrar su valor
- billetera/custodia.spec.ts › custodia de llaves (A-12) WALLET_ENCRYPTION_KEY larga se rechaza sin mostrar su valor
- billetera/custodia.spec.ts › custodia de llaves (A-12) WALLET_ENCRYPTION_KEY no hexadecimal se rechaza sin mostrar su valor
- ataques/a-12-llaves.e2e-spec.ts › PB-05 · A-12 · las llaves no se pueden leer (e2e) A-12: el repositorio versionado no contiene llaves privadas PEM ni una llave de 32 bytes junto a una palabra de llave
- ataques/a-12-llaves.e2e-spec.ts › PB-05 · A-12 · las llaves no se pueden leer (e2e) A-12: en la base la llave de la billetera está cifrada y la auditoría no guarda llaves
- billetera/creacion.e2e-spec.ts › HU-12 · creación de billetera (e2e) CA-3 y A-12: la llave privada nunca es legible en BD solo está cifrada, descifra a la llave de esa dirección y nunca aparece
- billetera/creacion.e2e-spec.ts › HU-12 · creación de billetera (e2e) CA-3 y A-12: la llave privada nunca es legible las respuestas traen solo los cuatro campos públicos
- billetera/creacion.e2e-spec.ts › HU-12 · creación de billetera (e2e) CA-3 y A-12: la llave privada nunca es legible ninguna columna de la fila guarda una frase semilla ni la llave en claro
- billetera/creacion.e2e-spec.ts › HU-12 · creación de billetera (e2e) CA-3 y A-12: la llave privada nunca es legible dos billeteras nunca comparten dirección ni material cifrado
- billetera/creacion.e2e-spec.ts › HU-12 · creación de billetera (e2e) CA-3 y A-12: la llave privada nunca es legible una caída de la cadena no filtra datos del nodo en la respuesta

### A-13 · Ver o modificar datos de otra organización

- organizaciones/afiliacion.service.spec.ts › AfiliacionService A-13: otra organización que la activa responde 404 sin consultar la BD
- reservas/cancelaciones.service.spec.ts › CancelacionesService cancelarReserva (HU-20 CA-1…CA-4, CA-10…CA-15) A-13: lanza 404 si la reserva le pertenece a otro usuario
- membresias/membresias.service.spec.ts › MembresiasService.listar A-13: otra organización que la activa responde 404 sin consultar la BD
- membresias/membresias.service.spec.ts › MembresiasService.decidir A-13: un id que no es UUID responde 404 sin consultar la BD
- autenticacion/yo.e2e-spec.ts › HU-06 CA-7 · GET /yo con las membresías del usuario (e2e) A-13: solo sus propias membresías y solo los cuatro campos
- ataques/a-13-afiliacion.e2e-spec.ts › Ataque A-13 · HU-02 reglas de afiliación (e2e) CA-7: el admin de A no ve ni cambia la afiliación de B; la respuesta es la de una organización inexistente
- ataques/a-13-afiliacion.e2e-spec.ts › Ataque A-13 · HU-02 reglas de afiliación (e2e) CA-7: un token que dice ser de B sin membresía en B se rechaza (OrganizacionGuard)
- ataques/a-13-afiliacion.e2e-spec.ts › Ataque A-13 · HU-02 reglas de afiliación (e2e) CA-7 a nivel BD: con el contexto de A, RLS no muestra, no borra ni crea dominios de B
- ataques/a-13-afiliacion.e2e-spec.ts › Ataque A-13 · HU-02 reglas de afiliación (e2e) organizacion_por_dominio no abre RLS al llamador y solo devuelve el id
- ataques/a-13-anomalias.e2e-spec.ts › A-13 · alertas de anomalías por organización (e2e) A-13: un par con reservas en A deja alertas solo en A; nada en B
- ataques/a-13-anomalias.e2e-spec.ts › A-13 · alertas de anomalías por organización (e2e) A-13: una persona con fallidas en dos organizaciones deja una alerta en cada una
- ataques/a-13-cancelacion.e2e-spec.ts › Ataque A-13 · Aislamiento multi-organización y por usuario en cancelaciones (e2e) A-13 · un pasajero no puede cancelar la reserva de otro pasajero de su misma organización
- ataques/a-13-cancelacion.e2e-spec.ts › Ataque A-13 · Aislamiento multi-organización y por usuario en cancelaciones (e2e) A-13 · un conductor no puede cancelar el viaje de otro conductor
- ataques/a-13-cancelacion.e2e-spec.ts › Ataque A-13 · Aislamiento multi-organización y por usuario en cancelaciones (e2e) A-13 · un usuario de orgB no puede cancelar reserva de orgA aunque conozca su ID
- ataques/a-13-cancelacion.e2e-spec.ts › Ataque A-13 · Aislamiento multi-organización y por usuario en cancelaciones (e2e) A-13 · un conductor de orgB no puede cancelar viaje de orgA
- ataques/a-13-membresias.e2e-spec.ts › Ataque A-13 · HU-03 aprobación de miembros (e2e) CA-6: el admin de A no ve las solicitudes de B; la respuesta es la de una organización inexistente
- ataques/a-13-membresias.e2e-spec.ts › Ataque A-13 · HU-03 aprobación de miembros (e2e) CA-6: el admin de A no decide una solicitud de B; misma respuesta que una inexistente y B intacta
- ataques/a-13-membresias.e2e-spec.ts › Ataque A-13 · HU-03 aprobación de miembros (e2e) CA-6: un token que dice ser de B sin membresía en B se rechaza (OrganizacionGuard)
- ataques/a-13-membresias.e2e-spec.ts › Ataque A-13 · HU-03 aprobación de miembros (e2e) CA-6: la organización no se puede elegir desde el cuerpo de la petición
- ataques/a-13-membresias.e2e-spec.ts › Ataque A-13 · HU-03 aprobación de miembros (e2e) CA-6 a nivel BD: con el contexto de A, RLS no muestra ni modifica membresías de B
- ataques/a-13-organizaciones.e2e-spec.ts › Ataques A-13 y de rol · HU-01 (e2e) CA-6 el admin de A no lista ni reenvía invitaciones de otras organizaciones
- ataques/a-13-organizaciones.e2e-spec.ts › Ataques A-13 y de rol · HU-01 (e2e) CA-6 a nivel BD, con el contexto de A, RLS no devuelve ni acepta filas de B
- ataques/a-13-organizaciones.e2e-spec.ts › Ataques A-13 y de rol · HU-01 (e2e) CA-7 un miembro o admin de organización no puede dar de alta organizaciones
- ataques/a-13-presencia.e2e-spec.ts › A-13 · presencia entre organizaciones y reservas ajenas (e2e) CA-10: un código de un viaje de otra organización se rechaza igual que uno inválido, sin gastarlo
- ataques/a-13-presencia.e2e-spec.ts › A-13 · presencia entre organizaciones y reservas ajenas (e2e) CA-9: con la reserva de otra persona: «No tienes una reserva en este viaje»
- ataques/a-13-presencia.e2e-spec.ts › A-13 · presencia entre organizaciones y reservas ajenas (e2e) CA-9: con su reserva de otro viaje y el código de este: SIN_RESERVA
- ataques/a-13-presencia.e2e-spec.ts › A-13 · presencia entre organizaciones y reservas ajenas (e2e) CA-9: con una reserva todavía pendiente: SIN_RESERVA
- ataques/a-13-presencia.e2e-spec.ts › A-13 · presencia entre organizaciones y reservas ajenas (e2e) el conductor de otra organización no registra llave ni pide códigos de este viaje
- ataques/a-13-presencia.e2e-spec.ts › A-13 · presencia entre organizaciones y reservas ajenas (e2e) con el rol de la API, en el contexto de A no se ven llaves, desafíos ni pruebas de B
- ataques/a-13-presencia.e2e-spec.ts › A-13 · presencia entre organizaciones y reservas ajenas (e2e) HU-23 CA-14: bajada sobre una reserva de otra organización = reserva inexistente
- ataques/a-13-presencia.e2e-spec.ts › A-13 · presencia entre organizaciones y reservas ajenas (e2e) HU-23 CA-14: posiciones con la llave de A sobre el viaje o la reserva de B se rechazan sin guardar nada
- ataques/a-13-presencia.e2e-spec.ts › A-13 · presencia entre organizaciones y reservas ajenas (e2e) HU-23: con el rol de la API, en el contexto de A no se ven los puntos de B
- ataques/a-13-presencia.e2e-spec.ts › A-13 · presencia entre organizaciones y reservas ajenas (e2e) HU-28 CA-14: distancia del conductor con reserva de otra organización responde 404 RESERVA_NO_ENCONTRADA
- ataques/a-13-presencia.e2e-spec.ts › A-13 · presencia entre organizaciones y reservas ajenas (e2e) HU-28 CA-14: distancia del conductor con reserva de otro pasajero en la misma organización responde 404 RESERVA_NO_ENCONTRADA
- ataques/a-13-presencia.e2e-spec.ts › A-13 · presencia entre organizaciones y reservas ajenas (e2e) HU-28 CA-14: distancia del conductor con reserva propia que no está confirmada responde 404 RESERVA_NO_ENCONTRADA
- ataques/a-13-registro.e2e-spec.ts › Ataque A-13 · HU-05 registro con otra organización (e2e) CA-8: un `organizacionId` de otra organización se ignora; la organización sale solo del dominio
- ataques/a-13-registro.e2e-spec.ts › Ataque A-13 · HU-05 registro con otra organización (e2e) CA-8: al revés, un correo de B con el id de A queda en B y no en A
- ataques/a-13-registro.e2e-spec.ts › Ataque A-13 · HU-05 registro con otra organización (e2e) otras formas de indicar la organización se rechazan sin enviar código
- ataques/a-13-reservas.e2e-spec.ts › A-13 · aislamiento de reservas (e2e) por la API reservar un viaje de otra organización conociendo su id: «Viaje no encontrado», igual que si no existiera
- ataques/a-13-reservas.e2e-spec.ts › A-13 · aislamiento de reservas (e2e) por la API un miembro de las dos organizaciones reserva solo en la que tiene activa
- ataques/a-13-reservas.e2e-spec.ts › A-13 · aislamiento de reservas (e2e) por la API la reserva de otra organización no se ve: 404 para su pasajero fuera de su organización y para otros
- ataques/a-13-reservas.e2e-spec.ts › A-13 · aislamiento de reservas (e2e) por la API los pasajeros de un viaje de otra organización no se ven: 404
- ataques/a-13-reservas.e2e-spec.ts › A-13 · aislamiento de reservas (e2e) por la API «mias» solo trae las reservas de la propia persona
- ataques/a-13-reservas.e2e-spec.ts › A-13 · aislamiento de reservas (e2e) en PostgreSQL con el rol de la API RLS sola oculta la fila aunque la consulta no filtre por organización
- ataques/a-13-reservas.e2e-spec.ts › A-13 · aislamiento de reservas (e2e) en PostgreSQL con el rol de la API sin contexto de organización no se ve ninguna reserva
- ataques/a-13-reservas.e2e-spec.ts › A-13 · aislamiento de reservas (e2e) en PostgreSQL con el rol de la API con el contexto de otra organización no se puede cambiar ni la fila ni el cupo de su viaje
- ataques/a-13-reservas.e2e-spec.ts › A-13 · aislamiento de reservas (e2e) en PostgreSQL con el rol de la API no se puede insertar una reserva de A desde el contexto de B
- ataques/a-13-reservas.e2e-spec.ts › A-13 · aislamiento de reservas (e2e) en PostgreSQL con el rol de la API el rol de la API solo avanza el estado y el motivo: ni el monto, ni el pasajero, ni borrar
- ataques/a-13-reservas.e2e-spec.ts › A-13 · aislamiento de reservas (e2e) en PostgreSQL con el rol de la API la BD rechaza un estado inventado y un monto no positivo aunque la API falle
- ataques/a-13-reservas.e2e-spec.ts › A-13 · aislamiento de reservas (e2e) en PostgreSQL con el rol de la API un movimiento no puede apuntar a una reserva que no existe
- ataques/a-13-rutas.e2e-spec.ts › PB-05 CA-7 · A-13 · catálogo de rutas con datos de organización (e2e) A-13: toda ruta con datos de organización exige membresía aprobada o tiene su excepción justificada
- ataques/a-13-rutas.e2e-spec.ts › PB-05 CA-7 · A-13 · catálogo de rutas con datos de organización (e2e) A-13: las excepciones justificadas existen de verdad (no queda ninguna obsoleta)
- ataques/a-13-varias-organizaciones.e2e-spec.ts › Ataque A-13 · HU-07 varias organizaciones propias (e2e) CA-6: con A activa no ve ni cambia datos de B aunque sea admin de B; misma respuesta que una organización inexistente
- ataques/a-13-varias-organizaciones.e2e-spec.ts › Ataque A-13 · HU-07 varias organizaciones propias (e2e) CA-6: solo cambiando la activa a B ve los datos de B; y entonces deja de ver los de A
- ataques/a-13-varias-organizaciones.e2e-spec.ts › Ataque A-13 · HU-07 varias organizaciones propias (e2e) CA-5/CA-6: no puede activar C (pendiente) ni con un token que diga org = C
- ataques/a-13-varias-organizaciones.e2e-spec.ts › Ataque A-13 · HU-07 varias organizaciones propias (e2e) la organización nunca sale del cliente: `organizacionId` en el cuerpo → 400 y no se envía código
- ataques/a-13-varias-organizaciones.e2e-spec.ts › Ataque A-13 · HU-07 varias organizaciones propias (e2e) RN-1: el código lo usa solo quien lo pidió; otra cuenta que lo conoce no se une, y el código sigue sirviendo a su dueño
- ataques/a-13-varias-organizaciones.e2e-spec.ts › Ataque A-13 · HU-07 varias organizaciones propias (e2e) CA-6 a nivel BD: con el contexto de A, RLS no muestra sus membresías de B ni de C
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API un miembro de otra organización no ve el detalle: 404, como si no existiera
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API búsqueda (HU-18, CA-3) un miembro de otra organización no lo encuentra, con el mismo punto y hora
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API búsqueda (HU-18, CA-3) con filtro de destino: un miembro de otra organización no lo encuentra aunque coincida el destino
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API búsqueda (HU-18, CA-3) uno de la misma organización sí
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API búsqueda (HU-18, CA-3) quien está en las dos organizaciones solo ve la activa
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API búsqueda (HU-18, CA-3) `organizacionId` en la consulta se rechaza: lo decide el token
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API búsqueda (HU-18, CA-3) `conductorId` en la consulta se rechaza: lo decide el token
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API búsqueda (HU-18, CA-3) sin membresía aprobada: 403
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API búsqueda (HU-18, CA-3) revocar la membresía surte efecto con la misma sesión
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API búsqueda (HU-18, CA-3) sin sesión: 401
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API búsqueda (HU-18, CA-3) en PostgreSQL, RLS sola oculta la fila aunque la consulta no filtre por organización
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API un miembro de la misma organización sí lo ve
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API sin membresía aprobada no ve el detalle
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API revocar la membresía surte efecto con la misma sesión
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API `mis-viajes` solo trae los propios: los de otro conductor, ni de su organización
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API `mis-viajes` trae los suyos de todas sus organizaciones, aunque la activa sea otra
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API `organizacionId` en el cuerpo se rechaza: lo decide el servidor
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API `conductorId` en el cuerpo se rechaza: lo decide el servidor
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API `vehiculoId` en el cuerpo se rechaza: lo decide el servidor
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API `estado` en el cuerpo se rechaza: lo decide el servidor
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API `cuposDisponibles` en el cuerpo se rechaza: lo decide el servidor
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) por la API se publica en la organización activa del token
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) en PostgreSQL con el rol de la API sin contexto de organización no se ve ninguna fila
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) en PostgreSQL con el rol de la API con el contexto de otra organización no se ve la fila, ni pidiéndola por id
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) en PostgreSQL con el rol de la API con su organización sí se ve
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) en PostgreSQL con el rol de la API no se puede insertar en otra organización
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) en PostgreSQL con el rol de la API el rol de la API solo cambia el estado y los cupos de un viaje (HU-19), nunca su precio ni su dueño, ni lo borra
- ataques/a-13-viajes.e2e-spec.ts › A-13 · aislamiento de viajes (e2e) en PostgreSQL con el rol de la API la BD rechaza cupos y precios fuera de rango aunque la API falle
- __tests__/registro.test.tsx › Pantalla Registro CA-8 (A-13): el cliente nunca envía una organización y la contraseña no viaja a la pantalla siguiente
