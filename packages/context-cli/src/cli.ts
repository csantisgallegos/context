#!/usr/bin/env node

import { Command } from 'commander';
import { scan } from './commands/scan';

const program = new Command();

program
  .name('context')
  .description('CLI tool for context scanning')
  .version('0.1.0');

program
  .command('scan')
  .description('Scan a project directory and generate context files')
  .option('--project-root <path>', 'Project root directory to scan', '.')
  .action(scan);

program.parse(process.argv);
