import * as fs from 'fs';
import * as path from 'path';
import { ContextEngine } from '@csantisgallegos/context-core';
import { GenericFsAdapter } from '@csantisgallegos/context-adapter-generic-fs';

interface ScanOptions {
  projectRoot: string;
  legacy?: boolean;
}

export async function scan(options: ScanOptions): Promise<void> {
  try {
    console.log(`Escaneando proyecto en: ${options.projectRoot}`);

    const engine = new ContextEngine();
    const fsAdapter = new GenericFsAdapter({
      projectRoot: options.projectRoot,
    });
    engine.addSource(fsAdapter);

    const contextDir = path.join(options.projectRoot, 'context');
    const hasContextDir = fs.existsSync(contextDir);

    if (!hasContextDir) {
      console.warn('⚠ context/ no encontrado. Corre primero: context init --project-root=.');
    }

    // Salida granular en signals/ (solo si context/ existe)
    if (hasContextDir) {
      const signalsDir = path.join(contextDir, 'signals');
      fs.mkdirSync(signalsDir, { recursive: true });

      const signals = await engine.toSignals();
      for (const [filename, data] of signals.entries()) {
        const filePath = path.join(signalsDir, filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`✓ Signal: context/signals/${filename}`);
      }

      // Regenerar AGENT.md siempre (es el único auto-generado en la raíz)
      const agentMd = await engine.toAgentMd(options.projectRoot);
      fs.writeFileSync(path.join(options.projectRoot, 'AGENT.md'), agentMd, 'utf-8');
      console.log('✓ AGENT.md actualizado');
    }

    // Salida legacy (context.json + context.md) — backwards compat, deprecar en v0.4.0
    const writeLegacy = options.legacy !== false;
    if (writeLegacy) {
      const outputDir = hasContextDir ? contextDir : path.join(options.projectRoot, 'context');
      if (!hasContextDir) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const jsonOutput = await engine.toJSON();
      const jsonPath = path.join(outputDir, 'context.json');
      fs.writeFileSync(jsonPath, jsonOutput, 'utf-8');
      console.log(`✓ context.json (legacy): ${path.relative(options.projectRoot, jsonPath).replace(/\\/g, '/')}`);

      const markdownOutput = await engine.toMarkdown();
      const mdPath = path.join(outputDir, 'context.md');
      fs.writeFileSync(mdPath, markdownOutput, 'utf-8');
      console.log(`✓ context.md (legacy): ${path.relative(options.projectRoot, mdPath).replace(/\\/g, '/')}`);
    }

    console.log('\n✓ Scan completado.');
  } catch (error) {
    console.error('Error durante el scan:', error);
    process.exit(1);
  }
}
