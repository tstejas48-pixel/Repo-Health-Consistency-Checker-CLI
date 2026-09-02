# 🏥 Repo Health & Consistency Checker

A comprehensive web-based tool for analyzing Git repositories for code quality, documentation standards, and best practices. Built with Next.js, PostgreSQL, and Drizzle ORM.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 📖 Documentation Analysis
- **README Presence & Quality**: Checks for README.md existence and minimum length requirements
- **Required Sections**: Validates presence of Installation, Usage, and License sections
- **Code Examples**: Detects code blocks and examples in documentation
- **Link Validation**: Identifies broken links (coming soon)

### ⚖️ Legal & Compliance
- **License Detection**: Automatically recognizes common open-source licenses (MIT, Apache, GPL, etc.)
- **License Compatibility**: Checks for license file presence and format
- **Copyright Verification**: Validates copyright notices and year updates

### 🧪 Code Quality
- **Test Coverage**: Detects test files and directories
- **Test Framework**: Identifies Jest, Vitest, Mocha, Pytest configurations
- **Coverage Configuration**: Checks for test coverage setup
- **Test Scripts**: Validates package.json test scripts

### 🔒 Git Hygiene
- **.gitignore Completeness**: Ensures common patterns are ignored (node_modules, .env, etc.)
- **Environment File Protection**: Detects accidentally committed .env files
- **Project-Specific Patterns**: Tailored checks based on detected project type

### 📦 Dependencies
- **Package Metadata**: Validates package.json required and recommended fields
- **Lock File Verification**: Checks for consistent dependency locking
- **Script Configuration**: Validates common npm scripts (test, build, lint)
- **Dependency Count**: Reports production and dev dependencies

### 🚀 CI/CD Integration
- **Workflow Detection**: Identifies GitHub Actions, GitLab CI, Travis, CircleCI, Jenkins
- **Job Analysis**: Detects test, build, and lint jobs in CI pipelines
- **Multi-Platform Support**: Recognizes various CI/CD configurations

### 🎨 Linting & Formatting
- **ESLint Configuration**: Detects ESLint setup and rules
- **Prettier Support**: Identifies code formatting configuration
- **Multi-Language**: Supports JavaScript/TypeScript, Python, Ruby linters
- **Ignore Files**: Validates .eslintignore and .prettierignore presence

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/repo-health-checker.git
cd repo-health-checker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database connection string
DATABASE_URL="postgresql://user:password@localhost:5432/repo_health"
```

4. Push database schema:
```bash
npx drizzle-kit push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💻 Usage

### Web Interface

#### Try Demo
1. Click the **"Try Demo"** tab
2. Click **"Run Demo Analysis"**
3. View comprehensive health report with scores and recommendations

#### Upload Repository
1. Click the **"Upload Files"** tab
2. Enter repository name (optional)
3. Click to select your project folder
4. Click **"Analyze Repository"**
5. Review detailed health report

### API Endpoints

#### Analyze Repository
```bash
POST /api/analyze
Content-Type: multipart/form-data

# Upload files with form data:
# - files: File[] (repository files)
# - repoName: string (optional)
# - config: JSON string (optional)
```

#### Run Demo Analysis
```bash
POST /api/demo

# Returns analysis of sample well-configured repository
```

#### Get Analysis Results
```bash
GET /api/analysis/[id]

# Returns analysis details, checks, and repository info
```

#### List All Analyses
```bash
GET /api/analyses

# Returns recent analyses (limit 50)
```

## 📊 Health Score Calculation

The health score (0-100) is calculated based on:

- **Success checks**: +5 points each
- **Info items**: -1 point each
- **Warnings**: -5 points each
- **Errors**: -10 points each

Score ranges:
- 🟢 **80-100**: Excellent health
- 🟡 **60-79**: Good health
- 🟠 **40-59**: Needs improvement
- 🔴 **0-39**: Critical issues

## 🏗️ Architecture

```
repo-health-checker/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/      # Repository upload & analysis
│   │   │   ├── analysis/     # Get analysis by ID
│   │   │   ├── analyses/     # List all analyses
│   │   │   ├── demo/         # Demo analysis endpoint
│   │   │   └── health/       # Health check endpoint
│   │   ├── page.tsx          # Main UI
│   │   └── layout.tsx        # App layout
│   ├── db/
│   │   ├── schema.ts         # Database schema (Drizzle)
│   │   └── index.ts          # Database connection
│   └── lib/
│       ├── checkers/         # Individual checker modules
│       │   ├── base.ts       # Abstract checker class
│       │   ├── readme.ts     # Documentation checker
│       │   ├── license.ts    # Legal compliance checker
│       │   ├── tests.ts      # Test coverage checker
│       │   ├── gitignore.ts  # Git hygiene checker
│       │   ├── dependencies.ts
│       │   ├── ci.ts
│       │   └── linting.ts
│       ├── analyzer.ts       # Main analyzer orchestrator
│       ├── repo-parser.ts    # Repository file parser
│       └── types.ts          # TypeScript types
```

## 🗄️ Database Schema

### Tables

**repositories**
- id (UUID)
- name (string)
- url (string, optional)
- type (github | local | upload)
- createdAt (timestamp)

**analyses**
- id (UUID)
- repositoryId (UUID, foreign key)
- healthScore (integer, 0-100)
- status (running | completed | failed)
- config (JSON)
- results (JSON)
- errorMessage (string, optional)
- createdAt (timestamp)
- completedAt (timestamp, optional)

**checks**
- id (UUID)
- analysisId (UUID, foreign key)
- checkType (string)
- severity (error | warning | info | success)
- passed (boolean)
- message (string)
- details (JSON)
- filePath (string, optional)
- lineNumber (integer, optional)
- createdAt (timestamp)

## 🧪 Testing

```bash
# Run type checks
npm run typecheck

# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Configuration

Custom check configurations can be provided when analyzing:

```typescript
{
  enabled: true,
  checks: {
    readme: true,
    license: true,
    tests: true,
    commits: false,
    dependencies: true,
    gitignore: true,
    ci: true,
    linting: true
  },
  thresholds: {
    minReadmeLength: 300,
    maxDependencyAge: 365,
    minTestCoverage: 70
  },
  severity: ['error', 'warning', 'info']
}
```

## 🎯 Roadmap

### Phase 2 - Enhancement
- [ ] GitHub integration for direct repository analysis
- [ ] Auto-fix capabilities for common issues
- [ ] Markdown report generation
- [ ] Badge generation for README
- [ ] Commit message convention validation
- [ ] Branch naming convention checks

### Phase 3 - Advanced Features
- [ ] GitHub Action for automated PR comments
- [ ] Trend tracking over time
- [ ] Multi-repository dashboard
- [ ] Custom checker plugins
- [ ] Slack/Discord notifications
- [ ] Scheduled health digests

### Phase 4 - Enterprise
- [ ] Team-wide policy enforcement
- [ ] SSO integration
- [ ] Role-based access control
- [ ] White-label customization
- [ ] API rate limiting
- [ ] Webhook support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) - React framework
- Database ORM by [Drizzle](https://orm.drizzle.team/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from emoji (native support)

## 📬 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ for healthier codebases**
#   R e p o - H e a l t h - C o n s i s t e n c y - C h e c k e r - C L I  
 