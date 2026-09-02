import { BaseChecker } from './base';
import { CheckResult, RepositoryData } from '../types';

export class ReadmeChecker extends BaseChecker {
  constructor() {
    super('readme', 'Documentation');
  }

  async check(repo: RepositoryData): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    
    // Check for README presence
    const readme = this.findFile(repo, /^readme\.md$/i);
    
    if (!readme) {
      results.push(
        this.createResult(
          'readme_presence',
          false,
          'No README.md file found',
          'error',
          {
            suggestion: 'Add a README.md file to document your project',
          }
        )
      );
      return results;
    }

    results.push(
      this.createResult(
        'readme_presence',
        true,
        'README.md file exists',
        'success'
      )
    );

    // Check README length
    const minLength = 300;
    if (readme.content.length < minLength) {
      results.push(
        this.createResult(
          'readme_length',
          false,
          `README is too short (${readme.content.length} chars, minimum ${minLength})`,
          'warning',
          {
            filePath: readme.path,
            suggestion: 'Expand your README with more documentation',
          }
        )
      );
    } else {
      results.push(
        this.createResult(
          'readme_length',
          true,
          `README has adequate length (${readme.content.length} chars)`,
          'success',
          { filePath: readme.path }
        )
      );
    }

    // Check for required sections
    const requiredSections = [
      { name: 'Installation', pattern: /##\s*install/i },
      { name: 'Usage', pattern: /##\s*usage/i },
      { name: 'License', pattern: /##\s*license/i },
    ];

    const missingSections: string[] = [];
    const foundSections: string[] = [];

    for (const section of requiredSections) {
      if (section.pattern.test(readme.content)) {
        foundSections.push(section.name);
      } else {
        missingSections.push(section.name);
      }
    }

    if (missingSections.length > 0) {
      results.push(
        this.createResult(
          'readme_sections',
          false,
          `Missing recommended sections: ${missingSections.join(', ')}`,
          'warning',
          {
            filePath: readme.path,
            details: { missing: missingSections, found: foundSections },
            suggestion: 'Add missing sections to improve documentation',
          }
        )
      );
    } else {
      results.push(
        this.createResult(
          'readme_sections',
          true,
          'All recommended sections present',
          'success',
          {
            filePath: readme.path,
            details: { found: foundSections },
          }
        )
      );
    }

    // Check for code examples
    const hasCodeBlocks = /```[\s\S]*?```/.test(readme.content);
    if (hasCodeBlocks) {
      results.push(
        this.createResult(
          'readme_examples',
          true,
          'README contains code examples',
          'success',
          { filePath: readme.path }
        )
      );
    } else {
      results.push(
        this.createResult(
          'readme_examples',
          false,
          'No code examples found in README',
          'info',
          {
            filePath: readme.path,
            suggestion: 'Add code examples to help users get started',
          }
        )
      );
    }

    return results;
  }
}
