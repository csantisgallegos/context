# @csantisgallegos/context

Toolkit en TypeScript para manejar contexto, capacidades y prompts al trabajar con IA (LLMs). Monorepo con core, adapters y CLI.

## Packages

This monorepo contains the following packages:

### [@csantisgallegos/context-core](./packages/context-core)
Core package with ContextEngine and ContextSource interface. Outputs JSON and Markdown formats for LLM consumption.

### [@csantisgallegos/context-adapter-generic-fs](./packages/context-adapter-generic-fs)
File system adapter that scans project directories and collects context information.

### [@csantisgallegos/context-cli](./packages/context-cli)
Command-line interface tool for scanning projects and generating context files.

## Installation

```bash
npm install
npm run build
```

## Usage

### CLI

After building, you can use the CLI tool:

```bash
# Link the CLI globally (from packages/context-cli)
cd packages/context-cli
npm link

# Scan a project
context scan --project-root=.
```

This will create two files in the `context/` directory:
- `context.json` - JSON format with contextSpecVersion
- `context.md` - Markdown format for easy reading

### Programmatic Usage

```typescript
import { ContextEngine } from '@csantisgallegos/context-core';
import { GenericFsAdapter } from '@csantisgallegos/context-adapter-generic-fs';

const engine = new ContextEngine();
const fsAdapter = new GenericFsAdapter({
  projectRoot: '.',
});

engine.addSource(fsAdapter);

// Generate JSON output
const json = await engine.toJSON();

// Generate Markdown output
const markdown = await engine.toMarkdown();
```

## Version

Current version: **0.1.0**

## License

MIT
