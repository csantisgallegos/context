#!/usr/bin/env node

import { Command } from 'commander';
import { scan } from './commands/scan';
import { init } from './commands/init';

const program = new Command();

program
  .name('context')
  .description('CLI tool for context scanning')
  .version('0.1.0');

program
  .command('init')
  .description('Inicializar la carpeta context/ en un proyecto')
  .option('--project-root <path>', 'Directorio del proyecto', '.')
  .option('--force', 'Sobreescribir archivos existentes', false)
  .action(init);

program
  .command('scan')
  .description('Scan a project directory and generate context files')
  .option('--project-root <path>', 'Project root directory to scan', '.')
  .option('--no-legacy', 'No generar context.json y context.md legacy')
  .action(scan);

program.parse(process.argv);
