import { BaseChecker } from './base';
import { CheckResult, RepositoryData } from '../types';

export class DependenciesChecker extends BaseChecker {
  constructor() {
    super('dependencies', 'Dependencies');
  }

  async check(repo: RepositoryData): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    
    if (!repo.packageJson) {
      results.push(
        this.createResult(
          'package_json_presence',
          false,
          'No package.json found',
          'info',
          {
            suggestion: 'This check is only applicable for Node.js projects',
          }
        )
      );
      return results;
    }

    results.push(
      this.createResult(
        'package_json_presence',
        true,
        'package.json found',
        'success',
        { filePath: 'package.json' }
      )
    );

    // Check for lock files
    const hasPackageLock = !!this.findFile(repo, 'package-lock.json');
    const hasYarnLock = !!this.findFile(repo, 'yarn.lock');
    const hasPnpmLock = !!this.findFile(repo, 'pnpm-lock.yaml');

    const lockFiles = [
      hasPackageLock && 'package-lock.json',
      hasYarnLock && 'yarn.lock',
      hasPnpmLock && 'pnpm-lock.yaml',
    ].filter(Boolean);

    if (lockFiles.length === 0) {
      results.push(
        this.createResult(
          'lock_file',
          false,
          'No lock file found (package-lock.json, yarn.lock, or pnpm-lock.yaml)',
          'warning',
          {
            suggestion: 'Commit your lock file to ensure consistent dependency versions',
          }
        )
      );
    } else if (lockFiles.length > 1) {
      results.push(
        this.createResult(
          'lock_file',
          false,
          `Multiple lock files found: ${lockFiles.join(', ')}`,
          'warning',
          {
            details: { lockFiles },
            suggestion: 'Use only one package manager to avoid conflicts',
          }
        )
      );
    } else {
      results.push(
        this.createResult(
          'lock_file',
          true,
          `Lock file present: ${lockFiles[0]}`,
          'success',
          {
            filePath: lockFiles[0] as string,
          }
        )
      );
    }

    // Check for required fields in package.json
    const requiredFields = ['name', 'version'];
    const missingFields = requiredFields.filter(field => !repo.packageJson[field]);

    if (missingFields.length > 0) {
      results.push(
        this.createResult(
          'package_json_required_fields',
          false,
          `Missing required fields in package.json: ${missingFields.join(', ')}`,
          'error',
          {
            filePath: 'package.json',
            details: { missing: missingFields },
          }
        )
      );
    } else {
      results.push(
        this.createResult(
          'package_json_required_fields',
          true,
          'All required fields present in package.json',
          'success',
          { filePath: 'package.json' }
        )
      );
    }

    // Check for recommended fields
    const recommendedFields = ['description', 'repository', 'keywords', 'author', 'license'];
    const missingRecommended = recommendedFields.filter(field => !repo.packageJson[field]);

    if (missingRecommended.length > 0) {
      results.push(
        this.createResult(
          'package_json_metadata',
          false,
          `Missing recommended metadata: ${missingRecommended.join(', ')}`,
          'info',
          {
            filePath: 'package.json',
            details: { missing: missingRecommended },
            suggestion: 'Add metadata to improve package discoverability',
          }
        )
      );
    }

    // Check for scripts
    const commonScripts = ['test', 'build', 'lint'];
    const presentScripts = commonScripts.filter(script => 
      repo.packageJson.scripts?.[script]
    );

    if (presentScripts.length >= 2) {
      results.push(
        this.createResult(
          'package_scripts',
          true,
          `Common scripts configured: ${presentScripts.join(', ')}`,
          'success',
          {
            filePath: 'package.json',
            details: { scripts: presentScripts },
          }
        )
      );
    } else {
      results.push(
        this.createResult(
          'package_scripts',
          false,
          'Few standard scripts configured',
          'info',
          {
            filePath: 'package.json',
            suggestion: 'Add standard scripts like test, build, and lint',
          }
        )
      );
    }

    // Check dependency count
    const depCount = Object.keys(repo.packageJson.dependencies || {}).length;
    const devDepCount = Object.keys(repo.packageJson.devDependencies || {}).length;

    results.push(
      this.createResult(
        'dependency_count',
        true,
        `Dependencies: ${depCount} production, ${devDepCount} dev`,
        'info',
        {
          filePath: 'package.json',
          details: { 
            dependencies: depCount,
            devDependencies: devDepCount,
          },
        }
      )
    );

    return results;
  }
}
