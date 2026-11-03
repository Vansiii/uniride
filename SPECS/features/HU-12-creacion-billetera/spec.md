# HU-12 · Creación de billetera — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-02)` · Épica: E4 Billetera y Pagos · Prioridad: Must · PHU: 5 · Sprint: S2
> Requisito del docente que cubre: **3 — Billetera blockchain propia que acredita y descuenta saldo**
> Amenazas que toca: **A-12** (Robar llaves del servidor) y **A-02** (Una persona con varias cuentas / billeteras)

## 1. Historia

**Como** usuario con identidad verificada
**quiero** tener una billetera blockchain creada automáticamente
**para** poder pagar y cobrar viajes con el token URC sin configurar llaves ni entender de criptografía.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | una persona cuya verificación de identidad (HU-08) acaba de ser aprobada | el sistema procesa su alta financiera | se genera automáticamente una dirección blockchain en la red Polygon Amoy asociada a su cuenta, con saldo inicial 0 URC |
| CA-2 | una cuenta que ya tiene una billetera creada (Amenaza A-02) | se intenta invocar nuevamente la creación | el sistema responde de forma idempotente con la billetera ya existente, sin generar una segunda dirección |
| CA-3 | cualquier consulta o auditoría de la base de datos, logs o respuestas de la API (Amenaza A-12) | se inspecciona la información de la billetera | nunca existe una llave privada legible ni frase semilla; solo se expone la dirección pública (`0x...`) |
| CA-4 | un usuario con identidad en estado `No_verificada`, `Pendiente` o `Rechazada` | intenta solicitar la creación de su billetera o acceder a funciones de saldo | el servidor lo rechaza con código 403 exigiendo verificar su identidad primero |
| CA-5 | una persona con billetera activa | consulta su perfil o sección de billetera en la app móvil | ve su dirección pública acortada, opción para copiarla completa y enlace para verla en el explorador de bloques (Polygonscan Amoy) |
| CA-6 | una falla temporal de conexión con el proveedor de llaves o el nodo blockchain | se está creando la billetera | la operación no queda a medias ni crea registros corruptos en la base de datos; responde con error recuperable |

## 3. Reglas de negocio

- RN-1: **Automatismo y requisito previo:** La billetera se crea de forma inmediata y obligatoria tras completar la verificación de identidad (HU-08). Sin identidad aprobada no existe billetera.
- RN-2: **Unicidad:** Exactamente **una sola billetera por usuario** en toda la plataforma UniRide (A-02).
- RN-3: **Custodia no exportable (A-12):** Las llaves privadas se gestionan en hardware seguro de AWS KMS (o nodo local en desarrollo); nunca residen en código ni en la base de datos relacional.
- RN-4: **Red y moneda:** Opera exclusivamente en la red de pruebas **Polygon Amoy** (Chain ID 80002). El token oficial es **UniCoin (URC)**. Nunca se conecta a mainnet (`AGENTS.md` §11).
- RN-5: **Gasless (Relayer):** El usuario no necesita tener moneda nativa (MATIC/POL) para gas. Todas las transacciones las orquesta y subsidia la cuenta relayer del sistema.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Identidad no verificada (CA-4) | Rechazo 403 | `billetera.creacion.identidad_requerida` |
| Billetera ya existente (CA-2) | Respuesta idempotente con la existente | `billetera.creacion.ya_existe` |
| Falla de AWS KMS o nodo RPC (CA-6) | Estado consistente; error 503 | `billetera.creacion.servicio_no_disponible` |
| Cuenta deshabilitada o suspendida | Rechazo 403 | `billetera.creacion.cuenta_suspendida` |

## 5. Fuera de alcance de esta HU

- Recarga de saldo con dinero simulado → HU-13.
- Consulta de movimientos históricos y conciliación contable → HU-14.
- Retiro simulado de fondos → HU-16 (en Reserva).
- Pasarelas bancarias con dinero real o criptomonedas con valor de mercado (fuera de alcance v1).

## 6. Dependencias

- **HU-08:** Verificación de identidad aprobada.
- **PB-04:** Contratos inteligentes desplegados (`UniCoin.sol` y `EscrowUniRide.sol` en `contracts/`).

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Criterios CA-1 a CA-6 cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura en backend ≥ 70 %.
- [ ] Prueba de que la llave privada nunca se almacena en la base de datos (A-12) en verde.
- [ ] PR revisado · CI en verde.
- [ ] Documentado en Swagger.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-02 | Creación (borrador) | — |
| 2026-11-02 | Aprobación de spec y plan; custodia dual sin costo base y relayer gasless | 2026-11-02 · HU-12 Creación de billetera: spec y plan técnico aprobados |

