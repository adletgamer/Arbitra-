# Arbitra ⚖️ 🚀

> **Capital programable para incubadoras universitarias.**

Arbitra transforma el presupuesto de los programas de incubación y aceleración académica en capital programable. A través de una arquitectura híbrida (Onchain/Offchain) optimizada en **Arbitrum**, los fondos de los grants no se liberan por confianza subjetiva o burocracia administrativa, sino mediante evidencia verificable, auditoría automatizada por IA y reglas de gobernanza inmutables.

---

## 🌌 Visión del Producto

Arbitra se presenta como un **sistema operativo de incubación**, resolviendo la opacidad financiera y la fatiga operativa de los comités evaluadores. 

* 🛠️ **Control:** Monitoreo exacto de los fondos comprometidos, liberados y en disputa.
* 📊 **Claridad:** Dashboards segmentados para 3 perfiles (Administrador de Incubadora, Startup Beneficiaria y Mentor).
* ⚡ **Velocidad:** Automatización de aprobaciones de bajo riesgo mediante un motor de IA explicable.
* 📜 **Evidencia:** Registro inmutable de entregables vinculados a smart contracts con liquidación inmediata.

---

## 🛠️ Arquitectura Tecnológica

### 1. Capa Onchain (Arbitrum Ecosystem)
Seleccionamos **Arbitrum** debido a sus ventajas operativas críticas para la escala institucional:

* **Arbitrum Nitro:** Alto throughput y ejecución ultra-eficiente para manejar múltiples eventos operativos y transacciones frecuentes por cohorte sin fricciones de costo.
* **Soft Finality:** Confirmaciones rápidas en segundos para la liberación de tramos y actualizaciones de hitos en la app.
* **Seguridad Ethereum:** Respaldo y confianza institucional para universidades tradicionales.

#### Smart Contracts Sugeridos (Mocks incluidos)
* `ProgramTreasury`: Administra los saldos y presupuestos generales de las cohortes.
* `MilestoneEscrow`: Custodia y libera fondos condicionados a cada startup/hito.
* `RoleRegistry`: Mapea permisos y wallets institucionales de mentores y administradores.

### 2. Capa Offchain (Estructura de Datos Híbrida)
La plataforma implementa un modelo relacional robusto para almacenar la experiencia operativa del producto sin saturar la blockchain:

* **Base de Datos SQL:** Gestión de perfiles, organizaciones, métricas analíticas detalladas y logs de auditoría de plataforma.
* **Motor de Validación de Evidencias:** Integración vía API (GitHub commits, Figma tokens, analíticas de plataformas) analizadas de manera explicable por agentes de Inteligencia Artificial.

---

## 🎨 Principios de Diseño UI/UX

La interfaz ha sido diseñada bajo el concepto de **"Minimalismo institucional + cyberpunk sobrio"**, priorizando la seriedad institucional sin perder la identidad Web3 innovadora.

| Elemento | Detalle / Código Hex |
| :--- | :--- |
| **Fondo Base** | `#0A0F14` / `#0E1117` |
| **Acento Primario** | Cyan Eléctrico (`#2FE6FF`) para estados activos e interacciones |
| **Microinteracciones** | Transiciones rápidas de 160–220 ms con respuestas instantáneas y *skeleton loaders* para evitar la fatiga visual. |

---

## 🚀 Alcance del MVP (Hackatón Demo)

Para la presente versión de evaluación, el MVP simula con éxito un flujo operativo completo de punta a punta:

1. **Institución:** Creación de un programa y definición de 2 hitos con montos financieros asignados.
2. **Depósito:** Simulación de bloqueo de fondos (`funded`) en el contrato de Escrow.
3. **Evidencia:** Envío de entregables por parte de la startup beneficiaria.
4. **Validación:** Evaluación automatizada simulada por IA con score explicable y liberación automática del pago onchain (`paid_out`).

---

## 🔮 Roadmap Futuro

* 🌐 **Orbit Chain Propia:** Migración a una Layer 3 especializada para abaratar costos en redes de universidades interconectadas.
* 🦀 **Stylus Integration:** Implementación de lógica de validación avanzada y componentes nativos en Rust/C++.
* 🏛️ **Gobernanza DAO:** Votaciones de comités estudiantiles y fondos de investigación completamente descentralizados.

---
Desarrollado con ❤️ para la Ideatón Interuniversitaria.
