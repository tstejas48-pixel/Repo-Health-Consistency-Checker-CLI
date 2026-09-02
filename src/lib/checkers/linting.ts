import { BaseChecker } from './base';
import { CheckResult, RepositoryData } from '../types';

export class LintingChecker extends BaseChecker {
  constructor() {
    super('linting', 'Code Quality');
  }

  async check(repo: RepositoryData): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    
    // Check for ESLint
    const eslintConfig = this.findFile(repo, /^\.eslintrc(\.(json|js|yml|yaml|cjs|mjs))?$|^eslint\.config\.(js|mjs|cjs)$/i);
    const hasESLint = eslintConfig || 
                      repo.packageJson?.devDependencies?.eslint ||
                      repo.packageJson?.dependencies?.eslint;

    // Check for Prettier
    const prettierConfig = this.findFile(repo, /^\.(prettierrc|prettierrc\.(json|js|yml|yaml|toml))$|^prettier\.config\.(js|cjs|mjs)$/i);
    const hasPrettier = prettierConfig ||
                        repo.packageJson?.devDependencies?.prettier ||
                        repo.packageJson?.dependencies?.prettier;

    // Check for other linters
    const hasPylint = this.findFile(repo, /^\.pylintrc$/i) ||
                      repo.files.some(f => f.path.includes('pylintrc'));
    const hasRubocop = this.findFile(repo, /^\.rubocop\.yml$/i);
    const hasStylelint = repo.packageJson?.devDependencies?.stylelint ||
                         repo.packageJson?.dependencies?.stylelint;

    const linters = [];
    if (hasESLint) linters.push('ESLint');
    if (hasPrettier) linters.push('Prettier');
    if (hasPylint) linters.push('Pylint');
    if (hasRubocop) linters.push('Rubocop');
    if (hasStylelint) linters.push('Stylelint');

    if (linters.length === 0) {
      results.push(
        this.createResult(
          'linting_presence',
          false,
          'No linting configuration found',
          'warning',
          {
            suggestion: 'Add a linter (ESLint, Prettier, etc.) to maintain code quality',
          }
        )
      );
      return results;
    }

    results.push(
      this.createResult(
        'linting_presence',
        true,
        `Linting configured: ${linters.join(', ')}`,
        'success',
        {
          details: { linters },
        }
      )
    );

    // Check for lint script
    const hasLintScript = repo.packageJson?.scripts?.lint ||
                          repo.packageJson?.scripts?.['lint:check'] ||
                          repo.packageJson?.scripts?.['lint:fix'];

    if (hasLintScript) {
      results.push(
        this.createResult(
          'lint_script',
          true,
          'Lint script configured in package.json',
          'success',
          { filePath: 'package.json' }
        )
      );
    } else if (hasESLint || hasPrettier) {
      results.push(
        this.createResult(
          'lint_script',
          false,
          'Linter installed but no lint script in package.json',
          'info',
          {
            filePath: 'package.json',
            suggestion: 'Add a "lint" script to package.json',
          }
        )
      );
    }

    // Check for ignore files
    if (hasESLint) {
      const eslintIgnore = this.findFile(repo, '.eslintignore');
      if (eslintIgnore) {
        results.push(
          this.createResult(
            'eslint_ignore',
            true,
            '.eslintignore file found',
            'success',
            { filePath: '.eslintignore' }
          )
        );
      }
    }

    if (hasPrettier) {
      const prettierIgnore = this.findFile(repo, '.prettierignore');
      if (prettierIgnore) {
        results.push(
          this.createResult(
            'prettier_ignore',
            true,
            '.prettierignore file found',
            'success',
            { filePath: '.prettierignore' }
          )
        );
      }
    }

    return results;
  }
}
