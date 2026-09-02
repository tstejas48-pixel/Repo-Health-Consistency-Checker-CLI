import { BaseChecker } from './base';
import { CheckResult, RepositoryData } from '../types';

const COMMON_IGNORE_PATTERNS = {
  node: ['node_modules', 'npm-debug.log', 'yarn-error.log', '.pnpm-debug.log'],
  env: ['.env', '.env.local', '.env.*.local'],
  build: ['dist', 'build', 'out', '.next'],
  ide: ['.vscode', '.idea', '*.swp', '.DS_Store'],
  logs: ['*.log', 'logs'],
};

export class GitignoreChecker extends BaseChecker {
  constructor() {
    super('gitignore', 'Git Hygiene');
  }

  async check(repo: RepositoryData): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    
    // Check for .gitignore presence
    const gitignore = this.findFile(repo, '.gitignore');
    
    if (!gitignore) {
      results.push(
        this.createResult(
          'gitignore_presence',
          false,
          'No .gitignore file found',
          'error',
          {
            suggestion: 'Add a .gitignore file to prevent committing unnecessary files',
          }
        )
      );
      return results;
    }

    results.push(
      this.createResult(
        'gitignore_presence',
        true,
        '.gitignore file exists',
        'success',
        { filePath: gitignore.path }
      )
    );

    // Check for common patterns
    const missingPatterns: string[] = [];
    const foundPatterns: string[] = [];

    // Detect project type
    const hasPackageJson = !!repo.packageJson;
    const hasPython = repo.files.some(f => f.path.endsWith('.py'));

    if (hasPackageJson) {
      for (const pattern of COMMON_IGNORE_PATTERNS.node) {
        if (gitignore.content.includes(pattern)) {
          foundPatterns.push(pattern);
        } else {
          missingPatterns.push(pattern);
        }
      }
    }

    // Check environment files
    for (const pattern of COMMON_IGNORE_PATTERNS.env) {
      if (gitignore.content.includes(pattern)) {
        foundPatterns.push(pattern);
      } else if (hasPackageJson || hasPython) {
        missingPatterns.push(pattern);
      }
    }

    // Check build directories
    const buildPatterns = hasPackageJson ? COMMON_IGNORE_PATTERNS.build : [];
    for (const pattern of buildPatterns) {
      if (gitignore.content.includes(pattern)) {
        foundPatterns.push(pattern);
      } else {
        missingPatterns.push(pattern);
      }
    }

    if (missingPatterns.length > 0) {
      results.push(
        this.createResult(
          'gitignore_completeness',
          false,
          `Missing common ignore patterns: ${missingPatterns.slice(0, 3).join(', ')}${missingPatterns.length > 3 ? '...' : ''}`,
          'warning',
          {
            filePath: gitignore.path,
            details: { missing: missingPatterns, found: foundPatterns },
            suggestion: 'Add missing patterns to .gitignore',
          }
        )
      );
    } else if (foundPatterns.length > 0) {
      results.push(
        this.createResult(
          'gitignore_completeness',
          true,
          'Common ignore patterns present',
          'success',
          {
            filePath: gitignore.path,
            details: { found: foundPatterns },
          }
        )
      );
    }

    // Check if .env files are accidentally committed
    const envFiles = repo.files.filter(f => 
      /\.env(\.|$)/.test(f.path) && !f.path.includes('.example')
    );

    if (envFiles.length > 0) {
      results.push(
        this.createResult(
          'env_files_committed',
          false,
          `.env files committed to repository: ${envFiles.map(f => f.path).join(', ')}`,
          'error',
          {
            details: { files: envFiles.map(f => f.path) },
            suggestion: 'Remove .env files from git and add them to .gitignore',
          }
        )
      );
    }

    return results;
  }
}
