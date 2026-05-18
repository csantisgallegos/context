import * as fs from 'fs';
import * as path from 'path';
import { ContextSource, ContextData } from './types';

/**
 * Output format for context
 */
export interface ContextOutput {
  /**
   * Version of the context specification
   */
  contextSpecVersion: string;

  /**
   * Timestamp when context was generated
   */
  generatedAt: string;

  /**
   * Array of context data from all sources
   */
  contexts: ContextData[];
}

/**
 * Main engine for collecting and formatting context from multiple sources
 */
export class ContextEngine {
  private sources: ContextSource[] = [];
  private readonly specVersion = '0.1.0';

  /**
   * Register a context source
   * @param source The context source to add
   */
  addSource(source: ContextSource): void {
    this.sources.push(source);
  }

  /**
   * Collect context from all registered sources
   * @returns Promise that resolves to collected context data
   */
  async collectContext(): Promise<ContextOutput> {
    const contexts: ContextData[] = [];

    for (const source of this.sources) {
      try {
        const data = await source.collect();
        contexts.push(data);
      } catch (error) {
        console.error(`Error collecting context from ${source.getName()}:`, error);
      }
    }

    return {
      contextSpecVersion: this.specVersion,
      generatedAt: new Date().toISOString(),
      contexts,
    };
  }

  /**
   * Generate JSON output for LLMs
   * @returns Promise that resolves to JSON string
   */
  async toJSON(): Promise<string> {
    const output = await this.collectContext();
    return JSON.stringify(output, null, 2);
  }

  /**
   * Map de tipo de adaptador a nombre de archivo en signals/
   */
  private typeToFilename(type: string): string {
    const map: Record<string, string> = {
      'filesystem': 'structure.json',
      'git': 'git.json',
      'package-json': 'stack.json',
      'env': 'env.json',
      'security': 'security.json',
      'quality': 'quality.json',
      'lifecycle': 'lifecycle.json',
      'privacy': 'privacy.json',
    };
    return map[type] ?? `${type}.json`;
  }

  /**
   * Leer tareas activas de context/tasks/active/
   */
  private readActiveTasks(projectRoot: string): Array<{ id: string; title: string }> {
    const activeDir = path.join(projectRoot, 'context', 'tasks', 'active');
    if (!fs.existsSync(activeDir)) return [];
    try {
      return fs.readdirSync(activeDir)
        .filter(f => f.endsWith('.json') && f !== '.gitkeep')
        .map(f => {
          try {
            const task = JSON.parse(fs.readFileSync(path.join(activeDir, f), 'utf-8'));
            return { id: task.id as string, title: task.title as string };
          } catch {
            return null;
          }
        })
        .filter((t): t is { id: string; title: string } => t !== null);
    } catch {
      return [];
    }
  }

  /**
   * Generar señales granulares como Map<filename, data>
   */
  async toSignals(): Promise<Map<string, object>> {
    const output = await this.collectContext();
    const signals = new Map<string, object>();

    for (const ctx of output.contexts) {
      const filename = this.typeToFilename(ctx.type);
      signals.set(filename, {
        generatedAt: ctx.timestamp,
        source: ctx.source,
        type: ctx.type,
        data: ctx.data,
      });
    }

    return signals;
  }

  /**
   * Generar el archivo de entrada del agente (AGENT.md) con datos reales del scan
   */
  async toAgentMd(projectRoot: string): Promise<string> {
    const output = await this.collectContext();
    const pkgCtx = output.contexts.find(c => c.type === 'package-json');
    const gitCtx = output.contexts.find(c => c.type === 'git');

    const pkgData = pkgCtx?.data as Record<string, unknown> | undefined;
    const gitData = gitCtx?.data as Record<string, unknown> | undefined;

    const projectName = (pkgData?.name as string) ?? path.basename(projectRoot);
    const version = (pkgData?.version as string) ?? '';
    const branch = (gitData?.currentBranch as string) ?? '';
    const lastCommit = (gitData?.lastCommit as string) ?? '';
    const activeTasks = this.readActiveTasks(projectRoot);

    const taskSection = activeTasks.length > 0
      ? activeTasks.map(t => `- **${t.id}**: ${t.title}`).join('\n')
      : '_(No hay tareas activas. Crea una con: `context task new "nombre"`)_';

    const stackInfo = [
      version ? `- **Versión:** ${version}` : '',
      branch ? `- **Rama:** ${branch}` : '',
      lastCommit ? `- **Último commit:** ${lastCommit}` : '',
    ].filter(Boolean).join('\n');

    const scripts = pkgData?.scripts as Record<string, string> | undefined;
    const commandLines = scripts
      ? Object.entries(scripts)
          .filter(([k]) => ['dev', 'start', 'build', 'test', 'lint'].includes(k))
          .map(([k, v]) => `npm run ${k}  # ${v}`)
          .join('\n')
      : '# (Corre context scan para detectar comandos)';

    return `# ${projectName}

> Generado por @csantisgallegos/context — ${output.generatedAt}
> Para actualizar: \`context scan --project-root=.\`

## Antes de empezar, lee:

- Arquitectura: [context/architecture.md](./context/architecture.md)
- Convenciones: [context/conventions.md](./context/conventions.md)
- Tu perfil: [context/agents/developer.json](./context/agents/developer.json)
- Tareas activas: [context/tasks/active/](./context/tasks/active/)
- Señales técnicas: [context/signals/](./context/signals/)

## Tarea activa

${taskSection}

## Estado técnico

${stackInfo || '_(Corre context scan para ver el estado técnico)_'}

## Comandos

\`\`\`bash
${commandLines}
\`\`\`

---

_Señales técnicas disponibles en context/signals/ — generadas automáticamente por context scan._
`;
  }

  /**
   * Generate Markdown output for LLMs
   * @returns Promise that resolves to Markdown string
   */
  async toMarkdown(): Promise<string> {
    const output = await this.collectContext();
    let markdown = `# Context Output\n\n`;
    markdown += `**Context Spec Version:** ${output.contextSpecVersion}\n\n`;
    markdown += `**Generated At:** ${output.generatedAt}\n\n`;
    markdown += `---\n\n`;

    for (const context of output.contexts) {
      markdown += `## ${context.source}\n\n`;
      markdown += `**Type:** ${context.type}\n\n`;
      markdown += `**Timestamp:** ${context.timestamp}\n\n`;
      markdown += `### Data\n\n`;
      markdown += '```json\n';
      markdown += JSON.stringify(context.data, null, 2);
      markdown += '\n```\n\n';
      markdown += `---\n\n`;
    }

    return markdown;
  }
}
