# Context — definición de mercado y posicionamiento

## 1. Resumen ejecutivo

**Context** es una librería enfocada en transformar un proyecto de software real en **contexto útil, estructurado y accionable para asistentes de código y agentes LLM**.

No busca reemplazar herramientas como Copilot, Codex, Cursor o Claude Code.
Busca resolver una capa previa y crítica:

> entregar a la IA el contexto correcto del proyecto correcto, en el momento correcto.

El mercado ya validó la necesidad de asistentes de código, pero todavía existe una brecha importante entre **generar código** y **entender bien un sistema real**.

Ahí se posiciona Context.

---

## 2. El problema real

Los asistentes de código suelen fallar menos por incapacidad técnica del modelo y más por **falta de contexto bien estructurado**.

En proyectos reales, la información importante está dispersa entre:

- estructura de carpetas
- convenciones internas
- documentación parcial o desactualizada
- decisiones de arquitectura no formalizadas
- ejemplos válidos y ejemplos obsoletos
- reglas del framework
- dependencias y configuraciones activas
- restricciones de negocio

### Consecuencia

El developer termina reinyectando manualmente contexto en:

- prompts
- chats
- archivos de reglas
- documentos auxiliares
- sesiones repetidas

Esto genera:

- respuestas inconsistentes
- cambios que no respetan la arquitectura
- pérdida de tiempo corrigiendo a la IA
- baja confianza en el agente
- dificultad para escalar el uso en equipos

---

## 3. Declaración del problema

> Los asistentes y agentes de código trabajan con contexto incompleto, genérico o mal priorizado, lo que reduce precisión, consistencia y confianza al operar sobre proyectos reales.

### Causa raíz

El conocimiento del proyecto no está consolidado en una única fuente de verdad consumible por IA.

### Oportunidad

Crear una capa que descubra, estructure y entregue ese conocimiento de forma reutilizable para modelos y agentes.

---

## 4. Nicho de mercado

La categoría más precisa para Context hoy es:

**Context engineering / repository intelligence para asistentes de código y agentes LLM**.

También puede describirse como:

- project context layer for AI coding assistants
- repository understanding toolkit for LLMs
- structured context engine for codebases

### Lo que NO es

Context no es:

- un IDE con IA
- un chatbot de programación genérico
- un simple empaquetador de repositorios
- un buscador semántico aislado
- un reemplazo de agentes existentes

### Lo que SÍ es

Context es:

- una capa de descubrimiento de contexto del proyecto
- una capa de estructuración de conocimiento técnico
- una forma reusable de preparar un repo para LLMs
- una base para agentes que necesitan entender mejor la codebase

---

## 5. Qué realidad estamos publicando

La realidad que Context quiere hacer visible es esta:

> La IA no falla solamente por modelo.
> Muchas veces falla porque no entiende suficientemente bien el sistema en el que está trabajando.

Por eso, la propuesta central es:

> Context ayuda a transformar un proyecto en contexto confiable, estructurado y útil para IA.

Versión técnica:

> Context es una librería de repository intelligence y context engineering que detecta estructura, documentación, convenciones y señales relevantes del proyecto para producir contexto listo para LLMs y agentes.

---

## 6. Segmento objetivo inicial

### ICP inicial (ideal customer profile)

#### 1. Developers individuales avanzados
Personas que ya usan Copilot, Cursor, Codex, Claude Code u otros asistentes y quieren reducir ambigüedad en proyectos medianos o grandes.

#### 2. Equipos técnicos
Equipos que quieren estandarizar cómo comparten contexto con IA y reducir diferencias entre developers, sesiones y herramientas.

#### 3. Proyectos legacy o complejos
Repositorios donde el conocimiento está repartido y la IA necesita guía adicional para no romper convenciones o arquitectura.

#### 4. Equipos multi-stack
Organizaciones que trabajan con más de un framework y necesitan una forma homogénea de exponer contexto útil.

---

## 7. Competencia y alternativas actuales

Context compite de forma indirecta con varias capas del ecosistema, pero no coincide exactamente con ninguna.

### A. Asistentes de código
Ejemplos:
- GitHub Copilot
- Cursor
- Claude Code
- Codex

**Qué resuelven:** generación, edición, navegación, ejecución parcial.

**Vacío:** dependen de contexto externo o contexto manualmente suministrado.

### B. Empaquetadores de repositorio
Ejemplos:
- herramientas tipo repo-to-prompt / repomix

**Qué resuelven:** compactar o exportar contenido del repo para el modelo.

**Vacío:** entregan volumen, no necesariamente criterio ni priorización inteligente.

### C. Code search / indexadores
Ejemplos:
- buscadores semánticos de código
- herramientas de mapeo de símbolos

**Qué resuelven:** recuperación e indexación.

**Vacío:** no convierten por sí solos el repo en una narrativa o estructura contextual reusable.

### D. Rule files / instrucciones manuales
Ejemplos:
- archivos de reglas del asistente
- prompts persistentes

**Qué resuelven:** guías explícitas para el modelo.

**Vacío:** normalmente son manuales, incompletos, frágiles y poco conectados al estado real del código.

### E. MCP servers / conectores
**Qué resuelven:** exponer recursos y herramientas a agentes.

**Vacío:** no definen por sí solos qué contexto es el correcto ni cómo construirlo bien.

### Posicionamiento diferencial

Context puede ubicarse como:

> la capa que prepara y organiza el conocimiento del proyecto para que cualquier asistente o agente trabaje mejor.

---

## 8. Propuesta de valor

### Propuesta de valor corta

**Context mejora la calidad del trabajo de la IA sobre proyectos reales al convertir la codebase en contexto estructurado y reusable.**

### Propuesta de valor extendida

Context permite:

- detectar el stack y la estructura del proyecto
- identificar archivos y módulos relevantes
- ubicar documentación útil y fuentes de verdad
- reconocer convenciones y señales del framework
- seleccionar contexto prioritario según tarea
- preparar salidas consumibles por LLMs y agentes

---

## 9. Diferenciador clave

El mayor diferenciador no es “leer más archivos”.

Es este:

> decidir qué contexto vale la pena entregar y cómo estructurarlo para una tarea real.

Eso mueve a Context desde una herramienta de lectura a una herramienta de **curación contextual**.

---

## 10. Hipótesis fundacional

Si una IA recibe contexto de proyecto mejor estructurado, entonces debería mejorar en:

- precisión técnica
- consistencia arquitectónica
- respeto por convenciones del equipo
- menor necesidad de corrección manual
- menor fricción en onboarding
- mayor confianza del developer

---

## 11. MVP recomendado

El MVP no debe intentar resolver todos los frameworks ni todos los agentes.

### Objetivo del MVP

Demostrar que Context puede convertir una codebase real en una salida útil para IA.

### Alcance mínimo recomendado

1. **Detección de framework**
   - Laravel
   - Next.js / TypeScript
   - Spring Boot

2. **Descubrimiento estructural**
   - archivos base
   - carpetas principales
   - módulos relevantes
   - configuraciones activas

3. **Descubrimiento documental**
   - README
   - docs
   - archivos de reglas
   - ejemplos canónicos

4. **Generación de contexto estructurado**
   - resumen del proyecto
   - mapa técnico
   - convenciones detectadas
   - archivos prioritarios por tipo de tarea

5. **Salida portable**
   - markdown
   - json
   - formato consumible por agentes

---

## 12. Tesis de producto

La tesis de Context puede expresarse así:

> En el desarrollo asistido por IA, la calidad del resultado depende fuertemente de la calidad del contexto entregado.
> Context existe para convertir proyectos reales en contexto confiable y reutilizable.

---

## 13. Mensajes base para publicar el proyecto

### Mensaje 1
**Context turns real codebases into useful AI context.**

### Mensaje 2
**Give coding agents structure, not just files.**

### Mensaje 3
**Your assistant does not only need code. It needs project understanding.**

### Mensaje 4
**Context helps LLMs work with your project the way your team expects.**

---

## 14. Qué sigue después de esta definición

Con esta base, el proyecto puede evolucionar en cuatro líneas:

1. definir manifiesto y principios
2. diseñar arquitectura del núcleo y adaptadores por framework
3. construir el MVP con un flujo CLI simple
4. validar con repos reales y comparar calidad de salida para IA

---

## 15. Definición oficial sugerida

### Definición breve
Context es una librería de context engineering para proyectos de software que transforma estructura, documentación y convenciones del repositorio en contexto útil para asistentes de código y agentes LLM.

### Definición extendida
Context ayuda a desarrolladores y equipos a convertir una codebase real en una representación estructurada y accionable del proyecto, permitiendo que herramientas de IA comprendan mejor la arquitectura, las reglas, la documentación y las señales técnicas antes de analizar, modificar o generar código.
