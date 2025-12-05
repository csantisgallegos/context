import * as fs from 'fs';
import * as path from 'path';
import { ContextEngine } from '@csantisgallegos/context-core';
import { GenericFsAdapter } from '@csantisgallegos/context-adapter-generic-fs';

/**
 * Options for the scan command
 */
interface ScanOptions {
  projectRoot: string;
}

/**
 * Execute the scan command
 */
export async function scan(options: ScanOptions): Promise<void> {
  try {
    console.log(`Scanning project at: ${options.projectRoot}`);

    // Create context engine and add file system adapter
    const engine = new ContextEngine();
    const fsAdapter = new GenericFsAdapter({
      projectRoot: options.projectRoot,
    });

    engine.addSource(fsAdapter);

    // Generate outputs
    console.log('Collecting context...');
    const jsonOutput = await engine.toJSON();
    const markdownOutput = await engine.toMarkdown();

    // Create output directory
    const outputDir = path.join(options.projectRoot, 'context');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write JSON file
    const jsonPath = path.join(outputDir, 'context.json');
    fs.writeFileSync(jsonPath, jsonOutput, 'utf-8');
    console.log(`✓ JSON output written to: ${jsonPath}`);

    // Write Markdown file
    const mdPath = path.join(outputDir, 'context.md');
    fs.writeFileSync(mdPath, markdownOutput, 'utf-8');
    console.log(`✓ Markdown output written to: ${mdPath}`);

    console.log('\nContext scan completed successfully!');
  } catch (error) {
    console.error('Error during scan:', error);
    process.exit(1);
  }
}
