# Health Checkers Documentation

This document provides detailed information about each health checker module and the specific checks they perform.

## Table of Contents

- [README Checker](#readme-checker)
- [License Checker](#license-checker)
- [Tests Checker](#tests-checker)
- [Gitignore Checker](#gitignore-checker)
- [Dependencies Checker](#dependencies-checker)
- [CI Checker](#ci-checker)
- [Linting Checker](#linting-checker)

---

## README Checker

**Category**: Documentation  
**File**: `src/lib/checkers/readme.ts`

### Checks Performed

#### 1. README Presence
- **Check Type**: `readme_presence`
- **Severity**: Error if missing
- **Description**: Verifies that a README.md file exists in the repository root
- **Pass Criteria**: File named `README.md` (case-insensitive) exists

#### 2. README Length
- **Check Type**: `readme_length`
- **Severity**: Warning if too short
- **Description**: Ensures README has adequate content
- **Pass Criteria**: README contains at least 300 characters
- **Threshold**: Configurable via `config.thresholds.minReadmeLength`

#### 3. Required Sections
- **Check Type**: `readme_sections`
- **Severity**: Warning if missing
- **Description**: Checks for recommended documentation sections
- **Required Sections**:
  - Installation (`## Install`)
  - Usage (`## Usage`)
  - License (`## License`)
- **Pass Criteria**: All three sections present

#### 4. Code Examples
- **Check Type**: `readme_examples`
- **Severity**: Info if missing
- **Description**: Verifies presence of code examples
- **Pass Criteria**: At least one code block (```) present
- **Suggestion**: Add code examples to help users get started

---

## License Checker

**Category**: Legal & Compliance  
**File**: `src/lib/checkers/license.ts`

### Checks Performed

#### 1. LICENSE File Presence
- **Check Type**: `license_presence`
- **Severity**: Error if missing
- **Description**: Checks for LICENSE file in repository
- **Pass Criteria**: File named `LICENSE`, `LICENSE.md`, or `LICENSE.txt` exists

#### 2. License in package.json
- **Check Type**: `license_package_json`
- **Severity**: Info
- **Description**: Checks if license is specified in package.json
- **Triggered**: Only when LICENSE file is missing
- **Pass Criteria**: `license` field present in package.json

#### 3. License Recognition
- **Check Type**: `license_recognition`
- **Severity**: Warning if unrecognized
- **Description**: Attempts to identify the license type
- **Recognized Licenses**:
  - MIT
  - Apache-2.0
  - GPL-3.0, GPL-2.0
  - BSD-3-Clause, BSD-2-Clause
  - ISC
  - MPL-2.0
  - LGPL-3.0
  - AGPL-3.0
- **Pass Criteria**: License matches known template

#### 4. Copyright Notice
- **Check Type**: `license_copyright`
- **Severity**: Info if outdated
- **Description**: Verifies copyright year is current
- **Pass Criteria**: Copyright notice includes current year
- **Suggestion**: Update copyright year to current year

---

## Tests Checker

**Category**: Code Quality  
**File**: `src/lib/checkers/tests.ts`

### Checks Performed

#### 1. Test Files Presence
- **Check Type**: `tests_presence`
- **Severity**: Error if missing
- **Description**: Searches for test files or directories
- **Detection Patterns**:
  - Files: `*.test.{js,ts,jsx,tsx}`, `*.spec.{js,ts,jsx,tsx}`
  - Directories: `test/`, `tests/`, `__tests__/`, `spec/`
- **Pass Criteria**: At least one test file or test directory found

#### 2. Test Framework Configuration
- **Check Type**: `test_framework`
- **Severity**: Warning if unconfigured
- **Description**: Identifies configured test frameworks
- **Detected Frameworks**:
  - Jest (config file or package.json dependency)
  - Vitest (package.json dependency)
  - Mocha (package.json dependency)
  - Pytest (pytest.ini or pyproject.toml)
- **Pass Criteria**: At least one framework configured

#### 3. Test Coverage Configuration
- **Check Type**: `test_coverage_config`
- **Severity**: Info if missing
- **Description**: Checks for coverage tracking setup
- **Detection**:
  - Jest: `collectCoverage` in package.json
  - Python: `.coveragerc` file
  - General: `coverage/` directory
- **Pass Criteria**: Coverage configuration present

#### 4. Test Script
- **Check Type**: `test_script`
- **Severity**: Warning if missing
- **Description**: Validates test command in package.json
- **Pass Criteria**: `scripts.test` field present in package.json
- **Suggestion**: Add `"test": "jest"` or similar to package.json

---

## Gitignore Checker

**Category**: Git Hygiene  
**File**: `src/lib/checkers/gitignore.ts`

### Checks Performed

#### 1. .gitignore Presence
- **Check Type**: `gitignore_presence`
- **Severity**: Error if missing
- **Description**: Verifies .gitignore file exists
- **Pass Criteria**: `.gitignore` file present

#### 2. Gitignore Completeness
- **Check Type**: `gitignore_completeness`
- **Severity**: Warning if incomplete
- **Description**: Checks for common ignore patterns
- **Node.js Projects**:
  - `node_modules`
  - `npm-debug.log`
  - `yarn-error.log`
  - `.pnpm-debug.log`
- **Environment Files**:
  - `.env`
  - `.env.local`
  - `.env.*.local`
- **Build Directories**:
  - `dist`
  - `build`
  - `out`
  - `.next`
- **IDE Files**:
  - `.vscode`
  - `.idea`
  - `*.swp`
  - `.DS_Store`
- **Pass Criteria**: Project-appropriate patterns present

#### 3. Environment Files Committed
- **Check Type**: `env_files_committed`
- **Severity**: Error if found
- **Description**: Detects accidentally committed .env files
- **Detection**: Files matching `.env*` (excluding `.env.example`)
- **Pass Criteria**: No .env files in repository
- **Suggestion**: Remove .env files and add to .gitignore

---

## Dependencies Checker

**Category**: Dependencies  
**File**: `src/lib/checkers/dependencies.ts`

### Checks Performed

#### 1. package.json Presence
- **Check Type**: `package_json_presence`
- **Severity**: Info if missing
- **Description**: Checks for package.json (Node.js projects only)
- **Pass Criteria**: `package.json` file exists

#### 2. Lock File
- **Check Type**: `lock_file`
- **Severity**: Warning if missing or multiple
- **Description**: Validates dependency lock file
- **Supported Lock Files**:
  - `package-lock.json` (npm)
  - `yarn.lock` (Yarn)
  - `pnpm-lock.yaml` (pnpm)
- **Pass Criteria**: Exactly one lock file present
- **Warning**: Multiple lock files indicate mixed package managers

#### 3. Required Fields
- **Check Type**: `package_json_required_fields`
- **Severity**: Error if missing
- **Description**: Validates essential package.json fields
- **Required Fields**:
  - `name`
  - `version`
- **Pass Criteria**: All required fields present

#### 4. Metadata Fields
- **Check Type**: `package_json_metadata`
- **Severity**: Info if missing
- **Description**: Checks for recommended metadata
- **Recommended Fields**:
  - `description`
  - `repository`
  - `keywords`
  - `author`
  - `license`
- **Pass Criteria**: All recommended fields present
- **Suggestion**: Add metadata to improve discoverability

#### 5. Package Scripts
- **Check Type**: `package_scripts`
- **Severity**: Info if few scripts
- **Description**: Validates common npm scripts
- **Common Scripts**:
  - `test`
  - `build`
  - `lint`
- **Pass Criteria**: At least 2 common scripts configured

#### 6. Dependency Count
- **Check Type**: `dependency_count`
- **Severity**: Info (always passes)
- **Description**: Reports dependency statistics
- **Details**: Shows production and dev dependency counts

---

## CI Checker

**Category**: Code Quality  
**File**: `src/lib/checkers/ci.ts`

### Checks Performed

#### 1. CI Configuration Presence
- **Check Type**: `ci_presence`
- **Severity**: Warning if missing
- **Description**: Detects CI/CD configuration files
- **Supported CI Systems**:
  - GitHub Actions (`.github/workflows/`)
  - GitLab CI (`.gitlab-ci.yml`)
  - Travis CI (`.travis.yml`)
  - CircleCI (`.circleci/config.yml`)
  - Jenkins (`Jenkinsfile`)
- **Pass Criteria**: At least one CI system configured

#### 2. GitHub Actions Workflows
- **Check Type**: `github_actions_workflows`
- **Severity**: Success
- **Description**: Counts GitHub Actions workflow files
- **Pass Criteria**: One or more workflow files found
- **Details**: Lists all workflow file paths

#### 3. CI Jobs
- **Check Type**: `ci_jobs`
- **Severity**: Success
- **Description**: Identifies common CI job types
- **Detected Jobs**:
  - Test/Testing
  - Build
  - Lint/Linting
- **Pass Criteria**: At least one job type detected
- **Detection**: Keyword matching in workflow content

---

## Linting Checker

**Category**: Code Quality  
**File**: `src/lib/checkers/linting.ts`

### Checks Performed

#### 1. Linting Configuration Presence
- **Check Type**: `linting_presence`
- **Severity**: Warning if missing
- **Description**: Detects linting and formatting tools
- **Supported Linters**:
  - **ESLint**: `.eslintrc*`, `eslint.config.*`, or package.json dependency
  - **Prettier**: `.prettierrc*`, `prettier.config.*`, or package.json dependency
  - **Pylint**: `.pylintrc`
  - **Rubocop**: `.rubocop.yml`
  - **Stylelint**: package.json dependency
- **Pass Criteria**: At least one linter configured

#### 2. Lint Script
- **Check Type**: `lint_script`
- **Severity**: Info if missing
- **Description**: Validates lint command in package.json
- **Detected Scripts**:
  - `lint`
  - `lint:check`
  - `lint:fix`
- **Pass Criteria**: At least one lint script present
- **Suggestion**: Add `"lint": "eslint ."` to package.json

#### 3. ESLint Ignore File
- **Check Type**: `eslint_ignore`
- **Severity**: Success (informational)
- **Description**: Checks for .eslintignore file
- **Pass Criteria**: `.eslintignore` file exists
- **Triggered**: Only when ESLint is configured

#### 4. Prettier Ignore File
- **Check Type**: `prettier_ignore`
- **Severity**: Success (informational)
- **Description**: Checks for .prettierignore file
- **Pass Criteria**: `.prettierignore` file exists
- **Triggered**: Only when Prettier is configured

---

## Adding Custom Checkers

To add a new checker:

1. Create a new file in `src/lib/checkers/`
2. Extend the `BaseChecker` class
3. Implement the `check(repo: RepositoryData)` method
4. Use `this.createResult()` to generate check results
5. Add the checker to `src/lib/analyzer.ts`

### Example Custom Checker

```typescript
import { BaseChecker } from './base';
import { CheckResult, RepositoryData } from '../types';

export class CustomChecker extends BaseChecker {
  constructor() {
    super('custom', 'Custom Category');
  }

  async check(repo: RepositoryData): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    
    // Your check logic here
    const someFile = this.findFile(repo, 'some-file.txt');
    
    if (!someFile) {
      results.push(
        this.createResult(
          'custom_check',
          false,
          'Some file not found',
          'warning',
          {
            suggestion: 'Add some-file.txt to your repository',
          }
        )
      );
    } else {
      results.push(
        this.createResult(
          'custom_check',
          true,
          'Some file exists',
          'success'
        )
      );
    }
    
    return results;
  }
}
```

Then add to `analyzer.ts`:

```typescript
import { CustomChecker } from './checkers/custom';

// In the analyze method:
if (this.config.checks?.custom) {
  checkers.push(new CustomChecker());
}
```

---

## Severity Levels

- **Error** (🔴): Critical issues that should be fixed immediately
- **Warning** (🟡): Important issues that should be addressed
- **Info** (🔵): Suggestions for improvement
- **Success** (🟢): Checks that passed successfully

## Configuration

Each checker can be enabled/disabled via configuration:

```typescript
{
  checks: {
    readme: true,
    license: true,
    tests: true,
    gitignore: true,
    dependencies: true,
    ci: true,
    linting: true
  }
}
```
