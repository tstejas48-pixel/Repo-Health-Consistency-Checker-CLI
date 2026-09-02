import { BaseChecker } from './base';
import { CheckResult, RepositoryData } from '../types';

const KNOWN_LICENSES = [
  'MIT',
  'Apache-2.0',
  'GPL-3.0',
  'GPL-2.0',
  'BSD-3-Clause',
  'BSD-2-Clause',
  'ISC',
  'MPL-2.0',
  'LGPL-3.0',
  'AGPL-3.0',
];

export class LicenseChecker extends BaseChecker {
  constructor() {
    super('license', 'Legal & Compliance');
  }

  async check(repo: RepositoryData): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    
    // Check for LICENSE file
    const license = this.findFile(repo, /^license(\.md|\.txt)?$/i);
    
    if (!license) {
      results.push(
        this.createResult(
          'license_presence',
          false,
          'No LICENSE file found',
          'error',
          {
            suggestion: 'Add a LICENSE file to specify how others can use your code',
          }
        )
      );
      
      // Check package.json for license field
      if (repo.packageJson?.license) {
        results.push(
          this.createResult(
            'license_package_json',
            true,
            `License specified in package.json: ${repo.packageJson.license}`,
            'info',
            {
              filePath: 'package.json',
              details: { license: repo.packageJson.license },
            }
          )
        );
      }
      
      return results;
    }

    results.push(
      this.createResult(
        'license_presence',
        true,
        'LICENSE file exists',
        'success',
        { filePath: license.path }
      )
    );

    // Detect license type
    const detectedLicense = this.detectLicense(license.content);
    
    if (detectedLicense) {
      results.push(
        this.createResult(
          'license_recognition',
          true,
          `Recognized license: ${detectedLicense}`,
          'success',
          {
            filePath: license.path,
            details: { license: detectedLicense },
          }
        )
      );
    } else {
      results.push(
        this.createResult(
          'license_recognition',
          false,
          'Could not recognize license type',
          'warning',
          {
            filePath: license.path,
            suggestion: 'Use a standard license template for better recognition',
          }
        )
      );
    }

    // Check for copyright year
    const currentYear = new Date().getFullYear();
    const hasCopyright = /copyright/i.test(license.content);
    const hasYear = new RegExp(currentYear.toString()).test(license.content);

    if (hasCopyright) {
      if (hasYear) {
        results.push(
          this.createResult(
            'license_copyright',
            true,
            'Copyright notice is up to date',
            'success',
            { filePath: license.path }
          )
        );
      } else {
        results.push(
          this.createResult(
            'license_copyright',
            false,
            'Copyright year may be outdated',
            'info',
            {
              filePath: license.path,
              suggestion: `Update copyright year to ${currentYear}`,
            }
          )
        );
      }
    }

    return results;
  }

  private detectLicense(content: string): string | null {
    const normalizedContent = content.toLowerCase();
    
    for (const license of KNOWN_LICENSES) {
      if (normalizedContent.includes(license.toLowerCase())) {
        return license;
      }
    }

    // Check for common license patterns
    if (normalizedContent.includes('permission is hereby granted, free of charge')) {
      return 'MIT';
    }
    if (normalizedContent.includes('apache license')) {
      return 'Apache-2.0';
    }
    if (normalizedContent.includes('gnu general public license')) {
      if (normalizedContent.includes('version 3')) return 'GPL-3.0';
      if (normalizedContent.includes('version 2')) return 'GPL-2.0';
      return 'GPL';
    }

    return null;
  }
}
