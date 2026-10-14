# Misión — UniRide

> Brújula del proyecto. Deriva de `AGENTS.md` §1 y del documento técnico §1. Casi no cambia; si cambia, primero se registra en `/.agents/MEMORY/MEMORY.md`.

## Qué es

UniRide es una plataforma de carpooling para organizaciones (universidades y empresas). Sus miembros verificados publican, buscan y reservan viajes compartidos. Cada viaje se verifica criptográficamente al subir y al bajar, y se paga con una billetera blockchain propia: el pasaje queda en garantía (escrow) al reservar y solo se libera al conductor cuando el servidor comprueba que el viaje ocurrió.

## Qué problema resuelve

Estudiantes y empleados de una misma organización recorren a diario rutas parecidas, muchas veces solos o en transporte público saturado. El carpooling informal (grupos de WhatsApp, acuerdos de palabra) existe, pero falla en tres puntos:

1. No hay certeza de quién es la otra persona.
2. El pago depende de la confianza.
3. Nadie puede comprobar que el viaje ocurrió.

UniRide resuelve los tres con un único mecanismo: **la voz agiliza, la biometría autoriza, el handshake prueba y el contrato paga.**

## Para quién

| Actor | Qué obtiene |
|---|---|
| Pasajero (miembro verificado) | Viajes seguros con gente de su comunidad; paga solo si el viaje ocurre. |
| Conductor (miembro con vehículo) | Cobro garantizado sin depender de la buena voluntad del pasajero. |
| Administrador de organización | Control de quién entra, reglas y tarifas propias, reportes. |
| Organización cliente (UAGRM, otra universidad, empresa) | Un servicio de movilidad confiable para sus miembros, aislado de otras organizaciones; puede subsidiar saldo. |
| Super administrador (equipo UniRide) | Alta de organizaciones y supervisión de fraude y salud del sistema. |

## Por qué una organización lo adoptaría

- **Confianza verificable:** cada usuario es una persona real, única y atada a su teléfono; cada viaje tiene prueba criptográfica.
- **Aislamiento:** sus datos y miembros no se mezclan con los de otras organizaciones; ella decide si comparte viajes con otras.
- **Pago sin fricción ni disputas:** el escrow elimina el "no me pagó" y el "cobró sin llevarme".
- **Fácil de usar:** el flujo principal (buscar, reservar, abordar, pagar) toma 4 pasos o menos y las acciones frecuentes funcionan por voz en español.

## Requisitos del docente (no negociables)

1. Múltiples organizaciones, no solo la UAGRM.
2. Verificación que no se pueda saltar.
3. Billetera blockchain propia que acredita y descuenta saldo.
4. Interfaz muy navegable e intuitiva, con comandos de voz.

## Qué NO es (no-objetivos)

- No es un servicio de taxi ni de transporte comercial: no hay conductores profesionales ni tarifas de mercado.
- No maneja dinero real: el token URC vive solo en red de prueba (1 URC = 1 Bs simulado) y no hay pasarela bancaria.
- No es una app pública abierta a cualquiera: solo entran miembros aprobados de organizaciones afiliadas.
- No se publica en Play Store ni App Store; la demostración es en Android físico.
- No calcula rutas óptimas con varios pasajeros, no tiene chat en tiempo real ni soporte multi-idioma.
- No valida licencias de conducir ni seguros con entidades estatales.

## Criterio rector

La solución más simple posible que cumpla los cuatro requisitos del docente y los criterios de calidad de la materia.
