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
