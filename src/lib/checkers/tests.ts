import { BaseChecker } from './base';
import { CheckResult, RepositoryData } from '../types';

export class TestsChecker extends BaseChecker {
  constructor() {
    super('tests', 'Code Quality');
  }

  async check(repo: RepositoryData): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    
    // Check for test files
    const testFiles = this.findFiles(repo, /\.(test|spec)\.(js|ts|jsx|tsx)$/i);
    const testDirs = repo.files.filter(f => 
      /^(test|tests|__tests__|spec)\//i.test(f.path)
    );

    if (testFiles.length === 0 && testDirs.length === 0) {
      results.push(
        this.createResult(
          'tests_presence',
          false,
          'No test files found',
          'error',
          {
            suggestion: 'Add tests to ensure code quality and prevent regressions',
          }
        )
      );
    } else {
      results.push(
        this.createResult(
          'tests_presence',
          true,
          `Found ${testFiles.length} test files`,
          'success',
          {
            details: { 
              testFiles: testFiles.length,
              testDirs: testDirs.length 
            },
          }
        )
      );
    }

    // Check for test framework configuration
    const hasJest = this.findFile(repo, /^jest\.config\.(js|ts|json)$/i) || 
                    repo.packageJson?.devDependencies?.jest ||
                    repo.packageJson?.dependencies?.jest;
    const hasVitest = repo.packageJson?.devDependencies?.vitest ||
                      repo.packageJson?.dependencies?.vitest;
    const hasMocha = repo.packageJson?.devDependencies?.mocha ||
                     repo.packageJson?.dependencies?.mocha;
    const hasPytest = this.findFile(repo, /^pytest\.ini$/i) ||
                      this.findFile(repo, /^pyproject\.toml$/i);

    const frameworks = [];
    if (hasJest) frameworks.push('Jest');
    if (hasVitest) frameworks.push('Vitest');
    if (hasMocha) frameworks.push('Mocha');
    if (hasPytest) frameworks.push('Pytest');

    if (frameworks.length > 0) {
      results.push(
        this.createResult(
          'test_framework',
          true,
          `Test framework configured: ${frameworks.join(', ')}`,
          'success',
          {
            details: { frameworks },
          }
        )
      );
    } else if (testFiles.length > 0) {
      results.push(
        this.createResult(
          'test_framework',
          false,
          'Test files found but no test framework configuration detected',
          'warning',
          {
            suggestion: 'Configure a test framework (Jest, Vitest, Mocha, etc.)',
          }
        )
      );
    }

    // Check for test coverage configuration
    const hasCoverageConfig = repo.packageJson?.jest?.collectCoverage ||
                              this.findFile(repo, /^\.coveragerc$/i) ||
                              this.findFile(repo, /^coverage\//i);

    if (hasCoverageConfig) {
      results.push(
        this.createResult(
          'test_coverage_config',
          true,
          'Test coverage configuration found',
          'success'
        )
      );
    } else if (testFiles.length > 0) {
      results.push(
        this.createResult(
          'test_coverage_config',
          false,
          'No test coverage configuration found',
          'info',
          {
            suggestion: 'Configure test coverage tracking to monitor code quality',
          }
        )
      );
    }

    // Check test script in package.json
    if (repo.packageJson?.scripts?.test) {
      results.push(
        this.createResult(
          'test_script',
          true,
          'Test script configured in package.json',
          'success',
          {
            filePath: 'package.json',
            details: { script: repo.packageJson.scripts.test },
          }
        )
      );
    } else if (testFiles.length > 0) {
      results.push(
        this.createResult(
          'test_script',
          false,
          'No test script found in package.json',
          'warning',
          {
            filePath: 'package.json',
            suggestion: 'Add a "test" script to package.json',
          }
        )
      );
    }

    return results;
  }
}
