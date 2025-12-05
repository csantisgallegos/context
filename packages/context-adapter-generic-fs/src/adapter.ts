import * as fs from 'fs';
import * as path from 'path';
import { ContextSource, ContextData } from '@csantisgallegos/context-core';

/**
 * Options for the GenericFsAdapter
 */
export interface GenericFsAdapterOptions {
  /**
   * Root directory to scan
   */
  projectRoot: string;

  /**
   * Maximum depth to scan (default: 3)
   */
  maxDepth?: number;

  /**
   * Patterns to ignore (default: ['node_modules', '.git', 'dist'])
   */
  ignorePatterns?: string[];
}

/**
 * File system adapter that scans a project root directory
 */
export class GenericFsAdapter implements ContextSource {
  private readonly projectRoot: string;
  private readonly maxDepth: number;
  private readonly ignorePatterns: string[];

  constructor(options: GenericFsAdapterOptions) {
    this.projectRoot = path.resolve(options.projectRoot);
    this.maxDepth = options.maxDepth ?? 3;
    this.ignorePatterns = options.ignorePatterns ?? ['node_modules', '.git', 'dist', 'coverage'];
  }

  getName(): string {
    return 'GenericFsAdapter';
  }

  async collect(): Promise<ContextData> {
    const structure = await this.scanDirectory(this.projectRoot, 0);

    return {
      type: 'filesystem',
      source: this.getName(),
      timestamp: new Date().toISOString(),
      data: {
        projectRoot: this.projectRoot,
        structure,
      },
    };
  }

  /**
   * Recursively scan directory structure
   */
  private async scanDirectory(dirPath: string, depth: number): Promise<any> {
    if (depth > this.maxDepth) {
      return { type: 'directory', name: path.basename(dirPath), truncated: true };
    }

    const stats = await fs.promises.stat(dirPath);
    const name = path.basename(dirPath);

    if (!stats.isDirectory()) {
      return {
        type: 'file',
        name,
        size: stats.size,
      };
    }

    // Check if should ignore this directory
    if (this.shouldIgnore(name)) {
      return {
        type: 'directory',
        name,
        ignored: true,
      };
    }

    const entries = await fs.promises.readdir(dirPath);
    const children: any[] = [];

    for (const entry of entries) {
      if (this.shouldIgnore(entry)) {
        continue;
      }

      const entryPath = path.join(dirPath, entry);
      try {
        const childData = await this.scanDirectory(entryPath, depth + 1);
        children.push(childData);
      } catch (error) {
        // Skip entries that cannot be accessed
        console.error(`Error scanning ${entryPath}:`, error);
      }
    }

    return {
      type: 'directory',
      name,
      children,
    };
  }

  /**
   * Check if a path should be ignored
   */
  private shouldIgnore(name: string): boolean {
    return this.ignorePatterns.some((pattern) => name.includes(pattern));
  }
}
