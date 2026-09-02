import { BaseChecker } from './base';
import { CheckResult, RepositoryData } from '../types';

export class CIChecker extends BaseChecker {
  constructor() {
    super('ci', 'Code Quality');
  }

  async check(repo: RepositoryData): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    
    // Check for GitHub Actions
    const githubWorkflows = this.findFiles(repo, /^\.github\/workflows\//);
    
    // Check for other CI configs
    const gitlabCI = this.findFile(repo, '.gitlab-ci.yml');
    const travisCI = this.findFile(repo, '.travis.yml');
    const circleCI = this.findFile(repo, '.circleci/config.yml');
    const jenkinsfile = this.findFile(repo, /^Jenkinsfile$/i);

    const ciSystems = [];
    if (githubWorkflows.length > 0) ciSystems.push('GitHub Actions');
    if (gitlabCI) ciSystems.push('GitLab CI');
    if (travisCI) ciSystems.push('Travis CI');
    if (circleCI) ciSystems.push('Circle CI');
    if (jenkinsfile) ciSystems.push('Jenkins');

    if (ciSystems.length === 0) {
      results.push(
        this.createResult(
          'ci_presence',
          false,
          'No CI/CD configuration found',
          'warning',
          {
            suggestion: 'Add CI/CD to automate testing and deployment',
          }
        )
      );
      return results;
    }

    results.push(
      this.createResult(
        'ci_presence',
        true,
        `CI/CD configured: ${ciSystems.join(', ')}`,
        'success',
        {
          details: { systems: ciSystems },
        }
      )
    );

    // Analyze GitHub Actions workflows
    if (githubWorkflows.length > 0) {
      results.push(
        this.createResult(
          'github_actions_workflows',
          true,
          `Found ${githubWorkflows.length} GitHub Actions workflow(s)`,
          'success',
          {
            details: { 
              count: githubWorkflows.length,
              files: githubWorkflows.map(f => f.path),
            },
          }
        )
      );

      // Check for common workflow jobs
      const allWorkflowContent = githubWorkflows.map(f => f.content).join('\n');
      const hasTestJob = /test|testing/i.test(allWorkflowContent);
      const hasBuildJob = /build/i.test(allWorkflowContent);
      const hasLintJob = /lint|linting/i.test(allWorkflowContent);

      const jobs = [];
      if (hasTestJob) jobs.push('test');
      if (hasBuildJob) jobs.push('build');
      if (hasLintJob) jobs.push('lint');

      if (jobs.length > 0) {
        results.push(
          this.createResult(
            'ci_jobs',
            true,
            `CI includes: ${jobs.join(', ')}`,
            'success',
            {
              details: { jobs },
            }
          )
        );
      }
    }

    return results;
  }
}
