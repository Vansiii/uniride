# DESIGN_SYSTEM.md — Sistema de diseño de UniRide

> Contrato de diseño de la app móvil (`mobile/`) y de los paneles web (`web/`). Define la identidad visual, los tokens, la navegación, los componentes, los estados y la microcopia. Lo leen las personas del equipo y los agentes antes de diseñar o implementar cualquier pantalla.
>
> **Jerarquía.** Este documento no decide alcance, seguridad ni reglas de negocio. Ante un conflicto, gana `AGENTS.md` (alcance y seguridad), después `SPECS/constitution.md`, `SPECS/ssd.md` y el `spec.md` de la historia (comportamiento). Este documento manda en **cómo se ve y cómo se usa** lo que esas fuentes definen.
>
> **Leyenda de estado** (se usa en todo el documento):
>
> | Marca | Significado |
> |---|---|
> | **[Existe]** | Verificado en el código o en los documentos del repositorio al 16/10/2026. |
> | **[Propuesta]** | Decisión de diseño de este documento, coherente con las fuentes. Rige desde ya, pero el equipo la valida en PB-03 (prototipo Figma) y puede cambiarla siguiendo la sección 15. |
> | **[Abierto]** | No se puede decidir sin el equipo o sin una dependencia nueva. Listado en la sección 17. |

---

## Índice

1. [Visión general](#1-visión-general-overview)
2. [Principios de diseño](#2-principios-de-diseño-design-principles)
3. [Identidad visual](#3-identidad-visual-visual-identity)
4. [Tokens de diseño](#4-tokens-de-diseño-design-tokens)
5. [Layout y diseño adaptable](#5-layout-y-diseño-adaptable-layout--responsive-design)
6. [Arquitectura de información](#6-arquitectura-de-información-information-architecture)
7. [Patrones de navegación](#7-patrones-de-navegación-navigation-patterns)
8. [Biblioteca de componentes](#8-biblioteca-de-componentes-component-library)
9. [Diseño de interacción](#9-diseño-de-interacción-interaction-design)
10. [Patrones de pantallas y flujos](#10-patrones-de-pantallas-y-flujos-screen--flow-patterns)
11. [Estados de la interfaz](#11-estados-de-la-interfaz-ui-states)
12. [Accesibilidad](#12-accesibilidad-accessibility)
13. [Contenido y microcopia](#13-contenido-y-microcopia-content--microcopy)
14. [Guía de implementación](#14-guía-de-implementación-implementation-guidelines)
15. [Gobernanza](#15-gobernanza-governance)
16. [Checklist de calidad](#16-checklist-de-calidad-quality-checklist)
17. [Pendientes e incertidumbres](#17-pendientes-e-incertidumbres)

---

## 1. Visión general (Overview)

### 1.1 Producto

UniRide es una plataforma de **carpooling para organizaciones** (universidades y empresas). Los miembros verificados publican, buscan y reservan viajes **programados** con gente de su comunidad. Cada viaje se verifica al subir y al bajar con un código QR firmado por los dos teléfonos, y el pasaje queda **en garantía** al reservar; el conductor cobra solo cuando el servidor comprueba que el viaje ocurrió. **[Existe]** (`AGENTS.md` §1, `SPECS/mision.md`).

Mecanismo que la interfaz debe hacer visible: **la voz agiliza, la biometría autoriza, el código QR prueba y el contrato paga.**

### 1.2 Clientes y personas usuarias

| Cliente | Quién lo usa | Tareas frecuentes | Contexto de uso |
|---|---|---|---|
| App móvil (Android, Expo) | Pasajero y conductor (la misma persona puede ser ambos) | Buscar y reservar viaje, abordar (QR), consultar saldo, publicar viaje | De pie, en la calle, apurado, con una mano, a veces con sol directo o ruido; necesita voz |
| Panel web (React + Vite) | Administrador de organización | Aprobar solicitudes, definir dominios y modo de aprobación | Escritorio o laptop, sesiones cortas y repetitivas |
| Panel web | Super administrador (equipo UniRide) | Dar de alta organizaciones e invitar a su administrador | Escritorio, uso esporádico |

Personas de referencia [Propuesta]: (1) **estudiante pasajero** que nunca usó una billetera digital y no sabe qué es blockchain; (2) **empleado conductor** que quiere publicar su trayecto diario en menos de un minuto; (3) **administrador** no técnico de una facultad o empresa. Si una pantalla no la entiende la persona (1) sin ayuda, no está terminada.

### 1.3 Alcance de este sistema

Cubre las dos interfaces de usuario (`mobile/`, `web/`) y los textos que muestran. No cubre la API, los contratos ni los correos (estos siguen solo la sección 13 de tono).

### 1.4 Estado actual verificado (16/10/2026)

| Elemento | Estado | Evidencia |
|---|---|---|
| Pantallas implementadas | Solo marcadores de posición: nombre y eslogan | `mobile/src/app/index.tsx`, `web/src/App.tsx` |
| Navegación móvil | `expo-router` con `Stack` sin encabezado | `mobile/src/app/_layout.tsx` |
| Navegación web | Ninguna (react-router-dom aprobado en el plan de HU-06, sin instalar) | `web/package.json`, `.agents/MEMORY/MEMORY.md` |
| Estilos | `StyleSheet.create` con objeto `estilos` (móvil); CSS plano con `system-ui` y `color-scheme: light dark` (web) | `mobile/src/app/index.tsx`, `web/src/index.css` |
| Tokens, tema, componentes reutilizables | No existen | — |
| Textos | `t('modulo.pantalla.elemento')` sobre `es-BO.json`, sin librería | `mobile/src/i18n`, `web/src/i18n` |
| Accesibilidad | `accessibilityRole="header"` en el título; las pruebas buscan por rol | `mobile/src/__tests__/inicio.test.tsx` |
| Iconos | `expo-symbols` 57 instalado (Material Symbols en Android y web) | `mobile/package.json` |
| Selector de fecha | `@expo/ui` 57 instalado (incluye `DatePicker` de Jetpack Compose) | `mobile/node_modules/@expo/ui/build/jetpack-compose` |
| Modo de color | `userInterfaceStyle: automatic` (móvil); `color-scheme: light dark` (web) | `mobile/app.json`, `web/src/index.css` |
| Marca | Aprobada el 16/10/2026 (3.4); aplicada en `feat/PB-03-marca` de `mobile/` y `web/`, pendiente de fusionar | `marca/`, `mobile/app.json`, `web/public/favicon.svg` |
| Prototipo | Navegable en HTML con las 26 vistas de S1 (16 móviles, 10 web), con la propuesta de zonas de marca (3.5); se abre en cualquier navegador. Falta el del flujo principal (SP18) | [`prototipos/sprint-1.html`](prototipos/sprint-1.html), `.agents/STEERING/backlog.md` |

Consecuencia: casi todo lo visual de este documento es **[Propuesta]**. Se escribió antes de que existan pantallas para que la primera pantalla real ya nazca coherente.

### 1.5 Restricciones que condicionan el diseño

| Restricción | Fuente | Impacto en el diseño |
|---|---|---|
| Flujo principal (buscar, reservar, abordar, pagar) en **4 pasos o menos** | `AGENTS.md` §10 | Presupuesto de pasos fijo (sección 10.2) |
| **SUS ≥ 75** con 5 usuarios ajenos al equipo | HU-30 | La claridad prima sobre la estética |
| **Voz en español** para las acciones frecuentes; nunca es la única vía | Constitución Art. 5 | Botón de voz en posición fija; toda acción tiene alternativa táctil |
| **La voz nunca autoriza**; mover dinero o verificar un viaje pide biometría | A-11, HU-29 | Patrón de confirmación biométrica (9.6) |
| **El teléfono nunca decide** | `AGENTS.md` §5.1 | La interfaz no calcula montos ni estados: muestra lo que responde el servidor; sin actualizaciones optimistas de dinero o estado |
| Blockchain asíncrona: la app muestra **"pendiente"** | `AGENTS.md` §5.8 | Estado *pendiente* de primera clase (11) |
| Textos solo en `es-BO.json` | Constitución Art. 8 | Ningún texto literal en componentes |
| Datos sensibles (carnet, rostro, foto del vehículo) nunca en la API | `AGENTS.md` §11, D-20 | Sin fotos de personas ni de vehículos en la interfaz de terceros; avatares con iniciales |
| Sin dependencias nuevas sin aprobación | `AGENTS.md` §14 | Se usa lo instalado y las APIs nativas; lo que falta queda **[Abierto]** |
| Android físico como plataforma de demostración, orientación vertical | `mobile/app.json`, documento técnico §1.9 | Diseño móvil vertical, Material Symbols, tamaños en dp |
| Solo red de prueba; el URC no tiene valor real | `AGENTS.md` §11 | La billetera lo dice explícitamente (10.6) |

---

## 2. Principios de diseño (Design Principles)

Cada principio tiene una regla verificable. Si dos principios chocan, gana el de número menor.

| # | Principio | Regla operativa | Ejemplo correcto | Ejemplo incorrecto |
|---|---|---|---|---|
| P1 | **Seguridad comprensible** | Toda acción que mueve dinero o verifica un viaje muestra antes **qué pasa, cuánto y qué se puede deshacer**, y se confirma con biometría. | Botón "Reservar y pagar 12,00 URC" con ícono de huella, y debajo: "Tu pago queda en garantía hasta que el viaje se verifique." | Botón "Confirmar" que abre la huella sin decir el monto. |
| P2 | **Una tarea por pantalla** | Cada pantalla tiene un objetivo nombrable en un verbo y **una sola acción primaria visible**. | "Buscar viaje": un formulario y un botón Buscar. | Pantalla de inicio con buscar, publicar, recargar y saldo con el mismo peso. |
| P3 | **El servidor es la verdad** | La interfaz muestra estados y montos que responde la API. Nunca los infiere ni los adelanta. | Tras reservar, la tarjeta pasa a "Reservado" cuando la API lo confirma. | Marcar "Pagado" en la app antes de que la API lo diga. |
| P4 | **Reconocer antes que recordar** | Lo necesario para decidir está en pantalla: hora, origen, destino, precio, asientos, organización activa, saldo. | En la confirmación de reserva se ve el saldo que quedará disponible. | Pedir que la persona recuerde su saldo de otra pantalla. |
| P5 | **Estados siempre visibles** | Todo lo asíncrono (red, blockchain, verificación) tiene un estado con texto: cargando, pendiente, listo, error. | "Pago pendiente de confirmación · puede tardar unos minutos". | Un spinner sin texto que no termina. |
| P6 | **Explicar, no culpar** | Cada error dice qué pasó y qué hacer, en lenguaje cotidiano. | "Estás a más de 50 m del conductor. Acércate y vuelve a escanear." | "Error 422: DISTANCIA_EXCEDIDA". |
| P7 | **Táctil primero, voz como atajo** | Todo comando de voz lleva a la misma pantalla que su alternativa táctil. La voz navega y prepara; nunca confirma. | "Reserva el primero" abre la confirmación de reserva con la huella. | Una reserva que solo se puede hacer por voz. |
| P8 | **Carpooling, no taxi** | Los viajes son programados, con conductor de la comunidad, precio fijo y punto de encuentro. La lista de viajes es el centro, no el mapa. | Resultados como lista de tarjetas ordenadas por hora de salida. | Mapa a pantalla completa con autos moviéndose y un botón "Pedir ahora". |
| P9 | **Consistencia antes que novedad** | Un problema, un componente. Antes de crear un patrón, buscarlo en la sección 8. | Todos los estados usan `EtiquetaEstado`. | Un chip distinto para cada pantalla. |
| P10 | **Expresiva en la marca, sobria en el dinero** | La expresión visual (banda de marca, degradado, ilustración, tipografía display) vive solo en las **zonas de marca** (3.5): encabezados de pantallas raíz, inicio de sesión, resultados, estados vacíos y de espera. Formularios, montos, confirmaciones con biometría y tablas quedan planos. Sin librerías de UI; animaciones solo para explicar un cambio. | Banda índigo con saludo y organización en Buscar; formulario de reserva blanco y plano debajo. | Degradado detrás del botón "Reservar y pagar"; efectos de vidrio; ilustración en un diálogo de cancelación. |

---

## 3. Identidad visual (Visual Identity)

### 3.1 Dirección estética [Propuesta]

**"Confianza en movimiento"**: una sola tonalidad de marca, el índigo, **usada con audacia en tres profundidades** (`marcaProfundo`, `primario`, `marcaBrillante`) en las zonas de marca, y superficies blancas y planas donde la persona decide. El color semántico sigue reservado para comunicar estado. La interfaz debe sentirse **seria con el dinero, cercana con las personas y rápida en la calle** (revisión del 17/10/2026, ver 3.5).

| Rasgo | Se expresa con | Se evita |
|---|---|---|
| Confiable | Azul índigo sobrio, jerarquía tipográfica clara, montos con dos decimales y unidad | Colores saturados múltiples, lenguaje de marketing |
| Cercano | Microcopia en tuteo, iniciales en lugar de fotos, nombres de lugares de la comunidad | Tono burocrático o técnico |
| Eficiente | Pantallas cortas, acción primaria abajo al alcance del pulgar, datos clave en tamaño grande | Pasos de "bienvenida" innecesarios, carruseles |
| Comunitario | Nombre de la organización activa siempre visible | Identidad genérica de "app de transporte" |

### 3.2 Motivos visuales propios [Propuesta]

1. **Línea de trayecto.** Un punto relleno (origen), una línea vertical y un punto con contorno (destino). Se usa igual en tarjetas de viaje, detalle, publicación y confirmaciones. Es el elemento que identifica a UniRide; no se usan flechas "A → B" en su lugar.
2. **Sello de verificación.** El ícono `verified` + la palabra "Verificado" en color de éxito. Se usa solo donde aporta confianza (perfil, detalle del viaje, resultado del abordaje), no en cada tarjeta: todo el que puede viajar ya está verificado y repetirlo es ruido.
3. **Candado de garantía.** El ícono `lock` acompaña siempre al dinero retenido en garantía (escrow).

### 3.3 Diferenciación

- No se copian identidades de apps de carpooling o transporte existentes: no se usa verde azulado oscuro ni celeste como color de marca, ni negro absoluto como base.
- El índigo no se usa para estados: así "azul" significa siempre "acción de UniRide", y el color semántico no compite con la marca.

### 3.4 Marca [Existe — aprobada por el PO el 16/10/2026]

Archivos fuente en [`marca/`](marca/) (SVG, vista previa en `marca/vista-previa.png`). Aplicada en la rama `feat/PB-03-marca` de `mobile/` (íconos de Android, splash y favicon en `assets/images/`, color `#3447CC` en `app.json`) y de `web/` (`public/favicon.svg`). El ícono de iOS (`assets/expo.icon`) sigue siendo el de la plantilla: iOS no es plataforma de demostración.

**Concepto.** La línea de trayecto (3.2) dibuja una **U**: sale de un punto relleno (origen), baja, gira y sube hasta un anillo (destino). Se lee como "U" de UniRide y de universidad, y como un viaje de ida a un destino compartido. En el logotipo, los puntos de las dos "i" repiten el motivo: el de "Uni" es relleno (origen) y el de "Ride" es un anillo (destino).

| Pieza | Archivo | Uso |
|---|---|---|
| Isotipo | `isotipo.svg` · `isotipo-blanco.svg` | Espacios pequeños, avatar de la organización UniRide, encabezados móviles |
| Ícono de app | `icono-app.svg` | Base del ícono de Android, splash y favicon (fondo `primario`, isotipo blanco) |
| Logotipo | `logotipo.svg` · `logotipo-blanco.svg` | Texto "UniRide" solo: pantalla de inicio de sesión, correos |
| Firma horizontal | `firma-horizontal.svg` · `firma-horizontal-blanco.svg` | Barra lateral del panel web, documentos, presentaciones |

Construcción: trazo monolineal de grosor constante con extremos redondeados (logotipo: trazo 6 sobre altura de mayúscula 40; isotipo: trazo 6 sobre una cuadrícula de 48 con puntos de diámetro 12). Las letras están dibujadas como trazos, no dependen de ninguna fuente.

Reglas de uso:

- Colores permitidos: isotipo en `primario` con logotipo en `texto` (fondo claro); todo en blanco sobre `primario` o sobre `fondo` oscuro. No se usan degradados, sombras, contornos ni otros colores.
- Zona de protección: alrededor de la pieza, como mínimo la altura de la "n" (22 unidades).
- Tamaño mínimo: isotipo 16 px; logotipo 80 px de ancho; firma horizontal 120 px de ancho.
- No se deforma, no se rota, no se separa el anillo de la U ni se reemplazan los puntos de las "i" por puntos comunes.
- Ícono adaptativo de Android: fondo `primario` liso; primer plano y versión monocroma con el isotipo dentro del círculo seguro de 66/108. Si cambia la marca, se vuelven a exportar todos los PNG de `mobile/assets/images/` desde los SVG de `marca/`, nunca se editan a mano.

### 3.5 Zonas de marca [Propuesta — aprobada por el PO el 17/10/2026]

Origen: en la revisión del prototipo de S1 (PB-03), el PO pidió una interfaz "más llamativa". La respuesta es concentrar la expresión en lugares acotados, sin tocar las pantallas donde se mueve dinero o se verifica un viaje (P1, P10).

| Zona | Dónde | Qué se permite |
|---|---|---|
| **Banda de marca** | Encabezado de las pantallas raíz (Buscar, Mis viajes, Publicar, Billetera, Perfil), inicio de sesión y registro | Fondo `degradadoMarca`, texto `sobreMarca`, título en `display`, ilustración de trayecto de fondo al 12 % de opacidad. Esquinas inferiores `radio.xl` |
| **Escena de resultado** | Pantallas de resultado, estado de membresía, estados vacíos | `Ilustracion` de trayecto (8.12) a 160 dp de alto y animación de entrada del ícono (4.7) |
| **Panel de marca (web)** | Mitad izquierda de inicio de sesión y de aceptar invitación; `BarraLateral` | Fondo `marcaProfundo`, texto `sobreMarca`, ítem activo `marcaBrillante` |
| **Tarjeta destacada** | Viaje activo anclado (N7) y saldo de la billetera | Fondo `marcaProfundo` con cifras en `display`; es la única tarjeta oscura de la pantalla |

Fuera de esas zonas todo sigue igual: fondo blanco, tarjetas con borde, sin degradados. **Nunca** hay banda, degradado ni ilustración en una pantalla de confirmación con biometría, un `Dialogo`, una tabla del panel o un formulario de dinero.

---

## 4. Tokens de diseño (Design Tokens)

Reglas generales:

- Los componentes y pantallas consumen **solo tokens semánticos**. Nunca un hexadecimal, un tamaño de letra o un margen literal (excepciones: `0`, `1` para líneas finas y valores de `flex`).
- Los nombres son los mismos en las dos plataformas: `camelCase` en TypeScript (`textoSecundario`), `kebab-case` con prefijo en CSS (`--color-texto-secundario`).
- Unidades: dp en móvil (números de React Native), `px`/`rem` en web con base 16 px.

### 4.1 Color

#### 4.1.1 Tokens semánticos [Propuesta]

Contraste calculado con la fórmula WCAG 2.2 sobre el fondo indicado.

| Token | Claro | Oscuro (HU-31) | Uso | Contraste (claro) |
|---|---|---|---|---|
| `fondo` | `#FFFFFF` | `#0F1218` | Fondo de pantalla y de página | — |
| `fondoSutil` | `#F6F7F9` | `#14171E` | Área de contenido del panel web, cabecera de tablas, grupos | — |
| `superficie` | `#FFFFFF` | `#181C24` | Tarjetas, campos, barras | — |
| `superficieElevada` | `#FFFFFF` | `#20252F` | Diálogos, hojas inferiores, menús | — |
| `borde` | `#DDE1E8` | `#2C323D` | Separadores y contorno de tarjetas (decorativo) | — |
| `bordeCampo` | `#7A8396` | `#6F788A` | Contorno de campos, casillas y controles | 3,81 : 1 (≥ 3) |
| `texto` | `#1A1F27` | `#E7EAF0` | Texto principal | 16,55 : 1 |
| `textoSecundario` | `#535B6C` | `#A3ABBA` | Metadatos, ayudas, etiquetas | 6,82 : 1 (6,36 sobre `fondoSutil`) |
| `textoPlaceholder` | `#6B7385` | `#8E97A8` | Solo marcador de posición dentro de campos (fondo `superficie`) | 4,76 : 1 |
| `textoDeshabilitado` | `#8F98A8` | `#5B6475` | Texto de controles deshabilitados (exento de contraste en WCAG) | 2,91 : 1 |
| `fondoDeshabilitado` | `#EEF0F4` | `#232833` | Relleno de botones deshabilitados | — |
| `primario` | `#3447CC` | `#8B9BFF` | Acción principal, enlaces, selección, foco | 7,19 : 1 |
| `primarioPresionado` | `#2A39A6` | `#A9B5FF` | Botón primario presionado o con cursor encima | — |
| `sobrePrimario` | `#FFFFFF` | `#0F1218` | Texto e íconos sobre `primario` | 7,19 : 1 |
| `primarioSuave` | `#EEF1FF` | `#232A55` | Fondo de estados informativos y elementos seleccionados | — |
| `primarioTexto` | `#2A39A6` | `#C9D1FF` | Texto sobre `primarioSuave` | 8,35 : 1 |
| `exito` | `#15803D` | `#4ADE80` | Íconos y texto de éxito sobre `fondo` | 5,02 : 1 |
| `exitoSuave` | `#E9F7EE` | `#12301F` | Fondo de estados de éxito | — |
| `exitoTexto` | `#166534` | `#B7F5CC` | Texto sobre `exitoSuave` | 6,45 : 1 |
| `aviso` | `#B26B00` | `#FBBF24` | **Solo íconos y bordes** de advertencia (no texto) | 4,20 : 1 (≥ 3) |
| `avisoSuave` | `#FFF4DB` | `#33260A` | Fondo de advertencias | — |
| `avisoTexto` | `#8A5300` | `#FDE7B0` | Texto de advertencia sobre `avisoSuave` o `fondo` | 5,79 : 1 |
| `peligro` | `#B42318` | `#FF8A80` | Errores, acciones destructivas | 6,57 : 1 |
| `peligroPresionado` | `#912018` | `#FFB4AB` | Botón de peligro presionado | — |
| `sobrePeligro` | `#FFFFFF` | `#0F1218` | Texto sobre `peligro` | 6,57 : 1 |
| `peligroSuave` | `#FDECEA` | `#3A1512` | Fondo de errores | — |
| `peligroTexto` | `#912018` | `#FFD3CE` | Texto sobre `peligroSuave` | 7,58 : 1 |
| `foco` | `#3447CC` | `#8B9BFF` | Anillo de foco (web) | 7,19 : 1 |
| `superposicion` | `rgba(15,18,24,0.5)` | `rgba(0,0,0,0.6)` | Capa detrás de diálogos y hojas | — |
| `marcaProfundo` | `#1D2763` | `#1D2763` | **Solo zonas de marca (3.5):** panel web, tarjeta destacada, final del degradado | — |
| `degradadoMarca` | `#3447CC → #1D2763` a 160° | igual | **Solo** fondo de la banda de marca | — |
| `sobreMarca` | `#FFFFFF` | `#FFFFFF` | Texto e íconos sobre `marcaProfundo` o `degradadoMarca` | 13,8 : 1 (7,19 en el extremo claro) |
| `sobreMarcaSecundario` | `#C9D1FF` | `#C9D1FF` | Texto secundario en zonas de marca | 9,2 : 1 (4,8 en el extremo claro) |
| `marcaBrillante` | `#8B9BFF` | `#8B9BFF` | Acento sobre `marcaProfundo`: ítem activo de la barra lateral, trazo de ilustraciones, indicadores | 5,41 : 1 sobre `marcaProfundo` |
| `marcaVelo` | `rgba(255,255,255,0.14)` | igual | Chips y botones de ícono dentro de la banda (organización activa, voz) | — |

Las zonas de marca se ven **igual en los dos temas**: son identidad, no superficie. Por eso sus tokens no cambian en oscuro.

Reglas de uso:

1. **Información = primario.** No hay un azul "info" distinto: los avisos informativos usan `primarioSuave` + `primarioTexto`.
2. **El color nunca es la única señal.** Todo estado lleva texto y, si cabe, ícono.
3. **`textoPlaceholder` solo sobre `superficie`.** Sobre `fondoSutil` no alcanza 4,5 : 1 (4,44 : 1); por eso los campos siempre son blancos.
4. **`aviso` no se usa para texto.** Para texto de advertencia, `avisoTexto`.
5. **Rojo solo para errores y destrucción.** Un monto que sale de la billetera no es un error: va en `texto` con signo menos.
6. **Los códigos QR se dibujan negro sobre blanco** en los dos temas, con zona de silencio de 4 módulos.
7. **Modo oscuro:** los valores quedan definidos para que HU-31 (*Could*, Reserva) solo active el cambio. Hasta entonces la interfaz es **solo clara** (ver 14.4).

#### 4.1.2 Estado → color [Propuesta]

Mapeo único para todas las pantallas. `EtiquetaEstado` (8.3) lo implementa; nadie elige colores de estado a mano.

| Dominio | Estado (API) | Etiqueta visible | Tono | Ícono |
|---|---|---|---|---|
| Viaje | `Publicado` | Publicado | neutro | `event_available` |
| Viaje | `Reservado` | Reservado | primario | `confirmation_number` |
| Viaje | `En curso` | En curso | primario (relleno) | `directions_car` |
| Viaje | `Verificado` | Verificado | éxito | `verified` |
| Viaje | `Pagado` | Pagado | éxito | `check_circle` |
| Viaje | `Cancelado` | Cancelado | neutro | `block` |
| Viaje | `Expirado` | Expirado · reembolsado | aviso | `schedule` |
| Membresía | `pendiente` | Pendiente de aprobación | aviso | `hourglass_top` |
| Membresía | `aprobada` | Aprobada | éxito | `check_circle` |
| Membresía | `rechazada` | Rechazada | peligro | `cancel` |
| Movimiento | `pendiente` | Pendiente | neutro | `hourglass_top` |
| Movimiento | `confirmado` | — (no se muestra etiqueta: es el caso normal) | — | — |
| Movimiento | `fallido` | No se completó | peligro | `error` |
| Identidad / teléfono | verificado | Verificado | éxito | `verified` |

Tonos: **neutro** = `fondoSutil` + `textoSecundario` + borde `borde`; **primario** = `primarioSuave` + `primarioTexto`; **primario (relleno)** = `primario` + `sobrePrimario` (solo para el viaje en curso, el estado más importante); **éxito**, **aviso**, **peligro** = su `*Suave` + su `*Texto`.

#### 4.1.3 Primitivos de referencia

Solo para construir los semánticos; no se usan en componentes.

| Familia | 50 | 100 | 300 | 500 | 600 | 700 | 900 |
|---|---|---|---|---|---|---|---|
| Índigo (marca) | `#EEF1FF` | `#DDE4FF` | `#93A5FB` | `#4A5FE6` | `#3447CC` | `#2A39A6` | `#1D2763` |
| Neutro | `#F6F7F9` | `#EEF0F4` | `#C3C9D4` | `#6B7385` | `#535B6C` | `#3E4553` | `#1A1F27` |

### 4.2 Tipografía [Propuesta]

**Familia:** la del sistema. En Android, Roboto (no se fija `fontFamily`). En web, la pila existente ampliada: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` **[Existe parcialmente]**. Razones: cero dependencias, carga instantánea, familiaridad nativa y buen soporte de tildes y ñ. Una fuente de marca propia solo entra por la sección 15.

**Familia display [Propuesta — aprobada por el PO el 17/10/2026]:** *Bricolage Grotesque* (licencia SIL OFL 1.1, compatible con la Ley N.º 1322), pesos 700 y 800, **solo** para los tokens `pantalla`, `cifra` y los títulos de las zonas de marca. Todo lo demás sigue en la fuente del sistema. Se incluye como archivo de fuente, sin paquete npm nuevo: en móvil, el `.ttf` en `assets/fonts/` cargado con `expo-font` [Existe, instalado]; en web, el `.woff2` en `public/fuentes/` con `@font-face` y `font-display: swap`. Si la fuente no carga, se usa la del sistema sin romper el diseño. Razón: le da a UniRide una voz propia en los títulos y en el saldo sin afectar la lectura de formularios.

**Cifras:** horas, montos, códigos y conteos usan cifras tabulares (`fontVariant: ['tabular-nums']` / `font-variant-numeric: tabular-nums`) para que no "bailen" al cambiar.

| Token | Tamaño / interlineado | Peso | Uso | No usar para |
|---|---|---|---|---|
| `pantalla` | 28 / 36 | 700 | Título de una pantalla raíz o de un resultado ("Abordaje verificado"). Uno por pantalla | Títulos de tarjeta |
| `titulo` | 22 / 28 | 600 | Título de pantalla de flujo y de página web; hora de salida en `TarjetaViaje` | Párrafos |
| `subtitulo` | 18 / 24 | 600 | Título de sección, de tarjeta y de diálogo | — |
| `cuerpo` | 16 / 24 | 400 | Texto base, contenido de campos | — |
| `cuerpoEnfasis` | 16 / 24 | 600 | Etiquetas de botón, valores clave (precio, destino) | Bloques largos |
| `secundario` | 14 / 20 | 400 | Metadatos, ayudas de campo, celdas de tabla | Información imprescindible para decidir |
| `etiqueta` | 14 / 20 | 500 | Etiqueta de campo, encabezado de tabla, pestañas | — |
| `pequeno` | 12 / 16 | 500 | Texto de `EtiquetaEstado`, notas legales | Cualquier dato que la persona necesite para actuar |
| `cifra` | 34 / 40 | 700 | Saldo de la billetera, código de 6 dígitos | Precios en listas |

Reglas:

- Tamaño mínimo absoluto: **12**. Información para decidir: **14 o más**.
- Mayúscula solo inicial ("Publicar viaje"), nunca TODO MAYÚSCULAS salvo placas y siglas.
- Largo de línea en web: máximo **70 caracteres** en párrafos (`max-width: 70ch`).
- El texto respeta el tamaño de fuente del sistema (`allowFontScaling` queda en su valor por defecto, `true`). Ver 12.3.

### 4.3 Espaciado [Propuesta]

Escala de base 4. Token = `espacio[n]`, donde el valor es `n × 4`.

| Token | Valor | Uso típico |
|---|---|---|
| `espacio[1]` | 4 | Separación entre ícono y texto en una etiqueta |
| `espacio[2]` | 8 | Ícono–texto en botones y filas; entre etiqueta y campo |
| `espacio[3]` | 12 | Entre líneas de contenido de una tarjeta |
| `espacio[4]` | 16 | **Margen lateral de pantalla móvil** [Existe: `padding: 16` en `index.tsx`]; relleno de tarjeta; entre campos |
| `espacio[5]` | 20 | Relleno de diálogos |
| `espacio[6]` | 24 | Entre secciones de una pantalla; relleno de página web compacta |
| `espacio[8]` | 32 | Entre grupos grandes; relleno de página web amplia |
| `espacio[10]` | 40 | Separación antes de un estado vacío |
| `espacio[12]` | 48 | Margen superior de pantallas de resultado |
| `espacio[16]` | 64 | Solo en estados vacíos y pantallas de resultado |

Regla: el espacio comunica agrupación. Elementos relacionados a 8–12; grupos distintos a 24 o más. No se usan líneas divisorias donde el espacio basta.

### 4.4 Tamaños [Propuesta]

| Token | Móvil | Web | Uso |
|---|---|---|---|
| `tactilMinimo` | 48 | 44 (primario) / 24 mínimo WCAG | Área tocable mínima de cualquier control |
| `altoControl` | 48 | 44 [Existe, 23/10] | Botones y campos. En web subió de 40 a 44 para que toda acción principal cumpla 12.2 sin mezclar alturas |
| `altoControlCompacto` | 40 | 32 | Acciones dentro de filas de tabla o tarjetas densas |
| `altoFila` | 56 | 52 | Filas de lista y de tabla |
| `altoEncabezado` | 56 | 64 | Barra superior |
| `altoBarraPestanas` | 64 + área segura | — | Navegación inferior |
| `anchoBarraLateral` | — | 240 | Navegación lateral del panel |
| `anchoFormulario` | 100 % | 560 máx. | Formularios |
| `anchoContenido` | 100 % | 1200 máx. | Contenido de página |
| `icono` | 16 / 20 / **24** / 48 | igual | 24 por defecto; 16–20 en línea con texto; 48 en estados vacíos y resultados |
| `avatar` | 32 / 40 / 56 | igual | Lista / tarjeta / perfil |
| `codigoQR` | `min(ancho − 32, 320)` | — | QR de abordaje |

### 4.5 Bordes y radios [Propuesta]

| Token | Valor | Uso |
|---|---|---|
| `grosorBorde` | 1 | Tarjetas, separadores, campos en reposo |
| `grosorBordeActivo` | 2 | Campo con foco o con error; anillo de foco web |
| `radio.s` | 8 | Botones compactos, celdas de código OTP |
| `radio.m` | 12 | Botones, campos, avisos |
| `radio.l` | 16 | Tarjetas, diálogos |
| `radio.xl` | 24 | Esquinas superiores de hojas inferiores |
| `radio.completo` | 999 | `EtiquetaEstado`, avatares, chips |

### 4.6 Elevación, sombras y capas [Propuesta]

Diseño plano por defecto: la separación se logra con `borde` y con el contraste `fondoSutil`/`superficie`. La única sombra nueva es la de la tarjeta que **flota sobre una banda de marca** (nivel 0,5), para que se lea como un objeto encima del color.

| Nivel | Uso | Móvil | Web |
|---|---|---|---|
| 0 | Todo por defecto (tarjetas, barras, tablas) | Sin sombra, `borde` de 1 | Sin sombra, `borde` de 1 |
| 0,5 [Propuesta 17/10] | Tarjeta que se superpone 24 dp al borde inferior de una banda de marca (búsqueda en Buscar, datos de cuenta en Perfil) | `elevation: 3`, sin borde | `0 6px 20px rgba(29,39,99,.14)` |
| 1 | Elementos que flotan sobre mapa o cámara | `elevation: 2` | `0 1px 3px rgba(15,18,24,.12)` |
| 2 | Diálogos, hojas inferiores, menús | `elevation: 8` + `superposicion` | `0 8px 24px rgba(15,18,24,.16)` + `superposicion` |

Capas (`z-index`, web): contenido 0 · encabezado fijo 10 · menú desplegable 20 · superposición y diálogo 30 (el `<dialog>` nativo usa la *top layer*) · notificación temporal 40.

### 4.7 Movimiento [Propuesta]

| Token | Valor | Uso |
|---|---|---|
| `duracion.corta` | 100 ms | Cambio de color al presionar |
| `duracion.media` | 200 ms | Aparecer y desaparecer avisos, notificaciones y etiquetas |
| `duracion.larga` | 300 ms | Hojas inferiores, diálogos; transiciones de pantalla (las nativas de `expo-router`) |
| `curva.estandar` | `cubic-bezier(0.2, 0, 0, 1)` | Movimientos dentro de la pantalla |
| `curva.entrada` | `cubic-bezier(0, 0, 0, 1)` | Elementos que entran |
| `curva.salida` | `cubic-bezier(0.3, 0, 1, 1)` | Elementos que salen |

Animaciones con nombre [Propuesta 17/10]: **`entradaResultado`** (el ícono de una pantalla de resultado escala de 0,6 a 1 con `curva.entrada` en `duracion.larga`, una sola vez) y **`trazoIlustracion`** (la línea de trayecto de una `Ilustracion` se dibuja de origen a destino en 600 ms, una sola vez). En móvil se hacen con `react-native-reanimated` [Existe, instalado].

Reglas: la animación explica un cambio de estado o de lugar; nunca decora. Prohibido: bucles decorativos, parallax, confeti, rebotes. Si el sistema pide reducir el movimiento (`AccessibilityInfo.isReduceMotionEnabled()` / `prefers-reduced-motion`), las duraciones pasan a 0, salvo los indicadores de progreso.

### 4.8 Iconografía [Propuesta]

- **Conjunto único: Material Symbols**, estilo *Outlined*, peso 400; versión rellena (*Filled*) solo para la pestaña seleccionada.
- **Móvil:** `SymbolView` de `expo-symbols` [Existe, instalado], con nombre `{ android: '…' }`.
- **Web:** los mismos símbolos como SVG en `web/src/iconos/` (licencia Apache 2.0), sin librería de íconos.
- Un ícono nunca va solo si su significado no es universal: lleva etiqueta visible o, como mínimo, `accessibilityLabel` / `aria-label`.

| Concepto | Símbolo | Concepto | Símbolo |
|---|---|---|---|
| Buscar | `search` | Verificado | `verified` |
| Mis viajes | `route` | En garantía | `lock` |
| Publicar | `add_circle` | Pendiente | `hourglass_top` |
| Billetera | `account_balance_wallet` | Éxito | `check_circle` |
| Perfil | `person` | Error | `error` |
| Voz | `mic` | Advertencia | `warning` |
| Origen | `trip_origin` | Información | `info` |
| Destino | `location_on` | Biometría | `fingerprint` |
| Hora | `schedule` | Mostrar QR | `qr_code_2` |
| Asientos | `airline_seat_recline_normal` | Escanear QR | `qr_code_scanner` |
| Vehículo | `directions_car` | Universidad | `school` |
| Intercambiar origen/destino | `swap_vert` | Empresa | `apartment` |
| Atrás | `arrow_back` | Solicitudes (web) | `how_to_reg` |
| Cerrar | `close` | Afiliación (web) | `alternate_email` |
| Ayuda | `help` | Organizaciones (web) | `corporate_fare` |
| Abrir explorador | `open_in_new` | Cerrar sesión | `logout` |

### 4.9 Formatos de datos [Propuesta]

Una función de formato por tipo, compartida por cada cliente (`src/formato.ts`). Nunca se formatea a mano en una pantalla.

| Dato | Formato | Ejemplo | Implementación |
|---|---|---|---|
| Monto | 2 decimales, separador es-BO + unidad `URC` | `1.234,50 URC` | `Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })` + `' URC'` |
| Monto con signo (historial) | `+` / `−` (signo menos real) | `+50,00 URC`, `−12,00 URC` | — |
| Equivalencia de recarga | Bs → URC | `Pagas 50,00 Bs · recibes 50,00 URC` | Solo en recarga |
| Hora | 24 h, dos dígitos | `07:30`, `19:05` | `Intl.DateTimeFormat('es-BO', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })` |
| Fecha | Relativa si es hoy o mañana; si no, día abreviado | `Hoy`, `Mañana`, `mié 21 oct` | — |
| Tiempo hasta la salida | Solo si falta menos de 60 min | `Sale en 20 min` | — |
| Distancia | m hasta 999; km con un decimal | `350 m`, `1,2 km` | — |
| Placa | Dígitos + espacio + letras | `1234 ABC` (se guarda `1234ABC`) | — |
| Nombre de otra persona | Nombre + inicial del apellido | `Ana R.` [Abierto → P-09] | — |
| Hash o dirección | Inicio y fin, fuente monoespaciada, botón copiar | `0x12ab…9f3c` | — |

Por qué 24 h: "7:00" es ambiguo en un viaje programado (y en el comando de voz "a las 7"); `es-BO` por defecto produce "7:05 p. m.", más largo y menos escaneable. Por qué siempre 2 decimales: coincide con `NUMERIC(12,2)` del libro mayor y evita que "12" y "12,00" parezcan cosas distintas.

---

## 5. Layout y diseño adaptable (Layout & Responsive Design)

### 5.1 App móvil [Propuesta]

- **Orientación vertical** [Existe: `orientation: portrait`]. Ancho de diseño de referencia: **360 dp** (el más pequeño habitual en Android); se prueba también en 412 dp.
- **Áreas seguras:** todo contenido respeta `react-native-safe-area-context` [Existe, instalado]. Nada interactivo bajo la barra de estado ni bajo la barra de gestos.
- Margen lateral **16**. Ancho de contenido = ancho de pantalla − 32.

Anatomía de una pantalla:

```
┌──────────────────────────────┐
│ Encabezado (56)              │  título · atrás · [acción] · [voz]
├──────────────────────────────┤
│                              │
│ Contenido desplazable        │  margen lateral 16
│                              │
├──────────────────────────────┤
│ Zona de acción fija          │  solo en pantallas de flujo:
│ [ Acción primaria ancho 100%]│  1 botón primario (+ 1 de texto)
├──────────────────────────────┤
│ Barra de pestañas (64)       │  solo en las 5 pantallas raíz
└──────────────────────────────┘
```

Reglas:

1. La **acción primaria de un flujo va abajo**, fija, a ancho completo, dentro del alcance del pulgar. Se mantiene visible al abrir el teclado (`KeyboardAvoidingView`).
2. La barra de pestañas solo aparece en las pantallas raíz. Las pantallas de flujo (detalle, confirmación, abordaje) la ocultan para dar foco a la tarea.
3. Ningún texto imprescindible depende de un alto fijo: los contenedores crecen con el texto (12.3).

### 5.2 Panel web [Propuesta]

| Rango | Nombre | Navegación | Tablas | Relleno de página |
|---|---|---|---|---|
| < 640 px | compacto | Barra superior + menú desplegable a pantalla completa | Se convierten en lista de tarjetas | 16 |
| 640–1023 px | medio | Barra superior + menú lateral desplegable | Tabla con columnas secundarias ocultas | 24 |
| ≥ 1024 px | amplio | Barra lateral fija de 240 px | Tabla completa | 32 |

```
┌──────────┬────────────────────────────────────────┐
│ UniRide  │ Título de página           [Acción 1ª] │
│ Org. X   │ Descripción breve                      │
│──────────│────────────────────────────────────────│
│ ● Solic. │                                        │
│   Afil.  │  Contenido (máx. 1200, fondo sutil)    │
│          │  Tarjetas y tablas en `superficie`     │
│──────────│                                        │
│ Nombre   │                                        │
│ Salir    │                                        │
└──────────┴────────────────────────────────────────┘
```

- El panel es de escritorio primero pero **debe funcionar en 360 px** (un administrador puede aprobar desde el teléfono).
- Formularios en **una sola columna**, de máximo 560 px, alineados a la izquierda.
- Media queries con `min-width` (de menor a mayor).

---

## 6. Arquitectura de información (Information Architecture)

### 6.1 App móvil [Propuesta]

Cinco secciones raíz, en este orden, en la barra de pestañas con ícono **y** etiqueta:

| Pestaña | Objetivo | Contiene | HU |
|---|---|---|---|
| **Buscar** (inicio) | Encontrar y reservar un viaje | Tarjeta del viaje activo (si lo hay), formulario de búsqueda, organización activa, botón de voz | HU-18, HU-19, HU-27 |
| **Mis viajes** | Seguir mis viajes | Control segmentado "Como pasajero / Como conductor"; próximos arriba, historial abajo | HU-19, HU-20, HU-22, HU-23 |
| **Publicar** | Ofrecer un viaje | Formulario de publicación, o los requisitos que faltan (vehículo, verificación) | HU-11, HU-17 |
| **Billetera** | Controlar mi dinero | Saldo disponible y en garantía, recargar, movimientos | HU-12, HU-13, HU-14 |
| **Perfil** | Mi cuenta | Verificación, organizaciones, vehículo, ayuda de voz, cerrar sesión | HU-07, HU-08, HU-09, HU-11 |

Por qué "Publicar" es pestaña aunque la mayoría pasajera no la use: es la segunda tarea del producto y su descubrimiento importa; si la persona no tiene vehículo, la pestaña explica cómo llegar (HU-11 CA-6) en lugar de ocultarse.

Mapa de rutas (`expo-router`; los grupos entre paréntesis no cambian la URL, así que son compatibles con los nombres de archivo de los planes de S1):

```
src/app/
  _layout.tsx                  Stack raíz; decide (publico) o (app) según la sesión
  (publico)/
    iniciar-sesion.tsx         HU-06  · entrada por defecto
    registro.tsx               HU-05
    codigo.tsx                 HU-05, HU-07, HU-34 (pantalla compartida)
    recuperar.tsx              HU-34
  (app)/
    estado-membresia.tsx       HU-06  · membresía pendiente o rechazada
    (pestanas)/
      _layout.tsx              Tabs
      index.tsx                Buscar
      mis-viajes.tsx
      publicar.tsx
      billetera.tsx
      perfil.tsx
    resultados.tsx             HU-18
    viaje/[id].tsx             detalle + reservar (HU-18, HU-19)
    reserva/[id].tsx           estado de la reserva, abordaje, en curso, bajada (HU-22, HU-23)
    verificacion.tsx           identidad y teléfono (HU-08, HU-09)
    vehiculo.tsx               HU-11
    organizaciones.tsx         HU-07
    agregar-organizacion.tsx   HU-07
    recargar.tsx               HU-13
    ayuda.tsx                  comandos de voz (HU-28)
```

### 6.2 Panel web [Propuesta]

| Rol | Sección | Ruta | Página (plan) | HU |
|---|---|---|---|---|
| Público | Iniciar sesión | `/iniciar-sesion` | `paginas/IniciarSesion` | HU-06 |
| Público | Recuperar contraseña | `/recuperar-contrasena` | `paginas/RecuperarContrasena` | HU-34 |
| Público | Aceptar invitación | `/invitaciones/:token` | `paginas/AceptarInvitacion` | HU-01 |
| Super admin | Organizaciones | `/admin/organizaciones` | `paginas/admin/Organizaciones` | HU-01 |
| Super admin | Nueva organización | `/admin/organizaciones/nueva` | idem | HU-01 |
| Admin. de organización | Solicitudes | `/organizacion/solicitudes` | `paginas/admin/Solicitudes` | HU-03 |
| Admin. de organización | Afiliación | `/organizacion/afiliacion` | `paginas/admin/Afiliacion` | HU-02 |

Las rutas `/admin/*` reflejan los endpoints `/admin/*` de la API. Página de llegada tras iniciar sesión: **Solicitudes** para el administrador de organización (su tarea más frecuente) y **Organizaciones** para el super administrador. Las secciones futuras (Tarifas y vínculos HU-04, Alertas HU-26, Panel HU-32, Subsidios HU-15, Métricas HU-33) se agregan a la barra lateral en el grupo de su rol; mientras no existan, no se muestran ni deshabilitadas.

### 6.3 Qué ve la persona según el estado de su cuenta [Propuesta]

"Verificado" = membresía aprobada + identidad aprobada + teléfono vinculado (`ssd.md` §7).

| Estado | Ve | No ve |
|---|---|---|
| Sin sesión | Iniciar sesión, registro, recuperar | Todo lo demás |
| Membresía pendiente o rechazada | `estado-membresia` con explicación y, si tiene otra organización aprobada, la opción de cambiarse | Pestañas |
| Membresía aprobada, sin verificar | Las 5 pestañas. Buscar y Publicar muestran la `ListaPasos` de verificación con el siguiente paso como acción primaria. Billetera muestra "Se crea al verificar tu identidad". Perfil y Vehículo funcionan (D-21) | Formulario de búsqueda y de publicación |
| Verificado | Todo | — |

Regla: **nunca ocultar una sección por falta de permiso; mostrar qué falta y cómo conseguirlo.** La excepción son las secciones de otro rol (el pasajero no ve el panel web).

---

## 7. Patrones de navegación (Navigation Patterns)

| # | Regla | Detalle |
|---|---|---|
| N1 | **Pestañas persistentes** | Cambiar de pestaña conserva la pila de cada una. Tocar la pestaña activa vuelve a su raíz. |
| N2 | **Pila para profundizar** | Detalle y flujos se apilan con la transición nativa de `expo-router`. El encabezado muestra `arrow_back` y el título del destino. |
| N3 | **Modal para tareas cortas que vuelven al origen** | Tareas de 1–2 pasos que terminan donde empezaron (Recargar, Agregar organización) se presentan como modal (`presentation: 'modal'`) con `close` en lugar de atrás. |
| N4 | **Botón atrás de Android = subir un nivel** | Nunca cierra la app desde una pantalla interna ni cancela un viaje. Si hay datos escritos sin guardar, pide confirmación (9.4). `predictiveBackGestureEnabled: false` [Existe]. |
| N5 | **Sin vuelta a una confirmación ya hecha** | Al completar una acción (reservar, publicar, recargar) se **reemplaza** la pantalla de confirmación por la de resultado (`router.replace`), para que "atrás" no permita repetirla. |
| N6 | **Orientación siempre visible** | Título en cada pantalla; pestaña activa resaltada (ícono relleno + etiqueta en `primario`); organización activa visible en Buscar (chip con nombre e ícono de tipo, que lleva a Mis organizaciones). |
| N7 | **Viaje activo anclado** | Desde 30 min antes de la salida y mientras el viaje esté en curso, la tarjeta del viaje activo aparece arriba en Buscar y en Mis viajes con su acción del momento ("Mostrar QR", "Escanear QR", "Verificar bajada"). La persona nunca tiene que buscar su viaje. |
| N8 | **Una acción primaria por pantalla** | En móvil, en la zona de acción fija; en web, a la derecha del título de página (acciones de página) o al final del formulario (acciones de formulario). |
| N9 | **Acciones destructivas lejos de la primaria** | "Cancelar reserva" va como botón secundario al final del detalle, nunca junto a "Abordar". |
| N10 | **Sesión vencida** | Web: redirige a `/iniciar-sesion` con el aviso "Tu sesión venció. Vuelve a ingresar." y, tras ingresar, vuelve a la ruta original. Móvil: igual, a `iniciar-sesion`. |
| N11 | **Enlaces externos** | El explorador de bloques y los textos legales se abren con `expo-web-browser` [Existe] en móvil y en pestaña nueva en web, siempre con ícono `open_in_new`. |
| N12 | **Panel web navegable por URL** | Cada sección y filtro relevante tiene su URL; recargar la página no pierde el lugar. |

---

## 8. Biblioteca de componentes (Component Library)

Todos los componentes son **[Propuesta]**: no existe ninguno todavía. Se construyen **cuando una HU los necesita por primera vez** y las siguientes los reutilizan (mismo criterio que la infraestructura común del backend, MEMORY 14/10/2026). Nombres y props en español (D-19); se conservan las props de React Native y del DOM (`accessibilityLabel`, `aria-*`).

### 8.1 Inventario

| Componente | Móvil | Web | Primera HU que lo necesita | Resuelve |
|---|---|---|---|---|
| `Texto` | ✔ | — (HTML semántico) | HU-06 | Aplica un token de tipografía y color |
| `Icono` | ✔ | ✔ | HU-06 | Material Symbols con tamaño y color de token |
| `Boton` | ✔ | ✔ | HU-06 | Acciones |
| `BotonIcono` | ✔ | ✔ | HU-06 | Acción con solo ícono (mostrar contraseña, voz) |
| `Campo` | ✔ | ✔ | HU-06 | Entrada de texto con etiqueta, ayuda y error |
| `CampoCodigo` | ✔ | ✔ | HU-05 | Código de 6 dígitos |
| `Casilla` | ✔ | ✔ | HU-05 | Consentimiento y opciones sí/no |
| `GrupoOpciones` | ✔ | ✔ | HU-01 (web), HU-02 | Elegir 1 de 2–4 opciones con descripción |
| `ControlSegmentado` | ✔ | — | Mis viajes | Alternar vistas de la misma lista |
| `Aviso` | ✔ | ✔ | HU-06 | Mensaje persistente en contexto |
| `Notificacion` | ✔ | ✔ | HU-03 | Confirmación temporal de una acción terminada |
| `Dialogo` | ✔ | ✔ | HU-03 | Confirmar algo irreversible |
| `HojaInferior` | ✔ | — | Voz (HU-27) | Panel temporal anclado abajo |
| `EtiquetaEstado` | ✔ | ✔ | HU-03, HU-07 | Estado con color, ícono y texto (4.1.2) |
| `Tarjeta` | ✔ | ✔ | HU-07 | Contenedor de un objeto tocable o informativo |
| `FilaLista` | ✔ | — | HU-07 | Fila de lista con ícono, textos y acción |
| `Tabla` | — | ✔ | HU-01, HU-03 | Datos tabulares del panel |
| `ListaEditable` | — | ✔ | HU-02 | Agregar y quitar valores (dominios) |
| `EstadoVacio` | ✔ | ✔ | HU-03 | Lista sin elementos |
| `Esqueleto` | ✔ | ✔ | HU-03 | Carga de listas |
| `ListaPasos` | ✔ | — | HU-08 | Pasos de verificación pendientes |
| `CuentaRegresiva` | ✔ | ✔ | HU-05 | Reenvío de código, vigencia del QR |
| `Avatar` | ✔ | ✔ | HU-18 | Iniciales de una persona |
| `LineaTrayecto` | ✔ | — | HU-17 | Origen → destino (3.2) |
| `TarjetaViaje` | ✔ | — | HU-18 | Viaje en resultados y en Mis viajes |
| `SaldoBilletera` | ✔ | — | HU-14 | Saldo disponible y en garantía |
| `FilaMovimiento` | ✔ | — | HU-14 | Movimiento de la billetera |
| `BotonVoz` + `PanelVoz` | ✔ | — ([Abierto] D-08) | HU-27 | Comandos de voz |
| `Encabezado` | ✔ | ✔ | HU-06 | Barra superior |
| `BandaMarca` | ✔ | — | HU-06 | Encabezado expresivo de las zonas de marca (3.5); variante de `Encabezado` |
| `Ilustracion` | ✔ | ✔ | HU-05, HU-06 | Escena de trayecto para resultados, vacíos y estados (8.12) |
| `BarraLateral` | — | ✔ | HU-01 | Navegación del panel |
| `CodigoQR`, `EscanerQR`, `MapaTrayecto` | ✔ | — | HU-22, HU-23 | [Abierto → P-02, P-03] |

Regla de reutilización: si un caso nuevo se parece a un componente existente en más del 70 %, se agrega una variante; si no, un componente nuevo con la aprobación de la sección 15. Nunca dos componentes para lo mismo.

### 8.2 Boton

| Variante | Apariencia | Cuándo | Cuándo no |
|---|---|---|---|
| `primario` | Relleno `primario`, texto `sobrePrimario` | La acción que completa la tarea de la pantalla. **Máximo una visible** | Acciones secundarias, "Cancelar" |
| `secundario` | Fondo transparente, borde 1 `bordeCampo`, texto `primario` | Alternativas de igual dignidad ("Ya tengo cuenta"), entrada a acciones destructivas ("Cancelar reserva") | Junto a otro secundario en vez de un primario |
| `texto` | Solo texto `primario`, sin borde | Acciones de bajo énfasis: "Reenviar código", "Ver detalles", "Volver" en diálogos | Acciones que completan la tarea |
| `peligro` | Relleno `peligro`, texto `sobrePeligro` | **Solo** el botón que confirma una destrucción dentro de un `Dialogo` | Como entrada a una acción destructiva |

| Prop | Tipo | Por defecto | Nota |
|---|---|---|---|
| `etiqueta` | `string` (ya traducido con `t()`) | — | Verbo + objeto (13.3) |
| `alPresionar` | `() => void` | — | — |
| `variante` | `'primario' \| 'secundario' \| 'texto' \| 'peligro'` | `'primario'` | — |
| `tamano` | `'normal' \| 'compacto'` | `'normal'` | 48/40 dp móvil; 40/32 px web |
| `icono` | nombre de Material Symbol | — | A la izquierda del texto; `fingerprint` en acciones con biometría |
| `cargando` | `boolean` | `false` | Muestra indicador y conserva el ancho; bloquea toques repetidos |
| `deshabilitado` | `boolean` | `false` | Ver regla abajo |
| `anchoCompleto` | `boolean` | `false` | `true` en la zona de acción fija móvil |

Estados: reposo · presionado (`primarioPresionado`, 100 ms) · foco web (anillo 2 px `foco` con separación 2 px) · deshabilitado (`fondoDeshabilitado` + `textoDeshabilitado`) · cargando (indicador + etiqueta en gerundio: "Reservando…").

Reglas:

- **No se deshabilita el botón primario para indicar que el formulario está incompleto.** Se deja activo y, al tocarlo, se muestran los errores en cada campo. Un botón gris sin explicación no le dice a la persona qué le falta. Se deshabilita solo cuando la acción es imposible por una razón visible al lado ("Reenviar en 42 s").
- `cargando` es obligatorio en toda acción que llama a la API: evita el doble envío (la idempotencia la garantiza el servidor, pero la interfaz no debe provocarla).
- Etiquetas de 1 a 4 palabras; nunca "OK", "Sí", "Aceptar" sueltos.

### 8.3 EtiquetaEstado

Forma de píldora (`radio.completo`), alto 24, relleno horizontal 8, ícono 16 + texto `pequeno`. Recibe el **estado de la API** y el dominio (`<EtiquetaEstado dominio="viaje" estado="Reservado" />`) y resuelve tono, ícono y texto con la tabla 4.1.2. Así un estado nuevo se agrega en un solo lugar. No es tocable.

### 8.4 Campo

Anatomía: etiqueta (`etiqueta`, siempre visible arriba) · caja (alto `altoControl`, `radio.m`, borde 1 `bordeCampo`, fondo `superficie`) · ayuda o error debajo (`secundario`).

| Estado | Borde | Texto inferior |
|---|---|---|
| Reposo | 1 `bordeCampo` | Ayuda en `textoSecundario` (opcional) |
| Foco | 2 `primario` | Ayuda |
| Error | 2 `peligro` | Ícono `error` + mensaje en `peligro`, reemplaza a la ayuda |
| Deshabilitado | 1 `borde`, fondo `fondoDeshabilitado` | — |

Reglas:

- **La etiqueta nunca es el placeholder.** El placeholder, si existe, es un ejemplo ("nombre@uagrm.edu.bo").
- Teclado y autocompletado correctos: correo → `keyboardType="email-address"`, `autoComplete="email"`, `autoCapitalize="none"`; contraseña → `secureTextEntry` + `BotonIcono` "Mostrar contraseña"; placa → `autoCapitalize="characters"`; montos y capacidad → `keyboardType="number-pad"`.
- Los requisitos se dicen **antes** de fallar: la contraseña muestra "Mínimo 8 caracteres, con al menos una letra y un número" como ayuda (HU-05 RN-5).
- Web: `<label for>`, `aria-invalid` y `aria-describedby` apuntando a la ayuda o al error.

### 8.5 CampoCodigo

Seis celdas de 48 × 56, `radio.s`, tipografía `cifra` a 24, separación 8. Avanza solo al escribir, retrocede con borrar, acepta pegar el código completo y **envía solo al completar el sexto dígito** (sin botón). Debajo: `CuentaRegresiva` "Reenviar código en 60 s" que se convierte en un `Boton` `texto` "Reenviar código" (HU-05: un reenvío por minuto). Error: las seis celdas en `peligro` + mensaje; al volver a escribir, el error se limpia. Para lectores de pantalla es **un solo campo** con etiqueta "Código de 6 dígitos".

### 8.6 Aviso, Notificacion y Dialogo: cuál usar

| Necesidad | Componente | Duración | Ejemplo |
|---|---|---|---|
| Contexto que sigue siendo cierto mientras se está en la pantalla | `Aviso` (en línea, arriba del contenido afectado) | Persistente | "Tu membresía está pendiente de aprobación." |
| Confirmar que una acción terminó bien, sin nada más que hacer | `Notificacion` (abajo, sobre la barra de pestañas) | 4 s, se puede cerrar | "Solicitud aprobada." |
| Error de un campo | Error del `Campo` | Hasta corregirlo | "Ingresa un correo válido." |
| Error de la acción o de red | `Aviso` tono peligro sobre el formulario, con acción "Reintentar" | Hasta reintentar o salir | "No pudimos conectar. Revisa tu conexión." |
| Decisión irreversible o con dinero | `Dialogo` | Hasta que se decide | "¿Cancelar tu reserva?" |
| Resultado importante de un flujo | **Pantalla de resultado** (10.1) | — | "Abordaje verificado" |

`Aviso`: ícono + título opcional (`cuerpoEnfasis`) + texto (`secundario`) + acción opcional (`Boton` `texto`), fondo `*Suave`, `radio.m`, relleno 12–16. Tonos: info (primario), éxito, aviso, peligro.

`Notificacion`: una línea, máximo una acción. **Nunca para errores** ni para información que la persona necesite después. Se anuncia a lectores de pantalla (12.4).

`Dialogo`: título como pregunta (`subtitulo`), texto con la consecuencia concreta, y dos botones: el que vuelve atrás (`texto`, "Volver") y el que confirma, nombrado con el verbo de la acción (`peligro` o `primario`). Se cierra con el botón atrás, `Esc` (web) o tocando la superposición, **lo que equivale a "Volver"**. Web: elemento nativo `<dialog>` con `showModal()` (foco atrapado y `Esc` gratis).

### 8.7 TarjetaViaje

```
┌──────────────────────────────────────┐
│ 07:30                     12,00 URC  │  titulo (tabular) · cuerpoEnfasis
│ ● Plaza 24 de Septiembre             │  LineaTrayecto (cuerpo)
│ │                                    │
│ ○ UAGRM · Módulos                    │
│──────────────────────────────────────│
│ (AR) Ana R. · Toyota Corolla gris    │  Avatar 32 · secundario
│ 2 asientos libres        [Reservado] │  secundario · EtiquetaEstado (solo en Mis viajes)
└──────────────────────────────────────┘
```

- Toda la tarjeta es tocable (`accessibilityRole="button"`) y lleva al detalle. **No tiene botón "Reservar"**: reservar mueve dinero y se hace desde el detalle con el resumen completo (P1).
- La hora de salida y el precio son lo más grande: son los dos criterios de decisión de un viaje programado.
- La placa no se muestra en resultados; aparece en el detalle de un viaje reservado y en el abordaje, donde sirve para encontrar el auto.
- Calificación del conductor: **[Abierto] D-17**. El espacio queda reservado a la derecha del nombre; no se muestra hasta que se decida.
- Nombre accesible compuesto: "Viaje a las 07:30 de Plaza 24 de Septiembre a UAGRM Módulos, 12,00 URC, 2 asientos libres, conductora Ana R.".

### 8.8 SaldoBilletera y FilaMovimiento

`SaldoBilletera`: etiqueta "Saldo disponible" · monto en `cifra` · debajo, con `lock`, "En garantía: 12,00 URC" (`secundario`) · nota `pequeno` "Saldo de prueba · sin valor real" · acción primaria "Recargar". Si un movimiento está pendiente, `Aviso` info "Tienes un movimiento pendiente de confirmación." (HU-14: distinguir disponible de bloqueado).

`FilaMovimiento`: ícono por tipo (recarga `add`, garantía `lock`, pago recibido `south_west`, reembolso `undo`) · descripción ("Recarga", "Pago del viaje a UAGRM") · fecha y hora · monto con signo a la derecha (`cuerpoEnfasis`, color `texto`) · `EtiquetaEstado` si está pendiente o fallido · acción "Ver en el explorador" (`open_in_new`) cuando hay `hash_tx`. Agrupadas por día.

### 8.9 ListaPasos

Lista vertical de pasos con estado: completado (`check_circle` en `exito`), actual (número en `primario`, título en `cuerpoEnfasis`, descripción y botón primario), pendiente (número en `textoSecundario`). Cada paso dice **qué es, por qué se pide y qué hace falta** ("Ten tu carnet a mano y buena luz · 2 min"). Se usa para la verificación (correo → membresía → identidad → teléfono; la billetera se crea sola).

### 8.10 BotonVoz y PanelVoz

`BotonVoz`: `BotonIcono` con `mic`, 48 × 48, en la **esquina derecha del `Encabezado`** de las pantallas raíz y del detalle de viaje y de reserva, siempre en el mismo lugar. Etiqueta accesible: "Hablar con UniRide". Además, el campo de destino de Buscar lleva el mismo ícono dentro.

`PanelVoz` (en `HojaInferior`):

| Estado | Muestra |
|---|---|
| Escuchando | "Te escucho…", transcripción en vivo, indicador de nivel de audio (estático si se reduce el movimiento), ejemplo: «Busca un viaje a la UAGRM a las 7» |
| Procesando | "Entendí: buscar viaje a UAGRM, hoy a las 07:00" |
| Respuesta | El texto que también se lee en voz alta, y la pantalla destino ya abierta detrás |
| No entendí | La repregunta concreta ("¿A qué hora quieres salir?") con "Volver a intentar"; tras 2 fallos, "Hazlo con el teclado" lleva a la alternativa táctil |
| Sin permiso de micrófono | Explicación + "Abrir ajustes" |

Lista completa de comandos: `ssd.md` §11 y pantalla `ayuda`.

### 8.11 Componentes web específicos

- **`Tabla`**: `<table>` semántico con `<caption>` (puede ser visualmente oculto), encabezado `fondoSutil` y `etiqueta`, filas de 52 px sin cebra, fondo `fondoSutil` al pasar el cursor, acciones a la derecha con `tamano="compacto"`. Por debajo de 640 px cada fila pasa a ser una `Tarjeta` con los mismos datos y acciones.
- **`ListaEditable`**: campo + botón "Agregar" en una fila; debajo, la lista de valores, cada uno con `BotonIcono` `close` "Quitar {valor}". Si quitar está prohibido (último dominio, HU-02 CA-6), la ayuda lo dice ("Debe quedar al menos un dominio") y el botón se deshabilita.
- **`BarraLateral`**: logotipo, nombre y tipo de la organización activa (admin. de organización), grupos de navegación por rol con ícono + etiqueta, contador en Solicitudes, y al pie el nombre de la persona y "Cerrar sesión". [Propuesta 17/10] Fondo `marcaProfundo`, logotipo blanco, texto `sobreMarca`/`sobreMarcaSecundario`, ítem activo con fondo `marcaVelo`, ícono relleno y marca lateral de 3 px en `marcaBrillante`; contador en `marcaBrillante` con texto `marcaProfundo`.

### 8.12 BandaMarca e Ilustracion [Propuesta — aprobada por el PO el 17/10/2026]

**`BandaMarca`** (móvil). Variante expresiva de `Encabezado` para las zonas de marca (3.5).

```
┌──────────────────────────────┐
│ 07:24              ▮▮ 80 %   │  barra de estado en sobreMarca
│ [● UAGRM ▾]            (mic) │  chip marcaVelo · BotonIcono marcaVelo
│ Hola, Ana                    │  pantalla (display) · sobreMarca
│ Termina tu verificación      │  cuerpo · sobreMarcaSecundario
│            ╭──╮ (U al 12 %)  │  Ilustracion de fondo, decorativa
╰──────────────────────────────╯  radio.xl abajo · degradadoMarca
   ┌────────────────────────┐
   │ tarjeta nivel 0,5      │     se superpone 24 dp a la banda
```

- Alto según contenido (sin alto fijo, 12.3). La barra de estado del sistema pasa a íconos claros mientras la banda está visible.
- La acción primaria de la pantalla **nunca** va dentro de la banda: sigue en la zona de acción o en la tarjeta superpuesta.
- La ilustración de fondo es decorativa (`accessibilityElementsHidden` / `aria-hidden`).

**`Ilustracion`**. Escenas construidas solo con el motivo de trayecto de la marca (3.2): la U, el punto de origen relleno, el anillo de destino y, como máximo, un ícono de Material Symbols en el centro. Colores: `primario`, `marcaBrillante`, `primarioSuave` y el color del estado cuando lo comunica (éxito, aviso, peligro). Sin personas, sin autos dibujados, sin texto dentro.

| Escena | Uso | Ícono central |
|---|---|---|
| `bienvenida` | Inicio de sesión, banda de registro | — (solo la U grande) |
| `correo` | Código enviado (HU-05, HU-07, HU-34) | `mark_email_read` |
| `espera` | Membresía pendiente | `hourglass_top` en `aviso` |
| `rechazo` | Membresía rechazada | `cancel` en `peligro` |
| `exito` | Resultados (vehículo registrado, viaje publicado, abordaje verificado) | `check_circle` en `exito` |
| `vacio` | Listas sin elementos | ícono de la sección |

Implementación: un SVG por escena en `mobile/assets/ilustraciones/` y `web/src/iconos/`, dibujado desde los trazos de `marca/`. En móvil se muestra con `expo-image` [Existe, instalado; soporta SVG], sin dependencia nueva.

---

## 9. Diseño de interacción (Interaction Design)

### 9.1 Respuesta inmediata

| Tiempo desde la acción | Qué se muestra |
|---|---|
| < 100 ms | Cambio visual de presionado |
| 100 ms – 1 s | `Boton` en estado `cargando`; el resto de la pantalla sigue visible |
| > 300 ms en listas | `Esqueleto` con la forma del contenido |
| > 3 s | Texto adicional "Está tardando más de lo normal…" (las metas son búsqueda < 2 s y abordaje < 3 s) |
| Asíncrono en blockchain | Resultado inmediato con estado **Pendiente** + explicación; nunca una espera bloqueante |

### 9.2 Formularios y validación

1. Un campo por dato, en el orden en que la persona piensa (origen antes que destino; fecha antes que hora).
2. **Valores por defecto inteligentes** que el servidor después valida: origen = "Mi ubicación" (HU-18 busca a 1 km), fecha = hoy, hora = la próxima media hora, cupos al publicar = 1, organización = la activa.
3. Validación **al salir del campo** y **al enviar**, nunca al primer carácter. Un error se borra en cuanto el valor es válido.
4. Al enviar con errores: foco y desplazamiento al primer campo con error, y un `Aviso` peligro arriba si hay más de dos.
5. Los límites se muestran como ayuda antes de fallar: "Máximo 6 pasajeros", "Entre 10 y 500 Bs", "Precio máximo de tu organización: 15,00 URC".
6. Errores del servidor: la API devuelve un `codigo` estable; cada cliente lo traduce con su `es-BO.json` y lo asocia al campo correspondiente si aplica. Código desconocido → `comun.errores.desconocido`.
7. Formularios largos no se parten en pasos solo para parecer cortos: Publicar viaje es **una pantalla** con grupos (Trayecto · Cuándo · Asientos y precio) y una acción.

### 9.3 Selección de fecha y hora [Propuesta, a verificar]

Accesos rápidos en chips ("Hoy", "Mañana") y, para otra fecha u hora, el `DatePicker` de `@expo/ui/jetpack-compose` [Existe, instalado] en modo Android nativo. Si en HU-17 el componente no cubre la hora, se decide con el equipo antes de agregar otra dependencia (P-08).

### 9.4 Confirmaciones y recuperación

| Situación | Patrón |
|---|---|
| Acción reversible y frecuente (cambiar organización activa, filtrar) | Sin confirmación |
| Aprobar un miembro (web) | Sin diálogo; `Notificacion` con el resultado. Es la acción esperada, frecuente y la persona ya probó su correo institucional |
| Rechazar un miembro (definitivo en v1, HU-03 RN-4) | `Dialogo` con motivo opcional y la consecuencia: "No podrá volver a solicitar ingreso a {organización}." |
| Cancelar una reserva o un viaje (dinero) | `Dialogo` con el reembolso, luego biometría (9.6) |
| Salir de un formulario con datos escritos | `Dialogo` "¿Descartar los cambios?" · "Seguir editando" / "Descartar" |
| Solicitud ya decidida por otro admin (HU-03 CA-5) | `Aviso` "Esta solicitud ya fue decidida." y la fila se actualiza sola |

No existe "Deshacer" para operaciones de dinero ni de verificación: la reversión la decide el servidor por reglas (reembolsos), no la interfaz.

### 9.5 Montos de cancelación [Abierto → P-06]

La política (HU-20) se muestra siempre en el diálogo: "Si cancelas con más de 30 minutos de anticipación recibes el 100 %; con menos, el 50 %." El monto exacto debe venir del servidor; hoy la API no expone una vista previa del reembolso. Hasta que se decida, el diálogo muestra el porcentaje según la hora (marcado "estimado") y la pantalla de resultado muestra el monto real devuelto por la API.

### 9.6 Confirmación biométrica (HU-29, A-11)

Acciones que la piden: reservar, cancelar, recargar (D-13 abierta), retirar y verificar abordaje.

1. La persona ve un **resumen** con el monto y su efecto ("Saldo disponible después: 38,00 URC").
2. El botón dice la acción y el monto, con `fingerprint`: **"Reservar y pagar 12,00 URC"**.
3. Al tocarlo se abre el diálogo biométrico del sistema con título "Confirma tu reserva" y el monto como subtítulo.
4. Si llega desde un comando de voz, el diálogo biométrico se abre solo al llegar a la confirmación (el requisito es completar la reserva por voz salvo la biometría); el resumen queda visible detrás.
5. Si la persona cancela el diálogo: no cambia nada, el botón vuelve a reposo y aparece `Notificacion` "No se confirmó la reserva."
6. Nunca se muestra "Confirmado" antes de que responda la API.

### 9.7 Voz (HU-27, HU-28)

- Se activa tocando `BotonVoz`; no hay palabra de activación.
- **La voz navega y prepara, nunca confirma**: cada comando abre la misma pantalla que su alternativa táctil (`ssd.md` §11).
- Ante duda, **repregunta por el dato que falta**; nunca adivina ni completa en silencio.
- La interpretación se muestra antes de actuar ("Entendí: …") para que la persona la corrija.
- Las respuestas habladas son las mismas que se muestran: una o dos frases, con la cifra o el estado primero ("Tienes 50,00 URC disponibles y 12,00 en garantía.").
- El permiso de micrófono se pide la primera vez que se toca el botón, con una explicación previa de una línea.

### 9.8 Gestos y vibración

- Ningún gesto es la única forma de hacer algo: no hay "deslizar para borrar" ni "deslizar para confirmar".
- Se permite: desplazar, tocar, tirar hacia abajo para actualizar listas, y deslizar hacia abajo para cerrar una `HojaInferior` (que además tiene botón "Cerrar").
- Vibración con `Vibration` de React Native (sin dependencias): un pulso corto al verificar abordaje o bajada; un patrón doble ante un error de escaneo. Solo en esos momentos.

---

## 10. Patrones de pantallas y flujos (Screen & Flow Patterns)

### 10.1 Plantillas de pantalla

| Plantilla | Estructura | Ejemplos |
|---|---|---|
| **Raíz de pestaña** | Encabezado con título y voz · contenido · barra de pestañas | Buscar, Mis viajes, Billetera, Perfil |
| **Formulario** | Encabezado con atrás · campos en una columna · zona de acción fija con el primario | Registro, Publicar, Registrar vehículo, Recargar |
| **Detalle** | Encabezado · datos agrupados en tarjetas · zona de acción fija con la acción del momento | Detalle de viaje, Reserva |
| **Confirmación** | Resumen de lo que va a pasar (monto, efecto, política) · botón con biometría | Confirmar reserva, Cancelar |
| **Resultado** | Ícono 48 en su tono · título `pantalla` · una frase de explicación · una acción para seguir | "Abordaje verificado", "Viaje publicado", "Reserva confirmada" |
| **Pantalla completa de tarea** | Fondo limpio, una sola tarea sin distracciones, salida con `close` | Mostrar QR, Escanear QR |
| **Página del panel** | Título + descripción + acción primaria · contenido en tarjetas o tabla | Solicitudes, Organizaciones |

### 10.2 Flujo principal del pasajero (≤ 4 pasos)

Presupuesto de pasos (requisito del docente). Un "paso" es una decisión de la persona; abrir la app no cuenta.

| Paso | Pantalla | Acción de la persona | Lo que hace el sistema |
|---|---|---|---|
| 1 | Buscar | Elige destino (origen y hora ya tienen valores por defecto) y toca **Buscar** | Muestra resultados en < 2 s, ordenados por hora de salida |
| 2 | Resultados → Detalle | Toca una `TarjetaViaje` | Muestra punto de encuentro, hora, conductor, vehículo, precio y el resumen de garantía |
| 3 | Detalle → confirmación | Toca **Reservar y pagar 12,00 URC** y confirma con huella | Bloquea el pasaje en garantía; resultado "Reserva confirmada" |
| 4 | Viaje activo → Escanear QR | Al encontrarse con el conductor, escanea su QR | Verifica en < 3 s; "Abordaje verificado"; empieza el viaje |
| — | (automático) | Al bajar, repite el escaneo desde la tarjeta del viaje activo | Verifica la bajada; el pago se libera solo y se muestra *Pendiente → Pagado* |

Si el saldo no alcanza (HU-19), en el paso 3 el botón primario cambia a **"Recargar saldo"** con el faltante ("Te faltan 4,00 URC") y, tras recargar, vuelve a la misma confirmación sin repetir la búsqueda.

Por voz: "busca un viaje a la UAGRM a las 7" (paso 1) → "reserva el primero" (pasos 2–3, abre la confirmación con la huella).

### 10.3 Publicar un viaje (conductor)

Pestaña Publicar → si faltan requisitos, `ListaPasos` (vehículo, verificación) · si no, formulario de una pantalla: **Trayecto** (origen = punto de encuentro, destino, botón `swap_vert`) · **Cuándo** (fecha y hora) · **Asientos y precio** (cupos 1…capacidad del vehículo, precio con la ayuda "Máximo de tu organización: X URC") → **Publicar viaje** → pantalla de resultado con "Ver en Mis viajes". La capacidad y el tope se muestran como límites, el servidor los valida (HU-17).

### 10.4 Abordaje y bajada (HU-22, HU-23)

**Conductor — "Mostrar QR":** pantalla completa de tarea. QR grande negro sobre blanco · `CuentaRegresiva` lineal "Nuevo código en 18 s" (el código se renueva solo antes de vencer; el conductor no hace nada) · lista de pasajeros con su estado (Esperando · Verificado ✓) · recordatorio "El pasajero debe estar a menos de 50 m". Si la ubicación está desactivada, un `Aviso` peligro reemplaza el QR con "Activa tu ubicación para verificar el abordaje."

**Pasajero — "Escanear QR":** cámara a pantalla completa con un marco, instrucción "Apunta al código del teléfono de {Nombre}" y la placa del vehículo para confirmar que es el auto correcto.

| Resultado (código de la API) | Mensaje | Acción |
|---|---|---|
| Éxito | "Abordaje verificado" (pantalla de resultado, vibración, anuncio) | Se pasa a "En curso" |
| Código vencido o ya usado | "Ese código ya no sirve. Escanea el que muestra ahora el conductor." | Volver a escanear |
| Distancia > 50 m | "Estás a más de 50 m del conductor. Acércate y vuelve a escanear." | Volver a escanear |
| Ubicación simulada | "No pudimos confirmar tu ubicación. Desactiva cualquier app que cambie tu ubicación." | Volver a escanear |
| Fallo de integridad del teléfono | "Este teléfono no puede verificar viajes." (sin detalle técnico) | Ayuda |
| Sin conexión | "Sin conexión. El código sigue en pantalla del conductor; vuelve a escanear cuando tengas señal." | Reintentar |

**En curso:** estado "En viaje a {destino}" con `EtiquetaEstado` en curso, indicador permanente "Compartiendo tu ubicación cada 15 s" (transparencia), mapa del trayecto cuando exista (P-03) y la acción del momento: conductor "Verificar bajada" (QR), pasajero "Escanear QR de bajada".

**Después de la bajada:** pantalla de resultado "Viaje verificado" → el pago aparece *Pendiente* ("Se está registrando en la red de prueba; puede tardar unos minutos") → *Pagado*. El conductor ve "Recibirás 12,00 URC" y luego "Recibiste 12,00 URC".

### 10.5 Registro y acceso (HU-05, HU-06, HU-34)

Entrada: **Iniciar sesión** con "Crear cuenta" como botón secundario visible (sin pantalla de bienvenida extra). Registro (nombre, correo institucional, contraseña, casilla de consentimiento con enlace al texto) → Código (6 dígitos) → según la membresía: inicio con `ListaPasos` o `estado-membresia`. Si el dominio no está afiliado (HU-05 CA-3), el error está en el campo correo: "Tu organización todavía no está afiliada a UniRide." Los mensajes de cuenta existente y de recuperación **no revelan** si un correo tiene cuenta (HU-05 CA-7, HU-34 RN-4).

### 10.6 Billetera (HU-12 a HU-14)

`SaldoBilletera` arriba, movimientos abajo. **Recargar** (modal): chips 20 · 50 · 100 · 200 y "Otro monto" (10–500 Bs) → resumen "Pagas 50,00 Bs · recibes 50,00 URC" → QR de pago simulado con la marca "Pago simulado · red de prueba" → resultado con el movimiento *Pendiente* hasta su confirmación on-chain. La palabra "blockchain" no aparece en la interfaz principal; el enlace al explorador sí, en cada movimiento.

### 10.7 Organizaciones (HU-07)

En Buscar, el chip de organización activa abre **Mis organizaciones**: lista con nombre, ícono de tipo, `EtiquetaEstado` de la membresía y marca de "Activa". Tocar una aprobada la activa y vuelve a Buscar con `Notificacion` "Ahora ves los viajes de {organización}". Las pendientes y rechazadas no son seleccionables y lo dicen. "Agregar organización" → correo → Código (pantalla compartida).

### 10.8 Panel web

- **Solicitudes (HU-03):** tabla de pendientes de la más antigua a la más reciente (Nombre · Correo institucional · Fecha · Acciones). Aprobar inmediato con `Notificacion`; Rechazar con `Dialogo` (motivo opcional, consecuencia definitiva). Vacío: "No hay solicitudes pendientes."
- **Afiliación (HU-02):** `ListaEditable` de dominios con la ayuda "Usa el dominio del correo institucional, por ejemplo uagrm.edu.bo. No se aceptan correos públicos como gmail.com." · `GrupoOpciones` de modo de aprobación con descripción de cada uno ("Automática: quien confirme un correo del dominio entra de inmediato" / "Manual: revisas cada solicitud") · Guardar. Salir con cambios sin guardar pide confirmación.
- **Organizaciones (HU-01):** tabla (Nombre · Tipo · Estado · Administrador) con "Nueva organización" a la derecha del título. Formulario: nombre, tipo (`GrupoOpciones` Universidad / Empresa), precio máximo por viaje en URC, nombre y correo del administrador inicial → resultado con `Aviso` éxito "Enviamos la invitación a {correo}."

---

## 11. Estados de la interfaz (UI States)

Toda pantalla que carga datos debe diseñar **todos** estos estados antes de considerarse terminada.

| Estado | Cuándo | Patrón | Ejemplo de texto (clave sugerida) |
|---|---|---|---|
| Inicial | Antes de que la persona actúe | Valores por defecto útiles, sin errores | — |
| Cargando | Esperando a la API | `Esqueleto` en listas; `Boton` `cargando` en acciones; nunca pantalla en blanco | "Buscando viajes…" |
| Vacío | Respuesta sin elementos | `EstadoVacio`: ícono 48, título, explicación y la acción que lo resuelve | "No hay viajes a esa hora. Prueba con otra hora o publica el tuyo." (`viajes.busqueda.vacio`) |
| Éxito | Acción terminada | Pantalla de resultado (flujos) o `Notificacion` (acciones simples) | "Viaje publicado" |
| Pendiente | Operación on-chain o correo en cola | `EtiquetaEstado` Pendiente + explicación; la persona puede seguir usando la app | "Pago pendiente de confirmación · puede tardar unos minutos" |
| Error recuperable | Falla de red o servicio externo | `Aviso` peligro + "Reintentar"; los datos escritos se conservan | "No pudimos conectar. Revisa tu conexión y vuelve a intentar." (`comun.errores.sin_conexion`) |
| Error de validación | Dato inválido | Error del `Campo` | "La placa debe tener 3 o 4 números y 3 letras." |
| Bloqueado por tiempo | OTP o sesión tras 5 fallos | `Aviso` aviso con la hora de desbloqueo, sin cuenta regresiva hablada | "Por seguridad, espera hasta las 10:45 para volver a intentar." (`autenticacion.otp.bloqueado`) |
| Vencido | Código, QR, invitación o sesión vencida | Explicar y ofrecer la acción para obtener uno nuevo | "El código venció. Te enviamos uno nuevo." |
| Requisito faltante | No verificado, sin vehículo, saldo insuficiente | `ListaPasos` o botón primario que lleva a resolverlo | "Registra tu vehículo para publicar viajes." |
| Deshabilitado | Acción imposible ahora | Control deshabilitado **con la razón visible al lado** | "Reenviar en 42 s" |
| Sin conexión | Sin red | `Aviso` fijo arriba "Sin conexión"; se muestra lo último cargado; las acciones que necesitan al servidor quedan deshabilitadas con la razón | "Sin conexión. Algunas acciones no están disponibles." |
| Sin permiso del sistema | Cámara, ubicación o micrófono denegados | Explicación de para qué se usa + "Abrir ajustes" | "UniRide necesita tu ubicación solo para verificar que estás junto al conductor." |
| Servicio externo caído | Prueba de vida, correo, blockchain | Mensaje claro y estado consistente: nada queda a medias (`AGENTS.md` §12) | "La verificación de identidad no está disponible ahora. Tus datos no se guardaron; intenta en unos minutos." |

---

## 12. Accesibilidad (Accessibility)

Objetivo: **WCAG 2.2 nivel AA** en web y su equivalente en Android (TalkBack). HU-31 (*Could*) agrega modo oscuro y opciones de contraste y tamaño; la base de esta sección es obligatoria desde la primera pantalla.

### 12.1 Color y contraste

- Texto ≥ 4,5 : 1; texto de 18 o más (o 14 en negrita) ≥ 3 : 1; bordes de controles, íconos informativos y anillo de foco ≥ 3 : 1. La tabla 4.1.1 ya cumple estas cifras; un token nuevo debe documentar su contraste.
- El estado nunca se comunica solo con color (4.1.2).

### 12.2 Objetivos táctiles

- Mínimo **48 × 48 dp** en móvil (también para íconos de 24: se amplía el área con `hitSlop` o relleno). Web: 44 × 44 px para acciones principales y nunca menos de 24 × 24 px.
- Al menos 8 de separación entre objetivos adyacentes.

### 12.3 Texto y escala

- Se respeta el tamaño de fuente del sistema. La interfaz se revisa al **200 %**: el texto se ajusta en varias líneas, no se corta con "…" en datos para decidir (hora, destino, precio, montos) y los contenedores no tienen alto fijo.
- Web: unidades `rem` para tipografía; el zoom al 200 % no exige desplazamiento horizontal en 1280 px.

### 12.4 Lectores de pantalla

- Móvil: `accessibilityRole` en todo lo interactivo y en los títulos (`"header"`, como ya hace `index.tsx` [Existe]); `accessibilityLabel` en íconos sin texto; `accessibilityState` para `disabled`, `selected`, `checked` y `busy`.
- Las tarjetas agrupan su contenido en **un solo elemento** con nombre compuesto (8.7) en lugar de 8 elementos sueltos.
- Cambios importantes se anuncian: `AccessibilityInfo.announceForAccessibility` en móvil y una región `aria-live="polite"` en web (resultado del abordaje, notificaciones, errores de envío). Las cuentas regresivas **no** se anuncian cada segundo; se anuncia al empezar y al vencer.
- Orden de lectura = orden visual.

### 12.5 Teclado y foco (web)

- Todo es operable con teclado; orden de tabulación lógico; enlace "Saltar al contenido" como primer elemento.
- Foco visible: anillo de 2 px `foco` con separación de 2 px (`:focus-visible`). Nunca `outline: none` sin reemplazo.
- `Dialogo` con `<dialog>` nativo: el foco entra al diálogo, `Esc` lo cierra y vuelve al botón que lo abrió.
- Encabezados en jerarquía (`h1` único por página, luego `h2`).

### 12.6 Movimiento, tiempo y voz

- Respeto de "reducir movimiento" (4.7).
- Los tiempos límite que impone la seguridad (QR de 30 s, OTP de 10 min) se compensan: el QR se renueva solo; el OTP se puede reenviar.
- La voz es una ayuda de accesibilidad, pero ninguna función depende de ella (Art. 5), y ninguna función depende solo del tacto preciso: todo es alcanzable con TalkBack.
- La cámara para escanear da guía hablada y vibración al reconocer el código.

---

## 13. Contenido y microcopia (Content & Microcopy)

### 13.1 Voz y tono

- **Español de Bolivia, tuteo** ("tu comunidad" [Existe en el eslogan]); sin voseo en los verbos para mantener un registro neutro escrito.
- **Claro, cercano y directo.** Frases cortas, voz activa, la información importante primero.
- **Serio con el dinero:** cifras exactas, sin exclamaciones ni bromas en pagos, errores o verificaciones.
- Sin culpar: "No pudimos…", no "Ingresaste mal…".

### 13.2 Glosario de interfaz

La interfaz usa el término cotidiano; el técnico queda en la documentación.

| Término técnico | En la interfaz | Nunca mostrar |
|---|---|---|
| Escrow | **En garantía**; "Tu pago queda en garantía hasta que el viaje se verifique" | escrow, contrato inteligente |
| Token URC / UniCoin | **URC** (saldo); "UniCoin (URC)" solo en la ayuda | token, ERC-20, mint |
| Blockchain, testnet | **Red de prueba** (solo en billetera y explorador) | gas, hash como título, relayer |
| Handshake, desafío, nonce | **Código QR de abordaje / de bajada** | handshake, nonce, firma |
| Atestación, Play Integrity | (no se nombra) "Este teléfono no puede verificar viajes" | atestación, root, emulador |
| Liveness, Rekognition | **Prueba de vida** | liveness, similitud 90 % |
| CI | **Carnet de identidad** | — |
| Membresía | **Membresía** o "tu ingreso a {organización}" | tenant |
| Organización activa | "Estás viendo viajes de {organización}" | — |

### 13.3 Botones y acciones

- **Verbo en infinitivo + objeto:** "Publicar viaje", "Buscar", "Reservar y pagar 12,00 URC", "Escanear QR", "Agregar organización".
- La acción que confirma repite el verbo del título: diálogo "¿Cancelar tu reserva?" → botón "Cancelar reserva"; el que vuelve se llama "Volver" (no "Cancelar", que sería ambiguo).
- Enlaces con destino claro: "Ver en el explorador", no "Clic aquí".

### 13.4 Mensajes de error

Fórmula: **qué pasó + qué hacer**, en una o dos frases, sin códigos técnicos.

| Correcto | Incorrecto |
|---|---|
| "Esa placa ya está registrada. Revisa los números y letras." | "Error: PLACA_DUPLICADA" |
| "Tu saldo no alcanza. Te faltan 4,00 URC." + "Recargar saldo" | "Saldo insuficiente." |
| "No pudimos enviar el correo. Intenta en unos minutos." | "SES error 503" |

### 13.5 Confirmaciones, vacíos y ayuda

- Confirmación: título que nombra el resultado ("Reserva confirmada") + qué sigue ("Te avisaremos 30 min antes de la salida." solo si existe esa función).
- Vacío: explica por qué está vacío y ofrece la acción que lo llena.
- Ayudas de campo: el requisito o un ejemplo, no una repetición de la etiqueta.

### 13.6 Respuestas de voz

Mismo texto en pantalla y en voz. Una o dos frases. Dato primero. Ejemplos: "Tienes 50,00 URC disponibles y 12,00 en garantía." · "Tu conductor está a 300 metros." · "No entendí la hora. ¿A qué hora quieres salir?".

### 13.7 Claves de texto

Todos los textos van a `es-BO.json` con claves `modulo.pantalla.elemento` [Existe, `ssd.md` §14]. Textos comunes a todas las pantallas en `comun.*`: `comun.acciones.volver`, `comun.acciones.reintentar`, `comun.errores.sin_conexion`, `comun.errores.desconocido`, `comun.errores.no_autorizado`. Los mensajes de error de la API se traducen por su `codigo`.

---

## 14. Guía de implementación (Implementation Guidelines)

### 14.1 Estructura de archivos [Propuesta]

```
mobile/src/
  app/                    rutas de expo-router (6.1)
  tema/
    tokens.ts             colores claro/oscuro, espacio, radio, tipografía, duración
    useColores.ts         único punto que decide el tema
  componentes/            Boton.tsx, Campo.tsx, TarjetaViaje.tsx … (+ __tests__)
  formato.ts              montos, horas, fechas, distancias, placas (4.9)
  i18n/                   [Existe]

web/src/
  estilos/tokens.css      variables CSS de los tokens
  index.css               [Existe] reinicio mínimo + importa tokens.css
  componentes/            Boton.tsx + Boton.module.css …
  iconos/                 SVG de Material Symbols usados
  paginas/                [Planes de S1]
  formato.ts
  i18n/                   [Existe]
```

Los tokens se duplican en dos archivos (`tokens.ts` y `tokens.css`) porque los clientes viven en submódulos separados; un paquete compartido sería una dependencia más sin beneficio. **Este documento es la fuente**: un cambio de token se hace aquí y en los dos archivos en la misma historia.

### 14.2 Tokens en móvil

```ts
// mobile/src/tema/tokens.ts
export const claro = {
  fondo: '#FFFFFF',
  fondoSutil: '#F6F7F9',
  superficie: '#FFFFFF',
  borde: '#DDE1E8',
  bordeCampo: '#7A8396',
  texto: '#1A1F27',
  textoSecundario: '#535B6C',
  primario: '#3447CC',
  primarioPresionado: '#2A39A6',
  sobrePrimario: '#FFFFFF',
  // … resto de la tabla 4.1.1
} as const;

export type Colores = Record<keyof typeof claro, string>;
export const oscuro: Colores = { fondo: '#0F1218' /* … tabla 4.1.1 */ } as Colores;

export const espacio = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64 } as const;
export const radio = { s: 8, m: 12, l: 16, xl: 24, completo: 999 } as const;
export const tipografia = {
  titulo: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
  cuerpo: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  // … tabla 4.2
} as const;
```

```ts
// mobile/src/tema/useColores.ts
import { claro, type Colores } from './tokens';

/** Colores del tema actual. Hasta HU-31 es siempre el claro; entonces se lee useColorScheme() aquí y solo aquí. */
export function useColores(): Colores {
  return claro;
}
```

Uso en un componente: la geometría va en `StyleSheet.create` (estático) y el color se aplica con el hook, para que HU-31 no obligue a reescribir estilos.

```tsx
// mobile/src/componentes/Boton.tsx (extracto)
export function Boton({ etiqueta, alPresionar, variante = 'primario', cargando = false, deshabilitado = false }: Props) {
  const c = useColores();
  const inactivo = deshabilitado || cargando;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo, busy: cargando }}
      disabled={inactivo}
      onPress={alPresionar}
      style={({ pressed }) => [
        estilos.base,
        variante === 'primario' && { backgroundColor: inactivo ? c.fondoDeshabilitado : pressed ? c.primarioPresionado : c.primario },
      ]}
    >
      {cargando ? <ActivityIndicator color={c.sobrePrimario} /> : <Text style={[tipografia.cuerpoEnfasis, { color: c.sobrePrimario }]}>{etiqueta}</Text>}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: { minHeight: 48, borderRadius: radio.m, paddingHorizontal: espacio[4], alignItems: 'center', justifyContent: 'center' },
});
```

Correcto vs. incorrecto:

```tsx
// ✔ tokens y textos del archivo de idioma
<Text style={[tipografia.secundario, { color: c.textoSecundario }]}>{t('viajes.tarjeta.asientos_libres')}</Text>

// ✘ color, tamaño y texto literales
<Text style={{ fontSize: 13, color: '#666' }}>2 asientos libres</Text>
```

### 14.3 Tokens en web

```css
/* web/src/estilos/tokens.css */
:root {
  color-scheme: light;
  --fuente: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  --color-fondo: #ffffff;
  --color-fondo-sutil: #f6f7f9;
  --color-superficie: #ffffff;
  --color-borde: #dde1e8;
  --color-borde-campo: #7a8396;
  --color-texto: #1a1f27;
  --color-texto-secundario: #535b6c;
  --color-primario: #3447cc;
  --color-primario-presionado: #2a39a6;
  --color-sobre-primario: #ffffff;
  --color-foco: #3447cc;
  /* … resto de la tabla 4.1.1 */

  --espacio-1: 0.25rem; --espacio-2: 0.5rem; --espacio-3: 0.75rem; --espacio-4: 1rem;
  --espacio-6: 1.5rem; --espacio-8: 2rem;
  --radio-s: 8px; --radio-m: 12px; --radio-l: 16px; --radio-completo: 999px;
  --duracion-corta: 100ms; --duracion-media: 200ms; --duracion-larga: 300ms;
  --curva-estandar: cubic-bezier(0.2, 0, 0, 1);
}

/* HU-31: [data-tema='oscuro'] { color-scheme: dark; --color-fondo: #0f1218; … } */

@media (prefers-reduced-motion: reduce) {
  :root { --duracion-corta: 0ms; --duracion-media: 0ms; --duracion-larga: 0ms; }
}
```

Estilos de componente con **CSS Modules** (nativo en Vite, sin dependencias):

```css
/* web/src/componentes/Boton.module.css */
.boton {
  min-height: 40px;
  padding: 0 var(--espacio-4);
  border-radius: var(--radio-m);
  font: 600 1rem/1.5 var(--fuente);
  transition: background-color var(--duracion-corta) var(--curva-estandar);
}
.primario { background: var(--color-primario); color: var(--color-sobre-primario); border: 0; }
.primario:hover { background: var(--color-primario-presionado); }
.boton:focus-visible { outline: 2px solid var(--color-foco); outline-offset: 2px; }
```

### 14.4 Ajustes recomendados al código existente

No se aplican en esta tarea; se hacen en la primera HU de interfaz (HU-06):

| Archivo | Hoy | Recomendado | Por qué |
|---|---|---|---|
| `web/src/index.css` | `color-scheme: light dark` | `color-scheme: light` (pasa a `tokens.css`) | Con tokens claros fijos, los controles nativos se pondrían oscuros en sistemas oscuros y quedarían inconsistentes hasta HU-31 |
| `web/src/index.css` | `body { padding: 1rem }` | Sin relleno en `body`; el relleno lo da el layout | El layout del panel (5.2) controla márgenes por rango |
| `mobile/app.json` | `userInterfaceStyle: automatic` | `light` hasta HU-31 | Evita barra de estado y teclado oscuros sobre pantallas claras |
| `web/index.html` | `<title>UniRide · Panel</title>` | Mantener y agregar el nombre de cada página: "Solicitudes · UniRide" | Orientación en pestañas del navegador y lectores de pantalla |

### 14.5 Reglas de implementación

1. **Sin librerías de UI** (Material UI, Tamagui, NativeBase, Tailwind, etc.): contradicen la regla de simplicidad y requieren aprobación (`AGENTS.md` §14). Se usan componentes core de React Native y HTML semántico.
2. **No usar `expo-glass-effect`** (efecto de vidrio de iOS, ajeno al estilo plano y a Android) ni los componentes de `@expo/ui` salvo `DatePicker`. Son restos de la plantilla de Expo; se revisan con el equipo al construir pantallas reales.
3. **Ningún literal visual en pantallas**: colores, tamaños, radios, espacios y duraciones salen de los tokens.
4. **Ningún texto literal**: todo pasa por `t()`.
5. **La interfaz no decide**: no calcula montos, reembolsos ni estados del viaje; los muestra desde la API. Sin actualizaciones optimistas en dinero, membresías ni verificación.
6. **Pruebas por rol y nombre accesible** (`getByRole('button', { name: … })`), como ya hace `inicio.test.tsx`. Si un elemento no se puede encontrar por rol, probablemente tampoco es accesible.
7. Cada componente nuevo trae prueba de sus estados (reposo, deshabilitado, cargando, error) en Jest (móvil) o Vitest + Testing Library (web).
8. **React Compiler está activo** [Existe: `experiments.reactCompiler` en `app.json`]: no se agrega `useMemo`/`useCallback` manual para estilos o callbacks salvo medición.
9. Animaciones con `Animated` de React Native o CSS; `react-native-reanimated` [Existe, instalado] solo si una animación lo necesita de verdad.
10. Nombres en español y sin tildes (D-19): `Boton`, `TarjetaViaje`, `alPresionar`, `estilos`, `contenedor` [Existe].

---

## 15. Gobernanza (Governance)

1. **Fuente de verdad.** Este archivo. El prototipo de Figma (PB-03) se construye con estos tokens y componentes; si el prototipo propone algo distinto, primero se actualiza este documento.
2. **Cómo se cambia.** Por PR en el repositorio principal que modifique este archivo, con la razón y las pantallas afectadas; un cambio de token incluye los PR en `mobile/` y `web/` que actualizan `tokens.ts` y `tokens.css`. Revisión de otro integrante, como todo cambio (`AGENTS.md` §8).
3. **Decisiones no triviales** (marca, paleta, navegación raíz, un componente nuevo de uso general) se registran antes en `.agents/MEMORY/MEMORY.md` (constitución Art. 11).
4. **Criterio para un componente nuevo:** (a) lo necesita una HU con `plan.md` aprobado; (b) no existe uno en la sección 8 que lo resuelva con una variante; (c) se documenta aquí con anatomía, variantes, estados y cuándo no usarlo. Se crea dentro de esa HU, no "por si acaso".
5. **Criterio para un token nuevo:** solo si ningún token existente sirve y el valor se repetirá; debe declarar su contraste si es color.
6. **Retiro:** un componente o token que nadie usa se elimina del código y de este documento en el mismo PR.
7. **Promoción de [Propuesta] a [Existe]:** al implementarse, se cambia la marca en este documento en el mismo PR.
8. **Validación con usuarios:** los hallazgos de la prueba SUS (HU-30) entran al backlog y, si cambian un patrón, se reflejan aquí.
9. **Mantenimiento:** al cierre de cada sprint se revisa la sección 17 y el historial.

### Historial de cambios

| Fecha | Cambio | Autor |
|---|---|---|
| 2026-10-16 | Versión inicial: análisis del repositorio y propuesta completa del sistema | Agente, a pedido del PO |
| 2026-10-16 | Propuesta de marca: isotipo, logotipo, firma horizontal e ícono de app en `marca/` (3.4) | Agente, a pedido del PO |
| 2026-10-16 | Marca aprobada por el PO y aplicada a los íconos de `mobile/` y `web/` | Agente, a pedido del PO |
| 2026-10-17 | Propuesta de identidad más expresiva tras revisar el prototipo de S1: P10 reformulado, zonas de marca (3.5), tokens de marca (4.1.1), familia display (4.2), nivel de elevación 0,5 (4.6), animaciones con nombre (4.7), `BandaMarca` e `Ilustracion` (8.12), `BarraLateral` oscura. Aprobada por el PO el mismo día | Agente, a pedido del PO |
| 2026-10-23 | Rediseño de UI de `web/` y `mobile/` sobre este sistema (rama `feat/PB-03-rediseno-ui`): tokens completos (color de estado, marca, movimiento, capas), `altoControl` web 40 → 44, Bricolage Grotesque 800 en `web/public/fuentes/`, íconos Material Symbols en `web/src/iconos/rutas.ts`. Pasan a **[Existe]**: web `Icono`, `Boton` (+ `peligro`, `compacto`, `icono`, enlace), `BotonIcono`, `Campo` (mostrar contraseña, sufijo), `Aviso`, `Notificacion`, `Dialogo`, `EtiquetaEstado`, `Tabla` (tarjetas < 640 px), `GrupoOpciones`, `EstadoVacio`, `Esqueleto`, `Ilustracion`, `BarraLateral` oscura; móvil `Icono`, `BotonIcono`, `Aviso`, `EtiquetaEstado`, `BandaMarca`, `Ilustracion`, zona de acción fija. Desvíos: en móvil la `Ilustracion` se arma con `View` (sin `react-native-svg`), por eso no tiene `trazoIlustracion`; la familia display aún no se carga en móvil | Agente, a pedido del equipo |

---

## 16. Checklist de calidad (Quality Checklist)

Se copia en la descripción del PR de toda HU con interfaz y se marca antes de pedir revisión.

**Propósito y flujo**
- [ ] La pantalla tiene un objetivo nombrable y **una sola** acción primaria visible.
- [ ] El flujo principal sigue en **≤ 4 pasos** (si se tocó).
- [ ] El título dice dónde está la persona; la pestaña activa y la organización activa son visibles donde corresponde.
- [ ] Después de una acción completada, "atrás" no permite repetirla.

**Tokens y componentes**
- [ ] Sin colores, tamaños, espacios, radios ni duraciones literales.
- [ ] Solo componentes de la sección 8 (o uno nuevo documentado aquí).
- [ ] Estados de dominio con `EtiquetaEstado` y la tabla 4.1.2.
- [ ] Montos, horas y fechas con `formato.ts`.

**Estados**
- [ ] Diseñados: cargando, vacío, error recuperable, sin conexión y, si aplica, pendiente, vencido, bloqueado y requisito faltante.
- [ ] Ningún botón deshabilitado sin la razón visible.
- [ ] Ante una falla externa nada queda a medias y el mensaje dice qué hacer.

**Seguridad y dinero**
- [ ] Toda acción que mueve dinero o verifica muestra monto y efecto antes de confirmar, y pide biometría.
- [ ] La interfaz no calcula montos ni estados: los muestra desde la API.
- [ ] No se muestran datos sensibles (fotos de carnet, rostro o vehículo; datos de otros más allá de la proyección mínima).
- [ ] Los errores no revelan si un correo tiene cuenta.

**Voz**
- [ ] Si la HU tiene comandos de voz: cada uno lleva a la misma pantalla que su alternativa táctil, repregunta ante duda y nunca confirma.

**Accesibilidad**
- [ ] Contraste según 4.1.1; estado nunca solo por color.
- [ ] Objetivos táctiles ≥ 48 dp (móvil) / ≥ 44 px en acciones principales (web).
- [ ] Roles y nombres accesibles en todo lo interactivo; tarjetas con nombre compuesto.
- [ ] Revisado con texto al 200 % y con TalkBack (móvil) o solo teclado (web).
- [ ] Respeta "reducir movimiento".

**Contenido**
- [ ] Todos los textos en `es-BO.json`, en tuteo, sin términos técnicos de la tabla 13.2.
- [ ] Botones con verbo + objeto; errores con "qué pasó + qué hacer".

**Pruebas**
- [ ] Pruebas por rol y nombre accesible para los estados principales.
- [ ] Probado en un Android de 360 dp de ancho (móvil) o en 360 px y 1280 px (web).

---

## 17. Pendientes e incertidumbres

Cosas que el análisis no pudo resolver. Las que necesitan una dependencia nueva requieren aprobación (`AGENTS.md` §14); se recomienda registrarlas en `MEMORY.md`.

| ID | Tema | Situación | Propuesta | Bloquea |
|---|---|---|---|---|
| P-01 | Marca (logotipo, ícono, splash, favicon) | **Resuelto** el 16/10/2026: aprobada por el PO (3.4) | Fusionar `feat/PB-03-marca` en `mobile/` y `web/` y actualizar los punteros | — |
| P-02 | Generar y escanear QR | No hay librería instalada | Evaluar `expo-camera` (escaneo) y un generador de QR en SVG; decidir en el plan de HU-22 | HU-22 |
| P-03 | Mapa con OpenStreetMap | Stack fijado, librería no elegida | El mapa es secundario (P8): primero lista y textos; mapa en detalle y viaje en curso. Decidir librería en el plan de HU-17/HU-23 | HU-23 |
| P-04 | Reconocimiento y síntesis de voz | Android SpeechRecognizer es el stack, pero no hay módulo instalado que lo exponga ni uno de texto a voz | Decidir en el plan de HU-27 | HU-27, HU-28 |
| P-05 | Biometría y prueba de vida | La llave del Keystore con biometría y la UI de Face Liveness requieren módulos nativos | El diseño de 9.6 y 8.9 envuelve esas pantallas; la UI interna de Face Liveness la impone AWS | HU-08, HU-09, HU-29 |
| P-06 | Monto del reembolso antes de cancelar | La API no expone una vista previa | Agregar el monto de reembolso vigente a `GET /reservas/{id}` para no calcularlo en el cliente | HU-20 |
| P-07 | Paleta y tipografía | Propuestas sin validar; el 17/10 se sumaron las zonas de marca y la familia display (3.5, 4.2) | Validar en PB-03 con el PO; probar la banda de marca y el saldo oscuro al sol en un teléfono real | Implementación de `BandaMarca` |
| P-08 | Selector de hora | `DatePicker` de `@expo/ui` instalado; no se verificó el modo hora | Verificar en HU-17 | HU-17 |
| P-09 | Nombre visible de otras personas | Las specs no lo definen | "Nombre + inicial del apellido" (exposición mínima) | HU-18 |
| P-10 | Unidad monetaria visible | El documento técnico habla de Bs y URC | Mostrar siempre "URC" y la equivalencia en Bs solo al recargar; confirmar con el PO | HU-13, HU-14 |
| P-11 | Administrador de varias organizaciones en web | Las specs no definen un selector de organización en el panel | Si ocurre, selector en la cabecera de la `BarraLateral` reutilizando el cambio de organización activa de HU-07 | — |
| P-12 | Formato de hora | `es-BO` usa 12 h por defecto | 24 h (4.9); confirmar con el PO | — |
| D-08 | Voz en el panel web | Abierta en `MEMORY.md` | Sin voz en web hasta que se decida | Web |
| D-13 | Biometría en la recarga | Abierta | El patrón 9.6 aplica si se decide que sí | HU-13 |
| D-17 | Calificación en los resultados | Abierta | Espacio reservado en `TarjetaViaje`, oculto hasta decidir | HU-18 |
