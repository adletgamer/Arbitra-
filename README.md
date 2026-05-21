# Arbitra

> **Capital programable para incubadoras universitarias.** Transformando los presupuestos de innovación institucional en fondos transparentes, auditables y gobernados por evidencia on-chain.

---

## 📌 Visión General

**Arbitra** es un sistema operativo de incubación diseñado para mitigar la burocracia, eliminar la opacidad y acelerar el flujo de caja en los ecosistemas de aceleración universitaria. 

A diferencia de los modelos tradicionales basados en revisiones manuales, correos dispersos y PDFs frágiles, Arbitra introduce una infraestructura de **capital programable**. Los fondos de los grants institucionales se custodian en contratos inteligentes de Arbitrum L2, y su liberación parcial queda condicionada de forma automatizada por evidencias operativas auditadas por Inteligencia Artificial y respaldadas por gobernanza multifirma.

---

## 🏗️ Arquitectura del Sistema

Arbitra implementa una **arquitectura híbrida** optimizada para el rendimiento y la seguridad institucional:

* **Capa On-Chain (Arbitrum L2):** Custodia inmutable de tesorerías por programa, lógica de contratos *Escrow* por hitos, log transaccional histórico de eventos financieros (depósitos, liberaciones, pausas) y registro de gobernanza.
* **Capa Off-Chain (SaaS & Contexto IA):** Persistencia de experiencia de usuario, scoring detallado de Inteligencia Artificial (GitHub, Figma, analíticas de negocio), y orquestación de herramientas mediante el protocolo **MCP (Model Context Protocol)**.
* ---

## 👥 Matriz de Roles (Enfoque SaaS)

Para evitar la fatiga operativa y preservar el valor de la gobernanza, la interfaz se segmenta estrictamente en tres perfiles interactivos:

### 1. Administrador de la Incubadora
* Despliegue y configuración de cohortes, presupuestos y reglas de evaluación.
* Monitoreo global de riesgos del fondo y firmas de liberación multifirma.
* Controlador de seguridad perimetral (*Pause Guardian*) en caso de disputas.

### 2. Startup Beneficiaria
* Visualización del *roadmap* de hitos: condiciones de entrega y montos a desbloquear.
* Carga de entregables mediante la integración directa de herramientas de desarrollo.
* Acceso al botón de retiro (*Withdrawal*) una vez el hito es aprobado en la cadena.

### 3. Mentor / Auditor Técnico
* Bandeja de entrada optimizada solo para casos asignados o escalados.
* Acceso al panel explicable del score de la IA para validación de entregables.
* Emisión de veredicto definitivo: Aprobación, Observación o Escalamiento.

---

## ⚙️ Ciclo de Estados del Motor de Hitos

Cada contrato de fideicomiso (*MilestoneEscrow*) progresa secuencialmente a través de las siguientes fases controladas:

`[ Draft ]` ➔ `[ Funded ]` ➔ `[ In Progress ]` ➔ `[ Submitted ]` ➔ `[ AI Review ]` ➔ `[ Human Review ]` ➔ `[ Approved / Paid Out ]`

*Si ocurre una anomalía o desacuerdo entre las partes, el hito puede derivarse a los estados de `Disputed` o `Paused` bajo reglas de resolución preestablecidas.*

---

## 🚀 Propuesta de Valor de Arbitrum

La elección de **Arbitrum Nitro** como infraestructura de liquidación es el núcleo técnico que hace viable a Arbitra:

* **Operación de Bajo Costo:** Permite transacciones masivas, frecuentes y fraccionadas por cohorte (depósitos, pausas, micro-incentivos) con costos de gas insignificantes.
* **Soft Finality en Segundos:** Brinda una experiencia interactiva fluida dentro de la aplicación, confirmando estados de pago y auditorías casi en tiempo real.
* **Seguridad Heredada:** Respalda la confianza institucional y la auditoría contable de la universidad bajo la robustez de seguridad de Ethereum.
* **Escalabilidad Futura:** Compatibilidad total para evolucionar hacia una *Orbit Chain* dedicada si la red de incubadoras universitarias se expande en la región.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React, Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui.
* **Gestor de Paquetes:** pnpm.
* **Backend API:** Python, FastAPI, Uvicorn, Web3.py.
* **IA Puente:** Model Context Protocol (MCP) SDK.
