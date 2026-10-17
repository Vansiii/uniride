---
name: amenazas
description: Revisar un cambio de UniRide contra el modelo de amenazas A-01…A-13 y las reglas de aislamiento multi-organización, billetera y verificación. Usar al tocar auth, dispositivo, handshake, GPS, escrow/billetera, estados del viaje, RLS o cualquier consulta/endpoint con datos de organización.
---

# Revisión de amenazas

Fuente: `AGENTS.md` §5–§6, `SPECS/constitution.md` Art. 2–4, `SPECS/ssd.md` §5, §9, §10. Revisar el diff (`git diff` en cada submódulo tocado) y responder:

1. **Qué amenazas A-xx toca** (tabla de `AGENTS.md` §6). Para cada una: ¿existe prueba automatizada que demuestre que el ataque **falla**? Si no, proponerla o escribirla.
2. **A-13 aislamiento**: ¿todo registro de organización lleva `organizacion_id`, toda consulta filtra por él y RLS lo refuerza? ¿Hay prueba que lee/modifica datos de otra organización y falla? Datos personales: por dueño, a terceros solo la proyección mínima. Endpoint o consulta sin filtro = defecto bloqueante.
3. **El teléfono nunca decide**: ninguna validación movida al cliente; ningún dato del cliente (`verified`, estado, monto, GPS sin firma) se acepta sin verificar en servidor.
4. **Dinero**: idempotencia, ledger append-only, atomicidad, los viajes no crean saldo, escrow solo por el verificador, una vez por viaje en estado `Verificado`, solo testnet.
5. **Estados del viaje**: sin transiciones nuevas ni saltos (`AGENTS.md` §5.9).
6. **Secretos/datos sensibles**: nada en código, logs, errores ni respuestas; llaves solo en KMS; sin bypass fuera del modo emulador (apagado por defecto, bloqueado en producción).
7. **Confirmación humana** (`AGENTS.md` §14): marcar si el cambio exige una; detenerse y preguntar.

Salida: lista breve por hallazgo `archivo:línea · amenaza · riesgo · arreglo/prueba faltante`, o "sin hallazgos" con qué se revisó. No debilitar ninguna capa "temporalmente".
