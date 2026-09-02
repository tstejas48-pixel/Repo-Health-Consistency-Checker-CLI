# Project Structure

Complete overview of the Repo Health Checker file organization.

```
repo-health-checker/
│
├── 📄 Configuration Files
│   ├── .env                      # Environment variables (not in git)
│   ├── .env.example              # Environment template
│   ├── package.json              # Project dependencies
│   ├── package-lock.json         # Locked dependency versions
│   ├── tsconfig.json             # TypeScript configuration
│   ├── next.config.ts            # Next.js configuration
│   ├── eslint.config.mjs         # ESLint rules
│   ├── postcss.config.mjs        # PostCSS configuration
│   ├── tailwind.config.ts        # Tailwind CSS configuration (auto-generated)
│   └── drizzle.config.json       # Drizzle ORM configuration
│
├── 📚 Documentation
│   ├── README.md                 # Main project documentation
│   ├── QUICKSTART.md            # 5-minute setup guide
│   ├── CHECKERS.md              # Detailed checker documentation
│   ├── API.md                   # API reference and examples
│   ├── CONTRIBUTING.md          # Contribution guidelines
│   ├── CHANGELOG.md             # Version history
│   ├── LICENSE                  # MIT license
│   └── PROJECT_STRUCTURE.md     # This file
│
├── 📁 src/                      # Source code
│   │
│   ├── 🎨 app/                  # Next.js App Router
│   │   │
│   │   ├── page.tsx             # Home page - main UI
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── globals.css          # Global styles and Tailwind
│   │   │
│   │   └── api/                 # API Routes
│   │       ├── health/
│   │       │   └── route.ts     # Health check endpoint
│   │       │
│   │       ├── analyze/
│   │       │   └── route.ts     # Upload & analyze endpoint
│   │       │
│   │       ├── demo/
│   │       │   └── route.ts     # Demo analysis endpoint
│   │       │
│   │       ├── analysis/
│   │       │   └── [id]/
│   │       │       └── route.ts # Get analysis by ID
│   │       │
│   │       └── analyses/
│   │           └── route.ts     # List all analyses
│   │
│   ├── 🗄️ db/                   # Database
│   │   ├── index.ts             # Database connection
│   │   └── schema.ts            # Drizzle schema definitions
│   │                            #   - repositories table
│   │                            #   - analyses table
│   │                            #   - checks table
│   │
│   └── 📦 lib/                  # Business logic
│       │
│       ├── types.ts             # TypeScript type definitions
│       │                        #   - CheckResult
│       │                        #   - AnalysisResult
│       │                        #   - HealthCheckConfig
│       │                        #   - RepositoryData
│       │
│       ├── analyzer.ts          # Main analysis orchestrator
│       │                        #   - RepositoryAnalyzer class
│       │                        #   - Score calculation
│       │                        #   - Checker coordination
│       │
│       ├── repo-parser.ts       # Repository file parsing
│       │                        #   - parseUploadedFiles()
│       │                        #   - createMockRepository()
│       │
│       └── checkers/            # Individual checker modules
│           │
│           ├── base.ts          # Abstract base checker
│           │                    #   - BaseChecker class
│           │                    #   - Helper methods
│           │
│           ├── readme.ts        # Documentation checker
│           │                    #   - README presence
│           │                    #   - Length validation
│           │                    #   - Section detection
│           │                    #   - Code examples
│           │
│           ├── license.ts       # Legal compliance checker
│           │                    #   - LICENSE file presence
│           │                    #   - License recognition
│           │                    #   - Copyright validation
│           │
│           ├── tests.ts         # Test coverage checker
│           │                    #   - Test file detection
│           │                    #   - Framework identification
│           │                    #   - Coverage config
│           │                    #   - Test scripts
│           │
│           ├── gitignore.ts     # Git hygiene checker
│           │                    #   - .gitignore presence
│           │                    #   - Pattern completeness
│           │                    #   - .env file detection
│           │
│           ├── dependencies.ts  # Package management checker
│           │                    #   - package.json validation
│           │                    #   - Lock file verification
│           │                    #   - Metadata checks
│           │                    #   - Scripts validation
│           │
│           ├── ci.ts           # CI/CD checker
│           │                    #   - Workflow detection
│           │                    #   - Job analysis
│           │                    #   - Multi-platform support
│           │
│           └── linting.ts       # Code quality checker
│                                #   - Linter detection
│                                #   - Config validation
│                                #   - Script checks
│
├── 📦 node_modules/             # Dependencies (not in git)
│
└── 🏗️ Build Output
    ├── .next/                   # Next.js build output (not in git)
    └── tsconfig.tsbuildinfo     # TypeScript build cache

```

## Directory Purposes

### Root Level

Contains configuration files and documentation. All markdown files are in the root for easy discovery.

### `/src/app/`

Next.js App Router structure. Pages and API routes live here.

- **page.tsx**: Main application UI with upload and demo functionality
- **layout.tsx**: Root layout, metadata, and global HTML structure
- **globals.css**: Tailwind directives and global styles
- **api/**: RESTful API endpoints

### `/src/db/`

Database layer using Drizzle ORM.

- **schema.ts**: Table definitions (repositories, analyses, checks)
- **index.ts**: PostgreSQL connection configuration

### `/src/lib/`

Core business logic, independent of framework.

- **types.ts**: Shared TypeScript interfaces and types
- **analyzer.ts**: Main orchestrator that runs all checkers
- **repo-parser.ts**: Utilities for parsing uploaded files
- **checkers/**: Individual health check modules

### `/src/lib/checkers/`

Each checker is a self-contained module:

1. Extends `BaseChecker`
2. Implements `check()` method
3. Returns array of `CheckResult`
4. Focuses on single responsibility

## Key Design Patterns

### Strategy Pattern
Checkers are swappable strategies for different check types.

### Factory Pattern
Analyzer creates checkers based on configuration.

### Builder Pattern
Results are built progressively by each checker.

### Single Responsibility
Each checker handles one aspect of repository health.

## File Naming Conventions

- **Components**: PascalCase (e.g., `RepositoryAnalyzer`)
- **Files**: kebab-case for multi-word (e.g., `repo-parser.ts`)
- **Types**: PascalCase interfaces (e.g., `CheckResult`)
- **API Routes**: lowercase folders (e.g., `/api/analyze/`)

## Import Patterns

```typescript
// External dependencies
import { NextRequest, NextResponse } from 'next/server';

// Database
import { db } from '@/db';
import { repositories } from '@/db/schema';

// Types
import { AnalysisResult } from '@/lib/types';

// Business logic
import { RepositoryAnalyzer } from '@/lib/analyzer';
import { ReadmeChecker } from '@/lib/checkers/readme';
```

## Adding New Features

### New Checker

1. Create file in `/src/lib/checkers/`
2. Extend `BaseChecker`
3. Add to analyzer in `/src/lib/analyzer.ts`
4. Update types in `/src/lib/types.ts`
5. Document in `CHECKERS.md`

### New API Endpoint

1. Create folder in `/src/app/api/`
2. Add `route.ts` file
3. Export HTTP method handlers
4. Document in `API.md`

### New Page

1. Create folder in `/src/app/`
2. Add `page.tsx` file
3. Update navigation in main page

## Build Output

### Development

```
.next/
├── cache/           # Build cache
└── server/          # Server components

tsconfig.tsbuildinfo # TypeScript incremental build
```

### Production

```
.next/
├── static/          # Static assets
├── server/          # Server-side code
└── standalone/      # Standalone deployment (if enabled)
```

## Environment Files

### .env
Contains actual secrets and configuration (never commit):
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
GITHUB_TOKEN="ghp_..."
```

### .env.example
Template for required environment variables (safe to commit):
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
GITHUB_TOKEN=""
```

## Data Flow

```
User Upload
    ↓
POST /api/analyze
    ↓
parseUploadedFiles()
    ↓
RepositoryAnalyzer
    ↓
Individual Checkers (parallel)
    ├─ ReadmeChecker
    ├─ LicenseChecker
    ├─ TestsChecker
    ├─ GitignoreChecker
    ├─ DependenciesChecker
    ├─ CIChecker
    └─ LintingChecker
    ↓
Aggregate Results
    ↓
Calculate Health Score
    ↓
Save to Database
    ↓
Return AnalysisResult
```

## Database Schema

```
repositories
├── id (UUID, PK)
├── name (string)
├── url (string, nullable)
├── type (string)
└── createdAt (timestamp)

analyses
├── id (UUID, PK)
├── repositoryId (UUID, FK)
├── healthScore (integer)
├── status (string)
├── config (JSONB)
├── results (JSONB)
├── errorMessage (string, nullable)
├── createdAt (timestamp)
└── completedAt (timestamp, nullable)

checks
├── id (UUID, PK)
├── analysisId (UUID, FK)
├── checkType (string)
├── severity (string)
├── passed (boolean)
├── message (string)
├── details (JSONB, nullable)
├── filePath (string, nullable)
├── lineNumber (integer, nullable)
└── createdAt (timestamp)
```

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Styling**: Tailwind CSS 4
- **Build Tool**: Turbopack
- **Linting**: ESLint 9

## Scripts

```json
{
  "dev": "next dev",           // Development server
  "build": "next build",       // Production build
  "start": "next start",       // Production server
  "lint": "eslint .",          // Run linter
  "typecheck": "tsc --noEmit"  // Type checking
}
```

## Best Practices

1. **Keep checkers independent**: No dependencies between checkers
2. **Use TypeScript**: Always define types for new features
3. **Document thoroughly**: Update relevant .md files
4. **Test locally**: Run full validation before committing
5. **Follow conventions**: Use existing patterns for consistency

---

**Last Updated**: 2024-01-15  
**Version**: 1.0.0
