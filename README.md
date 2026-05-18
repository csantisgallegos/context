# @csantisgallegos/context

> Toolkit en TypeScript para convertir proyectos de software en contexto estructurado, auditado y listo para agentes IA.

---

## ¿Qué problema resuelve?

Los agentes IA (Claude Code, Copilot, Codex) no fallan solo por incapacidad del modelo.  
Fallan porque **no entienden suficientemente bien el proyecto en el que están trabajando**.

El developer termina reinyectando contexto manualmente en cada sesión: qué framework se usa, qué convenciones tiene el equipo, qué no se debe tocar, qué datos personales maneja el sistema. Esto es lento, inconsistente y no escala en equipos.

**Context** resuelve esa capa: escanea tu repositorio, evalúa su estado de calidad y seguridad, y entrega al agente el contexto correcto en el formato que necesita — antes de que escriba una sola línea de código.

---

## Cómo funciona

El núcleo es un patrón **Source → Engine → Output**:

```
[Tu proyecto]
      ↓
[Adaptadores]     ← cada uno recolecta un tipo de contexto
      ↓
[ContextEngine]   ← agrega, prioriza y filtra el contexto
      ↓
[Output]          ← genera el formato que el agente necesita
```

Cada **adaptador** es independiente y enfocado en una fuente:

| Adaptador | Qué recolecta |
|-----------|--------------|
| `GenericFsAdapter` | Estructura de carpetas del proyecto |
| `GitAdapter` *(v0.4.0)* | Rama actual, commits recientes, autores |
| `PackageJsonAdapter` *(v0.4.0)* | Stack tecnológico, dependencias, scripts |
| `EnvAdapter` *(v0.4.0)* | Variables de entorno (solo keys, nunca valores) |
| `SecurityStandardsAdapter` *(v0.3.0)* | Señales ISO 27001/27002 — secrets, accesos, dependencias |
| `QualityStandardsAdapter` *(v0.3.0)* | Señales ISO 25010 — tests, linting, documentación |
| `LifecycleStandardsAdapter` *(v0.3.0)* | Señales ISO 12207 — CI/CD, despliegue, mantenimiento |
| `PrivacyStandardsAdapter` *(v0.3.0)* | Señales ISO 27701 — PII, consentimiento, retención |

---

## Instalación

```bash
git clone https://github.com/csantisgallegos/context.git
cd context
npm install
npm run build
```

---

## Uso rápido

### CLI

```bash
# Instalar el CLI globalmente
cd packages/context-cli
npm link

# Escanear un proyecto
context scan --project-root=/ruta/a/tu/proyecto
```

Genera en `context/`:
- `context.json` — contexto estructurado en JSON
- `context.md` — contexto legible en Markdown
- `CLAUDE.md` *(v0.5.0)* — archivo listo para Claude Code
- `agent-manifest.json` *(v0.5.0)* — manifiesto multi-agente

### Uso programático

```typescript
import { ContextEngine, ContextPriority } from '@csantisgallegos/context-core';
import { GenericFsAdapter } from '@csantisgallegos/context-adapter-generic-fs';

const engine = new ContextEngine();

// Registrar fuentes con prioridad
engine.addSource(new GenericFsAdapter({ projectRoot: '.' }), ContextPriority.Medium);

// Definir el agente que recibirá el contexto
engine.setAgent({
  id: 'agent-001',
  name: 'Agente de desarrollo',
  role: 'developer',
  capabilities: ['read-code', 'write-code', 'run-tests'],
});

// Generar outputs
const json     = await engine.toJSON();
const markdown = await engine.toMarkdown();
```

---

## Outputs disponibles

### `toJSON()` / `toMarkdown()` — Contexto general

Formatos de propósito general. Útiles para inspección, logging y consumo programático básico.

### `toSystemPrompt()` *(v0.5.0)* — Inyección directa en LLMs

```typescript
const prompt = await engine.toSystemPrompt({ language: 'es' });
// → System prompt listo para pasar a cualquier LLM
```

Genera un system prompt con secciones: ROL, CONTEXTO DEL PROYECTO, STACK TECNOLÓGICO, CUMPLIMIENTO.

### `toCLAUDEmd()` *(v0.5.0)* — Para Claude Code

```typescript
const claudeMd = await engine.toCLAUDEmd();
// → CLAUDE.md con estructura que Claude Code lee automáticamente
```

Incluye comandos disponibles, arquitectura del proyecto, convenciones detectadas y señales de compliance críticas.

### `toAgentManifest()` *(v0.5.0)* — Multi-agente

```typescript
engine.addAgent({
  profile: { id: 'sec-agent', name: 'Auditor', role: 'security-auditor', capabilities: ['read-code', 'security-review'] },
  scope: { filePatterns: ['src/**/*.ts'], capabilities: ['read-code'] },
  restrictions: ['No modificar archivos de producción'],
});

const manifest = await engine.toAgentManifest();
```

Define el contrato de cada agente: qué puede leer, qué puede modificar, qué restricciones tiene.

---

## Capa de estándares ISO

Los adaptadores ISO son la diferencia central de esta librería.  
No son burocracia — son **señales de riesgo que el agente necesita conocer antes de actuar**.

```typescript
import { StandardsEngine } from '@csantisgallegos/context-standards';
import { SecurityStandardsAdapter } from '@csantisgallegos/context-adapter-iso-27001';
import { QualityStandardsAdapter } from '@csantisgallegos/context-adapter-iso-25010';

const standards = new StandardsEngine();
standards.addSource(new SecurityStandardsAdapter());
standards.addSource(new QualityStandardsAdapter());

const report = await standards.evaluate('/ruta/al/proyecto');

console.log(report.overallScore);      // 0-100
console.log(report.criticalIssues);   // señales que el agente no debe ignorar
```

### Estándares implementados

| Estándar | Qué detecta |
|----------|------------|
| **ISO/IEC 27001:2022** | Secrets en código, .env sin .gitignore, dependencias sin lockfile, ausencia de auth |
| **ISO/IEC 27002:2022** | Controles de seguridad concretos asociados a 27001 |
| **ISO/IEC 25010** | Ausencia de tests, sin linting, TypeScript sin strict, README vacío, sin CI/CD |
| **ISO/IEC/IEEE 12207** | Sin proceso de requerimientos, sin diseño documentado, sin proceso de despliegue |
| **ISO/IEC 27701:2025** | Campos PII en modelos (RUT, email, teléfono), sin política de privacidad, sin consentimiento |

> **Nota de privacidad:** Los adaptadores ISO nunca leen ni exponen valores de datos personales o secrets. Solo detectan presencia de patrones en código estructural.

---

## Paquetes del monorepo

```
packages/
├── context-core                    → Motor central, interfaces y tipos base
├── context-adapter-generic-fs      → Adaptador de filesystem
├── context-adapter-git             → (v0.4.0) Adaptador de repositorio git
├── context-adapter-package-json    → (v0.4.0) Detección de stack tecnológico
├── context-adapter-env             → (v0.4.0) Variables de entorno enmascaradas
├── context-standards               → (v0.3.0) Motor de señales ISO
├── context-adapter-iso-27001       → (v0.3.0) Seguridad de la información
├── context-adapter-iso-25010       → (v0.3.0) Calidad del software
├── context-adapter-iso-12207       → (v0.3.0) Ciclo de vida del software
├── context-adapter-iso-27701       → (v0.3.0) Privacidad y datos personales
└── context-cli                     → Herramienta de línea de comandos
```

---

## Flujo de desarrollo con agentes IA

Las tareas de implementación están en [`tasks/`](./tasks/) como archivos JSON autocontenidos.  
Cada tarea puede ser ejecutada directamente por Claude Code, GitHub Copilot o Codex.

### Ejecutar una tarea con Claude Code

```bash
# 1. Abrir el proyecto en Claude Code
cd /ruta/al/proyecto
claude

# 2. Pasar el JSON de la tarea al agente
# En Claude Code: leer el JSON y pedir implementación
```

### Estructura de una tarea

```json
{
  "id": "p1-t01",
  "title": "Configurar Vitest como framework de testing",
  "phase": 1,
  "priority": "critical",
  "context": { "why": "...", "files_to_read": [...] },
  "steps": [...],
  "acceptance_criteria": [...],
  "agent_instructions": {
    "claude_code": "...",
    "copilot": "...",
    "codex": "..."
  }
}
```

Ver el [schema de tareas](./tasks/schema.json) para la estructura completa.

---

## Roadmap

| Versión | Estado | Contenido |
|---------|--------|-----------|
| `0.1.0` | ✅ Actual | Core engine, GenericFsAdapter, CLI básico |
| `0.2.0` | 🔲 Phase 1 | Vitest, tipos AgentProfile, sistema de prioridad |
| `0.3.0` | 🔲 Phase 2 | Capa ISO: context-standards + 4 adaptadores |
| `0.4.0` | 🔲 Phase 3 | Adaptadores Git, PackageJson, Env |
| `0.5.0` | 🔲 Phase 4 | toSystemPrompt(), toCLAUDEmd(), toAgentManifest() |

---

## Scripts

```bash
npm run build          # Compilar todos los paquetes
npm test               # Ejecutar tests en todos los paquetes
npm run test:coverage  # Tests con reporte de cobertura
npm run clean          # Limpiar artefactos de compilación
```

---

## Licencia

MIT — Carlos Santis ([@csantisgallegos](https://github.com/csantisgallegos))
