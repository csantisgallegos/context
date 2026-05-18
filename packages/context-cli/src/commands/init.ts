import * as fs from 'fs';
import * as path from 'path';

export interface InitOptions {
  projectRoot: string;
  force: boolean;
}

interface PackageJson {
  name?: string;
  version?: string;
  description?: string;
}

function readJsonSafe<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch {
    return null;
  }
}

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function writeIfNotExists(filePath: string, content: string, force: boolean): boolean {
  if (!force && fs.existsSync(filePath)) {
    return false;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

function buildProjectJson(projectName: string, slug: string, pkg: PackageJson | null): string {
  return JSON.stringify({
    id: slug,
    name: projectName,
    description: pkg?.description ?? '(Describe este proyecto en una oración)',
    version: pkg?.version ?? '0.1.0',
    language: 'es',
    domain: '(completar: ej. gestion-publica, ecommerce, saas)',
    agents: ['developer'],
  }, null, 2);
}

function buildArchitectureMd(projectName: string): string {
  return `# Arquitectura — ${projectName}

> Describe cómo está estructurado el proyecto. El agente de IA leerá esto al inicio de cada sesión.

## Estructura de carpetas

(Describe las carpetas principales y su propósito)

## Capas y módulos

(Describe las capas lógicas: API, servicios, UI, base de datos, etc.)

## Patrones de diseño usados

(Describe los patrones que el equipo usa: Repository, Service Layer, MVC, etc.)

## Dependencias principales

(Describe las dependencias clave y por qué se usan)
`;
}

function buildConventionsMd(projectName: string): string {
  return `# Convenciones — ${projectName}

> El agente de IA respetará estas convenciones al modificar código.

## Lenguaje

(Describe el lenguaje y versión: TypeScript 5, PHP 8.2, etc.)

## Nombrado

(Describe las reglas de nombres: camelCase para variables, PascalCase para componentes, etc.)

## Estructura de archivos

(Describe cómo se organizan los archivos: un componente por archivo, barrel exports, etc.)

## Lo que NO hacer

(Lista de prácticas prohibidas en este proyecto)

## Patrones aprobados

(Lista de patrones que el equipo ha acordado usar)
`;
}

function buildDeveloperAgentJson(): string {
  return JSON.stringify({
    id: 'developer',
    name: 'Agente de Desarrollo',
    role: 'developer',
    capabilities: ['read-code', 'write-code', 'run-tests', 'read-docs'],
    scope: {
      file_patterns: ['src/**', 'app/**', 'lib/**', 'components/**'],
      excluded_patterns: ['.env', '*.lock', 'dist/**', 'node_modules/**'],
    },
    restrictions: [
      'No modificar archivos de configuración de base de datos sin aprobar primero',
      'No instalar dependencias nuevas sin aprobación',
      'No modificar lógica de autenticación sin revisión de seguridad',
    ],
    instructions: '(Agrega aquí instrucciones específicas para este agente en este proyecto)',
  }, null, 2);
}

function buildFirstTaskJson(): string {
  const today = new Date().toISOString().split('T')[0];
  return JSON.stringify({
    id: 'primera-tarea',
    title: '(Reemplaza esto con el título de tu primera tarea)',
    created: today,
    status: 'active',
    context: {
      why: '(Explica por qué es necesaria esta tarea)',
      background: '(Información relevante del proyecto para esta tarea)',
    },
    scope: {
      can_modify: ['src/**'],
      cannot_modify: ['.env', 'database/migrations/**'],
      must_ask_before: [
        'cambiar schema de base de datos',
        'agregar dependencias',
      ],
    },
    steps: [
      '(Paso 1: describe qué debe hacer el agente)',
      '(Paso 2)',
    ],
    done_when: [
      '(Condición verificable de que la tarea está completa)',
    ],
  }, null, 2);
}

function buildAgentMd(projectName: string): string {
  return `# ${projectName}

> Contexto gestionado por @csantisgallegos/context
> Para actualizar señales técnicas: \`context scan --project-root=.\`

## Antes de empezar, lee:

- Arquitectura: [context/architecture.md](./context/architecture.md)
- Convenciones: [context/conventions.md](./context/conventions.md)
- Tu perfil: [context/agents/developer.json](./context/agents/developer.json)
- Tarea activa: ver [context/tasks/active/](./context/tasks/active/)

## Estado del proyecto

_(Las señales técnicas aún no han sido generadas. Corre \`context scan --project-root=.\` para actualizarlas.)_

## Comandos

\`\`\`bash
# (Se completarán automáticamente con context scan)
\`\`\`

---

NOTA: Este archivo se regenera automáticamente con cada \`context scan\`.
Cualquier agente de IA compatible con archivos de instrucciones puede configurarse para leer este archivo al inicio de cada sesión.
`;
}

export async function init(options: InitOptions): Promise<void> {
  const root = path.resolve(options.projectRoot);
  console.log(`Inicializando context/ en: ${root}`);

  const pkg = readJsonSafe<PackageJson>(path.join(root, 'package.json'));
  const projectName = pkg?.name ?? path.basename(root);
  const slug = nameToSlug(projectName);

  const contextDir = path.join(root, 'context');
  const dirs = [
    contextDir,
    path.join(contextDir, 'tasks', 'active'),
    path.join(contextDir, 'tasks', 'done'),
    path.join(contextDir, 'decisions'),
    path.join(contextDir, 'agents'),
    path.join(contextDir, 'signals'),
  ];

  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const generated: string[] = [];

  const files: Array<[string, string]> = [
    [path.join(contextDir, 'project.json'), buildProjectJson(projectName, slug, pkg)],
    [path.join(contextDir, 'architecture.md'), buildArchitectureMd(projectName)],
    [path.join(contextDir, 'conventions.md'), buildConventionsMd(projectName)],
    [path.join(contextDir, 'agents', 'developer.json'), buildDeveloperAgentJson()],
    [path.join(contextDir, 'tasks', 'active', 'primera-tarea.json'), buildFirstTaskJson()],
    [path.join(root, 'AGENT.md'), buildAgentMd(projectName)],
  ];

  for (const [filePath, content] of files) {
    const wrote = writeIfNotExists(filePath, content, options.force);
    if (wrote) {
      const rel = path.relative(root, filePath).replace(/\\/g, '/');
      generated.push(rel);
    }
  }

  if (generated.length === 0) {
    console.log('\ncontext/ ya existe y todos los archivos están presentes.');
    console.log('Usa --force para sobreescribir archivos existentes.');
    return;
  }

  console.log('\nArchivos generados:');
  for (const f of generated) {
    console.log(`  ✓ ${f}`);
  }

  console.log(`
Siguientes pasos:
  1. Edita context/architecture.md con la arquitectura real del proyecto
  2. Edita context/conventions.md con las reglas del equipo
  3. Edita context/tasks/active/primera-tarea.json con la tarea actual
  4. Corre: context scan --project-root=. (actualiza señales técnicas)
  5. Abre tu agente de IA apuntando a este directorio
`);
}
