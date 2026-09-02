# Contributing to Repo Health Checker

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Adding New Checkers](#adding-new-checkers)
- [Style Guidelines](#style-guidelines)

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/repo-health-checker.git
   cd repo-health-checker
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original/repo-health-checker.git
   ```

## Development Setup

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. Push database schema:
   ```bash
   npx drizzle-kit push
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-python-checker` - New features
- `fix/readme-length-check` - Bug fixes
- `docs/update-api-guide` - Documentation
- `refactor/analyzer-class` - Code refactoring
- `test/add-checker-tests` - Tests

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(checkers): add Python dependency checker

Add support for analyzing Python projects with requirements.txt
and pyproject.toml files.

Closes #123
```

```
fix(readme): correct minimum length threshold

The README checker was using 500 chars instead of 300 as documented.
```

## Testing

### Run Type Checks
```bash
npm run typecheck
```

### Run Linting
```bash
npm run lint
```

### Build Application
```bash
npm run build
```

### Test Checkers Manually

1. Use the demo endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/demo
   ```

2. Upload test files via the web interface

3. Verify check results match expected behavior

## Submitting Changes

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] TypeScript types are properly defined
- [ ] All type checks pass (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Application builds successfully (`npm run build`)
- [ ] Commit messages follow Conventional Commits
- [ ] Documentation is updated (if applicable)

### Pull Request Process

1. **Update your fork**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to your fork**:
   ```bash
   git push origin your-branch-name
   ```

3. **Create Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what changed and why
   - Link to related issues (if applicable)
   - Screenshots (for UI changes)

4. **Respond to feedback** from maintainers

5. **Wait for approval** and merge

## Adding New Checkers

### 1. Create Checker File

Create a new file in `src/lib/checkers/`:

```typescript
// src/lib/checkers/your-checker.ts
import { BaseChecker } from './base';
import { CheckResult, RepositoryData } from '../types';

export class YourChecker extends BaseChecker {
  constructor() {
    super('your-checker', 'Your Category');
  }

  async check(repo: RepositoryData): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    
    // Implement your checks here
    
    return results;
  }
}
```

### 2. Add to Analyzer

Update `src/lib/analyzer.ts`:

```typescript
import { YourChecker } from './checkers/your-checker';

// In the analyze method:
if (this.config.checks?.yourChecker) {
  checkers.push(new YourChecker());
}
```

### 3. Update Types

Add to `HealthCheckConfig` in `src/lib/types.ts`:

```typescript
checks?: {
  // ... existing checks
  yourChecker?: boolean;
};
```

### 4. Document Checker

Add documentation to `CHECKERS.md` following the existing format.

### 5. Test Checker

- Test with various repository configurations
- Verify error handling
- Check for edge cases
- Ensure proper severity levels

## Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types (no `any` unless absolutely necessary)
- Use interfaces for complex objects
- Export types from dedicated files

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Keep functions focused and small
- Use descriptive variable names

### React/Next.js

- Use functional components with hooks
- Keep components focused and reusable
- Use TypeScript for props
- Follow Next.js App Router conventions

### File Organization

```
src/
├── app/              # Next.js pages and API routes
├── lib/
│   ├── checkers/     # Individual checker modules
│   ├── types.ts      # Shared TypeScript types
│   ├── analyzer.ts   # Main orchestrator
│   └── utils/        # Utility functions
└── db/
    ├── schema.ts     # Database schema
    └── index.ts      # Database connection
```

### Comments

- Add JSDoc comments for public functions
- Explain complex logic with inline comments
- Don't comment obvious code
- Keep comments up-to-date

Example:
```typescript
/**
 * Analyzes a repository for health and quality metrics
 * @param repo Repository data including files and metadata
 * @param repoName Display name for the repository
 * @returns Analysis result with health score and detailed checks
 */
async analyze(repo: RepositoryData, repoName: string): Promise<AnalysisResult>
```

## Documentation

### Update Documentation When:

- Adding new features
- Changing API endpoints
- Modifying configuration options
- Adding new checkers
- Changing database schema

### Documentation Files:

- `README.md` - Overview and getting started
- `CHECKERS.md` - Detailed checker documentation
- `CONTRIBUTING.md` - This file
- Code comments - Inline documentation

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Check existing issues before creating new ones

## Recognition

Contributors will be recognized in:
- Repository contributors list
- Release notes
- Special thanks section (for significant contributions)

Thank you for contributing to Repo Health Checker! 🎉
