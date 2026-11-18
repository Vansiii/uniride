# HU-31 · Accesibilidad: modo oscuro, tamaño de texto y contraste — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-17)` · Épica: E8 Experiencia · Prioridad: Could · PHU: 3 · Sprint: S4 (hasta vie 20/11/2026)
> Requisito del docente que cubre: **4 — Interfaz muy navegable e intuitiva**
> Amenazas que toca: ninguna

## 1. Historia

**Como** usuario de la app
**quiero** elegir modo oscuro, tamaño de texto y alto contraste
**para** usarla cómodamente, de día o de noche y con poca vista.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | la app en **Perfil → Apariencia** | la abro | veo tres opciones: **Tema** (Automático, Claro, Oscuro), **Tamaño de texto** (Normal, Grande, Muy grande) y **Alto contraste** (activar o no) |
| CA-2 | elijo «Oscuro» | confirmo | todas las pantallas de la app pasan a los colores oscuros del sistema de diseño, al instante y sin reiniciar |
| CA-3 | elijo «Automático» | el teléfono cambia de claro a oscuro | la app lo sigue |
| CA-4 | elijo «Grande» o «Muy grande» | confirmo | todo el texto crece (×1,15 y ×1,3) y ningún texto ni botón queda cortado ni superpuesto en las pantallas del flujo principal (buscar, reservar, abordar, billetera) |
| CA-5 | activo «Alto contraste» | confirmo | los textos y bordes cumplen contraste ≥ **7:1** (AAA) y los controles tienen borde visible |
| CA-6 | cierro y vuelvo a abrir la app | la abro | conserva mis tres elecciones |
| CA-7 | tema oscuro activo | veo las pantallas del flujo principal | texto sobre fondo con contraste ≥ **4,5:1** (3:1 en texto grande e íconos) |
| CA-8 | tema oscuro | veo el mapa | el mapa sigue legible; no se exige mapa oscuro |
| CA-9 | cualquier ajuste | lo uso con TalkBack | cada opción se lee con su nombre y su estado («Tema oscuro, seleccionado») |
| CA-10 | una elección inválida guardada (dato corrupto) | abro la app | vuelve a Automático / Normal / sin alto contraste sin fallar |

## 3. Reglas de negocio

- RN-1: Se guarda **solo en el teléfono**; no viaja al servidor ni depende de la cuenta.
- RN-2: Por defecto: Automático, Normal, sin alto contraste.
- RN-3: Los colores oscuros son los **ya definidos** en `DESIGN_SYSTEM.md` §5 (columna «Oscuro»); esta HU los activa, no inventa una paleta nueva.
- RN-4: Los avisos de dinero y las confirmaciones con huella se ven igual de claros y planos en cualquier tema (no se oculta información por estilo).
- RN-5: La app respeta además el tamaño de fuente del sistema Android; el tamaño elegido se aplica sobre él con un tope de ×1,5 para no romper el diseño.
- RN-6: Cambiar el ajuste nunca borra datos ni cierra la sesión.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje (clave es-BO) |
|---|---|---|
| No se puede guardar la elección | Se aplica en la sesión y se avisa que no se conservará | `comun.apariencia.no_guardada` |
| Dato guardado inválido (CA-10) | Valores por defecto | — |
| Texto muy grande en pantalla chica | Permite desplazar; nada queda inaccesible | — |

## 5. Fuera de alcance de esta HU

- Modo oscuro del panel web (se deja en claro; solo la app móvil).
- Mapa en tema oscuro.
- Otros ajustes (movimiento reducido, daltonismo, idiomas).
- Sincronizar la preferencia entre dispositivos.

## 6. Dependencias

- `DESIGN_SYSTEM.md` §5 (tokens oscuros), §14 (accesibilidad) y `mobile/app.json` (`userInterfaceStyle`, hoy `light`).
- Decisiones abiertas: «Accesibilidad: TalkBack no lee los `Aviso`» (HEARTBEAT) se aborda en CA-9 solo para los ajustes; el resto sigue pendiente.

## 7. Definition of Done

- [ ] Todos los criterios cumplidos; capturas de las pantallas del flujo principal en oscuro, texto muy grande y alto contraste.
- [ ] Pruebas automatizadas del plan en verde (elección, persistencia, valores por defecto, contraste calculado de los tokens).
- [ ] CI en verde en `mobile/`.
- [ ] Visto en el teléfono físico (oscuro, grande y TalkBack).
- [ ] Spec refleja lo construido; aceptada por el PO.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-17 | Creación (borrador) | pendiente |
| 2026-11-17 | Aprobada por el PO | pendiente |
