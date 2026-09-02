import { RepositoryData, FileContent } from './types';

export async function parseUploadedFiles(files: File[]): Promise<RepositoryData> {
  const fileContents: FileContent[] = [];

  for (const file of files) {
    const content = await file.text();
    fileContents.push({
      path: file.webkitRelativePath || file.name,
      content,
    });
  }

  // Extract package.json if exists
  let packageJson = null;
  const packageFile = fileContents.find(f => f.path.endsWith('package.json'));
  if (packageFile) {
    try {
      packageJson = JSON.parse(packageFile.content);
    } catch (e) {
      console.error('Failed to parse package.json:', e);
    }
  }

  return {
    files: fileContents,
    packageJson,
    hasGit: fileContents.some(f => f.path.includes('.git/')),
  };
}

export function createMockRepository(): RepositoryData {
  return {
    files: [
      {
        path: 'README.md',
        content: `# Sample Project

This is a sample project for demonstration.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`javascript
const app = require('./index');
app.start();
\`\`\`

## License

MIT License
`,
      },
      {
        path: 'LICENSE',
        content: `MIT License

Copyright (c) 2024 Sample Author

Permission is hereby granted, free of charge, to any person obtaining a copy...`,
      },
      {
        path: 'package.json',
        content: JSON.stringify({
          name: 'sample-project',
          version: '1.0.0',
          description: 'A sample project',
          scripts: {
            test: 'jest',
            build: 'tsc',
            lint: 'eslint .',
          },
          dependencies: {
            express: '^4.18.0',
          },
          devDependencies: {
            jest: '^29.0.0',
            eslint: '^8.0.0',
            typescript: '^5.0.0',
          },
        }, null, 2),
      },
      {
        path: '.gitignore',
        content: `node_modules
.env
dist
build
*.log
.DS_Store
`,
      },
      {
        path: 'src/index.test.ts',
        content: `describe('Sample', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});`,
      },
      {
        path: '.github/workflows/ci.yml',
        content: `name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm test
      
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm run build
`,
      },
      {
        path: '.eslintrc.json',
        content: JSON.stringify({
          extends: ['eslint:recommended'],
          env: {
            node: true,
            es6: true,
          },
        }, null, 2),
      },
    ],
    packageJson: {
      name: 'sample-project',
      version: '1.0.0',
      description: 'A sample project',
      scripts: {
        test: 'jest',
        build: 'tsc',
        lint: 'eslint .',
      },
      dependencies: {
        express: '^4.18.0',
      },
      devDependencies: {
        jest: '^29.0.0',
        eslint: '^8.0.0',
        typescript: '^5.0.0',
      },
    },
    hasGit: true,
  };
}
