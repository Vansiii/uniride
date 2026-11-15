# PB-05 · Suite consolidada de ataques — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-15)` · Épica: E9 Seguridad y calidad · Prioridad: Must · PHU: 8 · Sprint: S4
> **Orden en S4: 5.ª** (después de HU-20, HU-25, HU-27 y HU-28, para incluir sus ataques). Requiere HU-24 y HU-29.
> Requisito del docente que cubre: **2 — Verificación que no se pueda saltar** (criterio medible del documento técnico §3.2, D-15)
> Amenazas que toca: **A-01 a A-13** (todas)

## 1. Historia

**Como** equipo
**queremos** una suite única y repetible que ataque cada amenaza del modelo y demuestre que falla
**para** probar ante el docente, con evidencia y no con afirmaciones, que la verificación no se salta.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | el modelo de amenazas (A-01 a A-13, `AGENTS.md` §6) | se revisa la suite | **cada** amenaza tiene al menos un ataque automatizado, identificado con su `A-xx` en el nombre, que ejecuta el ataque real (no solo la función que lo bloquea) y comprueba que el sistema lo rechaza |
| CA-2 | cada ataque de la suite | termina | además del rechazo, comprueba que **nada cambió**: estados, asientos, saldos de la base y de la red, libro de movimientos y bloqueos en garantía quedan como antes, salvo el registro del intento |
| CA-3 | la suite | se ejecuta con **un solo comando** desde la raíz del repositorio principal, con Docker | corre los ataques del backend (contra la API y la base de datos reales), de los contratos y de la app, sin pasos manuales; en CI, el pipeline de cada repositorio corre sus propios ataques en cada PR |
| CA-4 | la ejecución | termina | genera un **informe** con una fila por amenaza: id, ataque, contramedida, capa, historia, pruebas que la cubren, resultado (bloqueado / falló / sin prueba), fecha y commit; el total muestra «13 de 13 bloqueadas» o cuáles no |
| CA-5 | una amenaza sin ningún ataque automatizado, o un ataque que no corre | se ejecuta la suite | el informe la marca *sin prueba* y la suite **falla**; no puede quedar una amenaza cubierta solo en papel |
| CA-6 | un cambio que debilita una defensa (por ejemplo, quitar la firma biométrica de una acción sensible) | se abre el PR | la suite falla en CI y el PR no se puede fusionar |
| CA-7 | una acción sensible nueva sin firma biométrica, o una ruta nueva con datos de organización sin su filtro | se agrega al código | la suite falla (catálogo de acciones sensibles de HU-29 CA-7 y catálogo de rutas con organización) |
| CA-8 | las defensas que solo se prueban en un teléfono físico (RN-4) | se ejecuta la lista manual | cada una tiene pasos, resultado esperado y una fila en el informe con fecha, teléfono, persona y resultado; ninguna se declara bloqueada sin esa fila |
| CA-9 | el contrato de garantía | se ataca con cuentas que no son la verificadora, con liberación o reembolso dobles y con una reserva inexistente | revierte en todos los casos (criterio §3.2.3) |
| CA-10 | el informe de la ejecución sobre el commit que se presenta | se guarda | queda versionado en el repositorio principal como evidencia para la defensa, con su fecha y commit |
| CA-11 | la suite completa | se ejecuta con el comando único | termina en **menos de 15 min** en una máquina del equipo conectada a la corriente |

## 3. Reglas de negocio

- RN-1: **Criterio de «invulnerable»** (documento técnico §3.2, propuesto al docente en D-15): (1) ninguna acción que dependa de verificación se ejecuta sin que el servidor valide todas las capas; (2) cada amenaza tiene una prueba automatizada que demuestra que falla; (3) el contrato rechaza toda liberación que no venga de la cuenta verificadora. La suite es la evidencia de los tres.
- RN-2: **Cobertura mínima por amenaza** (los ataques ya existentes cuentan; esta historia los reúne, completa los que falten y los nombra con su `A-xx`):

  | Id | Ataques mínimos que deben estar |
  |---|---|
  | A-01 | Verificación de identidad con prueba de vida fallida, y con rostro que no coincide con el carnet (< 90 %) |
  | A-02 | Mismo carnet en una segunda cuenta; mismo rostro en una segunda cuenta; segundo teléfono activo en la misma cuenta |
  | A-03 | Vincular, revincular y abordar con integridad inválida |
  | A-04 | Firma con la llave de otro teléfono o de una llave anulada (en servidor) + huella ajena (manual, RN-4) |
  | A-05 | Código de abordaje y de bajada reutilizado, vencido (> 30 s) y de un tipo por otro |
  | A-06 | Código válido escaneado a más de 50 m |
  | A-07 | Ubicación simulada en encuentro y trayecto; salto > 150 km/h; trayectos separados; verificaciones fallidas repetidas (HU-25) |
  | A-08 | Cada acción sensible sin firma, con firma ajena o repetida; estado, monto, porcentaje o conductor elegidos por el cliente |
  | A-09 | Liberar sin viaje verificado; liberar o reembolsar dos veces; ninguna ruta pública para liberar |
  | A-10 | Total de URC conservado en reserva, pago, cancelación y expiración; colusión detectada (HU-25) |
  | A-11 | Toda acción sensible iniciada por voz sin huella (HU-27, HU-28); catálogo de acciones sensibles |
  | A-12 | Ninguna llave privada en el repositorio, la base en claro, los logs ni la auditoría; producción no arranca sin las llaves del servicio de llaves |
  | A-13 | Leer y modificar datos de otra organización en cada módulo con datos de organización, por la API y en la base con el rol de la API |

- RN-3: **Ataque real:** cada prueba hace lo que haría el atacante (petición a la API, transacción al contrato, acción en la app) y no reemplaza la defensa que prueba por un simulado. Lo único simulado permitido es el servicio externo (prueba de vida, integridad) cuando su respuesta es la del ataque.
- RN-4: **Solo en teléfono físico** (`AGENTS.md` §6, `ssd.md` §15): A-03 con la integridad real de Google, A-04 con una huella ajena y A-07 con una app de ubicación falsa. Van en la lista manual (CA-8). Mientras la integridad real no esté desplegada, el informe dice *simulada en desarrollo* para A-03, no *bloqueada en producción*.
- RN-5: **No se debilita nada para que la suite pase** (`AGENTS.md` §10): si un ataque prospera, se corrige la defensa y se registra como hallazgo; no se borra, salta ni relaja la prueba. El modo emulador de desarrollo queda apagado en la suite.
- RN-6: **El informe se genera de las pruebas**, no se escribe a mano: si se agrega o quita un ataque, el informe cambia solo. Las filas manuales se cargan desde un archivo versionado.
- RN-7: El informe no contiene secretos, llaves, tokens ni datos personales (`AGENTS.md` §11).

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Un ataque prospera | La suite falla y el informe lo marca *falló* | — (no hay usuario final) |
| Amenaza sin prueba (CA-5) | La suite falla | — |
| Nodo de la red local caído | La suite falla con la causa; no se omiten los ataques de contrato en silencio | — |
| Prueba inestable | Se corrige la causa; no se reintenta hasta que pase | — |

## 5. Fuera de alcance de esta HU

- Pruebas de carga y rendimiento → PB-06 (Reserva).
- Pentest externo, análisis estático de seguridad de terceros o auditoría del contrato por terceros.
- Ataques de denegación de servicio (fuera del modelo de amenazas).
- Nuevas defensas: si un ataque prospera, la corrección va en la historia dueña de esa capa.

## 6. Dependencias

- HU / PB: todas las que construyen una defensa (HU-01, HU-02, HU-08, HU-09, HU-10, HU-12, HU-19, HU-22, HU-23, HU-24, HU-29) y las de S4 que agregan ataques (HU-20, HU-25, HU-27, HU-28).
- Decisiones abiertas que la afectan: **D-15** (que el docente acepte el criterio de RN-1).
- Requiere confirmación humana en el plan (`AGENTS.md` §14) solo si hay que modificar un workflow de CI (por ejemplo, para que la app o los contratos corran ataques que hoy no corren).
- Si HU-25 pasa a Reserva, sus filas salen de RN-2 (A-07 verificaciones fallidas repetidas, A-10 colusión detectada) y esas amenazas se cubren con los ataques existentes.

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Informe con 13 de 13 amenazas bloqueadas en CI y lista manual del teléfono completa.
- [ ] PR revisado por otro integrante.
- [ ] CI en verde (lint, pruebas, build y la suite).
- [ ] Correctitud · Eficiencia (< 15 min) · Fiabilidad · Mantenimiento · Seguridad e integridad · Portabilidad (corre con Docker).
- [ ] Esta spec refleja lo realmente construido.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-15 | Creación (borrador) | 2026-11-15 · Specs del Sprint 4 en borrador y decisiones D-29 a D-31 |
| 2026-11-15 | Aprobada por el PO | 2026-11-15 · Specs del Sprint 4 aprobadas |
