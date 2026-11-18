# HU-30 · Protocolo de la prueba de usabilidad (SUS)

Estado: `borrador para aprobación del PO` · Cubre CA-1 de `spec.md`. Una sesión dura unos 20 minutos por persona.

## 1. Objetivo

Medir con 5 personas ajenas al equipo si la app se entiende sin ayuda (buscar → reservar → ver saldo → pedir por voz) y obtener el puntaje SUS. Meta: promedio ≥ 75 y buscar → reservar en ≤ 4 pasos.

## 2. Entorno (RN-1, RN-2)

Antes de **cada** sesión:

1. Teléfono Android físico del equipo con la versión candidata y la huella de un integrante registrada.
2. Cuenta de prueba verificada y vinculada a ese teléfono, con la sesión iniciada.
3. Sin reservas activas (si quedó una, se cancela desde la app; HU-20 devuelve el 100 % si faltan más de 30 min) y **40,00 URC** disponibles (recarga simulada de HU-13).
4. Otro integrante, desde su teléfono, publica para la hora de la sesión al menos 3 viajes que cumplen T1 y 1 que cumple T4 (destino y hora distintos), con precio ≤ 15 URC.
5. Comprobar con una búsqueda que T1 y T4 dan resultados y que el reconocedor de voz responde.
6. No se usa ningún modo que salte la biometría o la verificación (RN-6).

## 3. Participantes (RN-2)

5 personas mayores de edad, ajenas al equipo, que no hayan visto la app (idealmente estudiantes o trabajadores de una organización). Se anotan como P1 a P5, con edad aproximada y ocupación. Si abandonan, hay falla técnica o el cuestionario queda incompleto, la sesión no cuenta y se busca otra persona.

## 4. Guion del facilitador

Dice, sin agregar nada:

> «Gracias por ayudarnos. Vamos a probar una aplicación, no a evaluarte a ti: si algo te cuesta, es culpa de la aplicación. Te voy a pedir cuatro tareas. Piensa en voz alta, y no te voy a explicar cómo hacerlas; si no sabes seguir, dímelo. Puedes parar cuando quieras. No grabamos audio ni video; solo anotamos lo que haces, sin tu nombre.»

Entrega el consentimiento (`consentimiento.md`) y espera la firma. Luego lee **tal cual** cada tarea y anota en `hoja-registro.md`. Entre tareas no comenta ni corrige.

| Tarea | Consigna | Éxito |
|---|---|---|
| T1 | «Busca un viaje que salga cerca de aquí hacia {destino} a las {hora}.» | Ve el resultado del viaje buscado |
| T2 | «Reserva un asiento en el viaje que más te convenga.» | Reserva confirmada (o pendiente con el aviso de la app) |
| T3 | «Averigua cuánto saldo te queda y cuánto está en garantía.» | Dice ambas cifras |
| T4 | «Ahora, sin escribir, pide por voz un viaje a {destino} a las {hora} y reserva el primero.» | Reserva por voz confirmada |

`{destino}` y `{hora}` de T1 y de T4 son distintos y los fija el integrante que publica los viajes (paso 4 del entorno).

## 5. Qué se registra (por persona y tarea)

Completada sin ayuda (sí/no), tiempo en segundos, pasos usados, errores, comentarios. En T4: repreguntas de voz y si recurrió al teclado. Pasos del flujo buscar → reservar: contar toques desde la pantalla de inicio hasta la reserva confirmada.

## 6. Regla de ayuda (RN-8)

Cualquier indicación sobre cómo hacer la tarea cuenta como «con ayuda». Repetir la consigna no cuenta. Si pasan 3 minutos sin avance, se marca «no completada» y se sigue con la siguiente.

## 7. Huella (RN-6)

Cuando la app pide la huella, el participante lo indica y el integrante dueño del teléfono apoya el dedo. Ese paso cuenta como hecho por el participante. El integrante no habla durante las tareas.

## 8. Cuestionario y cierre

Terminadas las tareas: SUS en papel (`cuestionario-sus.md`), sin que el facilitador lo mire mientras se completa (3 min). Dos preguntas abiertas: «¿qué fue lo más difícil?» y «¿qué cambiarías?» (2 min). Se transcribe a `respuestas.json` con el identificador P1–P5.

## 9. Severidad de problemas (RN-5)

*Alta*: impide completar la tarea · *Media*: la completa con error o demora notable · *Baja*: molestia o comentario.

## 10. Casos borde

| Caso | Qué se hace |
|---|---|
| Falla de red o servidor | Se anota, la sesión no cuenta, se repite con otra persona (respaldo: Hardhat local) |
| Participante abandona | Se anota y se busca otra persona |
| Cuestionario incompleto | No se calcula a medias; se reemplaza al participante |
| Ruido que impide la voz | Se anota en T4; T1 a T3 siguen valiendo |

## 11. Después de las 5 sesiones

`node sus.mjs` calcula los 5 puntajes y el promedio. Con eso se completa `informe.md`; cada problema entra a `.agents/STEERING/backlog.md` («Hallazgos de HU-30») y a Trello con su id. Si el promedio es < 75 se informa tal cual y el PO decide repetir con 5 personas nuevas (CA-9).
