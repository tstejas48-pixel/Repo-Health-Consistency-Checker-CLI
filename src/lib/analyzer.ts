import { RepositoryData, AnalysisResult, CheckResult, HealthCheckConfig } from './types';
import { ReadmeChecker } from './checkers/readme';
import { LicenseChecker } from './checkers/license';
import { TestsChecker } from './checkers/tests';
import { GitignoreChecker } from './checkers/gitignore';
import { DependenciesChecker } from './checkers/dependencies';
import { CIChecker } from './checkers/ci';
import { LintingChecker } from './checkers/linting';

export class RepositoryAnalyzer {
  private config: HealthCheckConfig;

  constructor(config: HealthCheckConfig = {}) {
    this.config = {
      enabled: true,
      checks: {
        readme: true,
        license: true,
        tests: true,
        gitignore: true,
        dependencies: true,
        ci: true,
        linting: true,
        ...config.checks,
      },
      thresholds: {
        minReadmeLength: 300,
        maxDependencyAge: 365,
        minTestCoverage: 70,
        ...config.thresholds,
      },
      ...config,
    };
  }

  async analyze(repo: RepositoryData, repoName: string): Promise<AnalysisResult> {
    const startTime = Date.now();
    const allChecks: CheckResult[] = [];

    // Initialize checkers based on config
    const checkers = [];
    if (this.config.checks?.readme) checkers.push(new ReadmeChecker());
    if (this.config.checks?.license) checkers.push(new LicenseChecker());
    if (this.config.checks?.tests) checkers.push(new TestsChecker());
    if (this.config.checks?.gitignore) checkers.push(new GitignoreChecker());
    if (this.config.checks?.dependencies) checkers.push(new DependenciesChecker());
    if (this.config.checks?.ci) checkers.push(new CIChecker());
    if (this.config.checks?.linting) checkers.push(new LintingChecker());

    // Run all checkers
    for (const checker of checkers) {
      try {
        const results = await checker.check(repo);
        allChecks.push(...results);
      } catch (error) {
        console.error(`Error running ${checker.constructor.name}:`, error);
        allChecks.push({
          checkType: 'checker_error',
          category: 'System',
          severity: 'error',
          passed: false,
          message: `Failed to run ${checker.constructor.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }

    // Calculate summary
    const summary = {
      total: allChecks.length,
      passed: allChecks.filter(c => c.passed).length,
      failed: allChecks.filter(c => !c.passed).length,
      errors: allChecks.filter(c => c.severity === 'error').length,
      warnings: allChecks.filter(c => c.severity === 'warning').length,
      info: allChecks.filter(c => c.severity === 'info').length,
    };

    // Calculate health score (0-100)
    const healthScore = this.calculateHealthScore(allChecks, summary);

    const duration = Date.now() - startTime;

    return {
      healthScore,
      checks: allChecks,
      summary,
      metadata: {
        analyzedAt: new Date().toISOString(),
        duration,
        repositoryName: repoName,
      },
    };
  }

  private calculateHealthScore(checks: CheckResult[], summary: any): number {
    if (checks.length === 0) return 0;

    // Weight different severities
    const weights = {
      error: -10,
      warning: -5,
      info: -1,
      success: 5,
    };

    let score = 50; // Start at 50

    for (const check of checks) {
      if (check.passed) {
        score += weights.success;
      } else {
        score += weights[check.severity] || 0;
      }
    }

    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  }

  getConfig(): HealthCheckConfig {
    return this.config;
  }
}
