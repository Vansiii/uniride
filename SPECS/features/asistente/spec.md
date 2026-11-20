# Asistente · Asistente y guía inteligente para el usuario — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Ubicación: `SPECS/features/asistente/spec.md`
> Estado: `borrador` · Épica: E7 Interfaz y voz · Prioridad: Should · PHU: 5 · Sprint: S4
> Requisito del docente que cubre: **4 — Interfaz muy navegable e intuitiva, con comandos de voz**
> Amenazas que toca: **A-08** (API sin la app), **A-11** (mover dinero con comando o IA), **A-13** (otra organización)

## 1. Historia

**Como** usuario verificado de UniRide (pasajero o conductor)  
**quiero** un asistente discreto que responda mis dudas, me guíe paso a paso en el uso de la plataforma y me lleve directo a las pantallas con un solo toque o comando  
**para** utilizar la app y la web sin fricción, entender el sistema de reservas y garantías (escrow), y completar mis tareas rápido con una interfaz sobria que no estorbe.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | un usuario en la app móvil o en la web | observa la interfaz | el acceso al asistente es discreto y sobrio (ícono sutil `spark` / `help_outline` integrado en la barra o tarjeta existente, colores neutros de superficie y borde, sin brillos ni elementos flotantes invasivos, según DESIGN_SYSTEM P10) |
| CA-2 | un usuario con dudas sobre el funcionamiento («¿Cómo funciona el pago?», «¿Qué es el saldo en garantía?», «¿Cómo publico un viaje?») | consulta al asistente por texto o voz | responde en máximo 2 oraciones concisas y muestra una tarjeta guía con los 2 o 3 pasos clave y un botón «Ir ahí» hacia la pantalla correspondiente |
| CA-3 | un usuario que pide una acción directa («Quiero ir a la UAGRM mañana a las 7», «Ver mi saldo», «Mis viajes») | envía la instrucción | el asistente interpreta los parámetros y lo redirige directamente a la pantalla con los filtros o datos precargados, sin necesidad de navegar manualmente |
| CA-4 | un usuario nuevo o que solicita «¿Cómo uso UniRide?» o «Hacer el tour» | activa el tutorial autoguiado | se presenta una guía interactiva liviana de 3 pasos (1. Buscar y reservar con garantía, 2. Abordaje seguro con QR y GPS, 3. Liberación de saldo al bajar) con opción de avanzar paso a paso o salir en cualquier momento |
| CA-5 | un usuario en el portal web (estudiante/empleado) | consulta cómo empezar a viajar o cómo validar su teléfono | el asistente web le explica los requisitos de vinculación biométrica de la app móvil y el estado de su membresía institucional, con enlace directo a su perfil o instrucciones del APK |
| CA-6 | **ataque A-11:** el usuario dice o escribe «reserva el viaje a las 7», «paga el viaje» o «cancela mi viaje» | la instrucción llega al asistente | el asistente **nunca ejecuta la transacción ni autoriza dinero de forma autónoma**: únicamente abre la pantalla de confirmación oficial con el resumen del monto; la reserva, pago o cancelación solo se perfecciona si el usuario coloca su huella biométrica (móvil) o confirmación explícita (web) |
| CA-7 | **ataque A-13:** un usuario consulta viajes, conductores o guías institucionales | interactúa con el asistente | todas las respuestas y búsquedas están estrictamente filtradas por su organización activa; jamás se sugieren viajes ni información de otras instituciones |
| CA-8 | **ataque A-08:** una petición al endpoint del asistente sin sesión o con token vencido | llega al servidor | responde 401 Unauthorized y no procesa ninguna consulta ni consume el modelo de lenguaje |
| CA-9 | una consulta fuera de tema («¿cuál es la capital de Francia?», «escribeme un poema») | se recibe | responde amablemente reenfocando al usuario en los servicios de UniRide: «Solo puedo ayudarte con viajes, reservas, saldo y el uso de UniRide. ¿En qué te ayudo hoy?» |
| CA-10 | el servicio de IA externo tiene latencia alta o está fuera de servicio | el usuario consulta | el sistema degrada limpiamente a las respuestas determinísticas locales y preguntas frecuentes estáticas sin bloquear la interfaz ni mostrar errores crudos |

## 3. Reglas de negocio

- RN-1: **Diseño sobrio y no invasivo (DESIGN_SYSTEM P10):** El asistente no utiliza ventanas de chat flotantes gigantescas ni animaciones llamativas. En mobile se integra como opción de consulta dentro del panel de voz existente (o buscador superior); en web se integra como un botón sutil en el encabezado o una tarjeta de ayuda plana en el inicio.
- RN-2: **La IA nunca autoriza dinero ni cancelaciones (A-11, HU-29 RN-6):** Cualquier acción sugerida por el asistente que involucre movimiento de fondos (reserva en garantía, cancelación con reembolso, recarga) termina obligatoriamente en el componente nativo de confirmación con biometría del dispositivo.
- RN-3: **Formato de respuesta (Doble Modo):**
  - **Modo Acción:** Devuelve ruta destino + parámetros (`{ ruta: '/buscar', params: { destino: 'UAGRM', hora: '07:00' } }`).
  - **Modo Guía:** Devuelve texto explicativo breve (≤ 2 oraciones) + lista de 2 a 3 pasos + botón de acción opcional.
- RN-4: **Aislamiento institucional (A-13):** Las consultas al asistente viajan siempre con el contexto del usuario autenticado (ID de organización y usuario extraídos del JWT del servidor, nunca alterables por el cliente).
- RN-5: **Tono y microcopia (Constitution Art. 8):** Respuestas en español neutro (`es-BO`), concisas, claras, sin tecnicismos innecesarios (ej. no mencionar "blockchain", "contratos inteligentes" ni "KMS"; explicar "saldo en garantía", "verificación al subir").
- RN-6: **Límites de consumo (Rate Limiting):** Límite de 15 consultas por minuto por usuario para proteger la cuota de la API de IA (Groq) y evitar abusos.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Servicio de IA caído o timeout (> 3 s) | Fallback inmediato a FAQ predefinidas locales | `asistente.error_servicio_fallback` |
| Sin conexión a internet | Indica falta de conexión sin romper la pantalla | `comun.errores.sin_conexion` |
| Usuario sin organización activa | Guía al usuario a afiliarse o aceptar invitación | `asistente.guia_sin_organizacion` |
| Consulta incomprensible o vacía | Pide reformular con un ejemplo concreto | `asistente.consulta_incomprensible` |
| Límite de tasa alcanzado (Rate Limit) | Notifica espera amablemente | `asistente.limite_alcanzado` |

## 5. Fuera de alcance de esta HU

- Chatbot conversacional de ocio o charlas abiertas fuera del dominio de UniRide.
- Ejecución directa de mutaciones en base de datos o contratos inteligentes sin pantalla de confirmación.
- Soporte para llamadas de voz continuas bidireccionales en tiempo real (mantiene el modelo de interacción por comando o toque).
- Paneles o tareas de administración avanzada / superadmin.

## 6. Dependencias

- HU / PB: HU-27 y HU-28 (panel y captura de voz en móvil), HU-18 y HU-19 (búsqueda y reserva de viajes), HU-14 (billetera y saldo), HU-29 (confirmación biométrica).
- Credenciales: `GROQ_API_KEY` configurada en el backend (SSM / variables de entorno).
- Decisiones abiertas que la afectan: ninguna que bloquee este alcance.

## 7. Definition of Done

- [ ] Todos los criterios de aceptación cumplidos en backend, mobile y web.
- [ ] Pruebas automatizadas de interpretación de intenciones y generación de guía en verde.
- [ ] Prueba de ataque A-11 en verde (verificación de que la IA nunca reserva ni cancela sin biometría).
- [ ] Prueba de ataque A-13 en verde (aislamiento de organización verificado).
- [ ] CI en verde (lint, pruebas, build) en `backend/`, `mobile/` y `web/`.
- [ ] Microcopia y claves en `es-BO.json` en mobile y web.
- [ ] Aceptada por el PO.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-19 | Creación de la especificación SDD para el Asistente de usuario | Registrado en MEMORY.md |

