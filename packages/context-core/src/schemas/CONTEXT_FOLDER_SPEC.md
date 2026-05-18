# Especificación de la carpeta context/

La carpeta `context/` es la fuente de verdad del proyecto para el agente de IA.
El agente la lee completa al inicio de cada sesión y entiende el proyecto sin instrucciones verbales del developer.

## Estructura

```
context/
├── project.json          → developer edita (generado por 'context init')
├── architecture.md       → developer escribe libremente
├── conventions.md        → developer escribe libremente
├── roadmap.md            → developer escribe libremente (opcional)
├── tasks/
│   ├── active/           → developer gestiona (con 'context task new')
│   │   └── *.json        → una tarea por archivo, schema: task.schema.json
│   └── done/             → herramienta gestiona (con 'context task done')
│       └── *-YYYY-MM-DD.json
├── decisions/            → developer escribe (Architecture Decision Records)
│   └── *.md
├── agents/               → developer edita (generado por 'context init')
│   └── *.json            → un perfil por agente, schema: agent.schema.json
└── signals/              → SOLO herramienta ('context scan'). NUNCA editar.
    ├── stack.json         → detectado de package.json / composer.json
    ├── git.json           → estado del repositorio git
    ├── structure.json     → árbol de carpetas del proyecto
    ├── security.json      → señales ISO 27001/27002
    ├── quality.json       → señales ISO 25010
    ├── lifecycle.json     → señales ISO 12207
    └── privacy.json       → señales ISO 27701 (PII detectado)
```

## Regla fundamental

> El agente de IA debe poder leer `context/` completo al inicio de cualquier sesión
> y entender el proyecto **sin que el developer le explique nada de forma verbal**.

## Responsabilidad por archivo

| Archivo | Quién escribe | Cuándo |
|---------|--------------|--------|
| `project.json` | `context init` → developer edita | Una vez al inicio |
| `architecture.md` | Developer | Cuando cambia la arquitectura |
| `conventions.md` | Developer | Al establecer o cambiar reglas del equipo |
| `tasks/active/*.json` | Developer (`context task new`) | Inicio de cada tarea |
| `tasks/done/*.json` | Herramienta (`context task done`) | Al cerrar una tarea |
| `decisions/*.md` | Developer | Al tomar una decisión técnica importante |
| `agents/*.json` | Developer (`context init` → edita) | Al incorporar o configurar un agente |
| `signals/*.json` | **SOLO** `context scan` | Cada vez que corre `context scan` |

## Archivos que escribe el developer vs la herramienta

**Developer escribe** (intención, arquitectura, reglas):
- `project.json` — identidad del proyecto
- `architecture.md` — cómo está construido
- `conventions.md` — cómo trabaja el equipo
- `tasks/active/*.json` — qué debe hacer el agente ahora
- `decisions/*.md` — por qué se eligió algo
- `agents/*.json` — qué puede hacer el agente

**Herramienta escribe** (señales técnicas objetivas):
- `signals/*.json` — estado real del código, nunca editar manualmente

## Comandos

```bash
# Inicializar context/ en un proyecto nuevo
context init --project-root=.

# Actualizar señales técnicas (signals/)
context scan --project-root=.

# Gestionar tareas
context task new "nombre de la tarea"
context task done "nombre de la tarea"
context task list

# Ver estado del proyecto
context status
```

## Schemas JSON

Cada tipo de archivo tiene su schema en este directorio:

- `project.schema.json` → para `project.json`
- `task.schema.json` → para `tasks/active/*.json` y `tasks/done/*.json`
- `agent.schema.json` → para `agents/*.json`
- `signal.schema.json` → para `signals/*.json`
