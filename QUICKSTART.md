# 🚀 Quick Start Guide

Get up and running with Repo Health Checker in 5 minutes.

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 18 or higher installed
- ✅ PostgreSQL database running
- ✅ npm or yarn package manager

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/repo-health-checker.git
cd repo-health-checker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Database

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/repo_health"
```

### 4. Initialize Database

```bash
npx drizzle-kit push
```

This creates the necessary database tables.

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Try the Demo

The fastest way to see the tool in action:

1. Click the **"Try Demo"** tab
2. Click **"Run Demo Analysis"** button
3. View the comprehensive health report

The demo analyzes a sample well-configured repository and shows you what a healthy project looks like.

## 📁 Upload Your Own Repository

To analyze your own project:

1. Click the **"Upload Files"** tab
2. Enter your repository name (optional)
3. Click the upload area and select your project folder
4. Click **"Analyze Repository"**
5. Wait for analysis to complete (usually < 5 seconds)
6. Review your health score and recommendations

## 📊 Understanding Results

### Health Score

Your repository gets a score from 0-100:

- 🟢 **80-100**: Excellent - Your repo is in great shape!
- 🟡 **60-79**: Good - Some improvements recommended
- 🟠 **40-59**: Fair - Several issues need attention
- 🔴 **0-39**: Poor - Critical issues require immediate action

### Check Results

Each check shows:
- ✅ **Success** (green): Check passed
- ⚠️ **Warning** (yellow): Recommended improvement
- ❌ **Error** (red): Critical issue to fix
- ℹ️ **Info** (blue): Informational message

### Categories

Checks are organized into categories:

1. **Documentation** - README quality and structure
2. **Legal & Compliance** - License and copyright
3. **Code Quality** - Tests, CI/CD, linting
4. **Git Hygiene** - .gitignore and best practices
5. **Dependencies** - Package management

## 🔧 Common Issues

### Database Connection Error

**Problem**: Can't connect to PostgreSQL

**Solution**:
```bash
# Check if PostgreSQL is running
pg_isready

# Create database if it doesn't exist
createdb repo_health

# Verify connection string in .env
DATABASE_URL="postgresql://user:password@localhost:5432/repo_health"
```

### Port Already in Use

**Problem**: Port 3000 is already in use

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Or use a different port
PORT=3001 npm run dev
```

### Module Not Found Error

**Problem**: Missing dependencies

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📝 Next Steps

Once you're up and running:

1. **Read the Documentation**
   - [README.md](README.md) - Full documentation
   - [CHECKERS.md](CHECKERS.md) - Detailed checker info
   - [API.md](API.md) - API reference

2. **Customize Configuration**
   - Enable/disable specific checks
   - Adjust thresholds for your needs
   - Create team-wide configs

3. **Integrate with CI/CD**
   - Add to GitHub Actions workflow
   - Automate repository health checks
   - Track health over time

4. **Contribute**
   - Add new checkers
   - Improve existing checks
   - Report bugs or suggest features
   - See [CONTRIBUTING.md](CONTRIBUTING.md)

## 💡 Tips

### For Best Results

- **Upload complete repositories**: Include all configuration files
- **Use descriptive names**: Helps track multiple projects
- **Review suggestions**: Each failed check includes improvement tips
- **Run regularly**: Track health improvements over time

### File Selection

When uploading, include:
- ✅ README.md, LICENSE
- ✅ package.json, package-lock.json
- ✅ .gitignore, .eslintrc, etc.
- ✅ Test files
- ✅ CI/CD configs (.github/workflows)

Exclude:
- ❌ node_modules, .git
- ❌ dist, build directories
- ❌ Large binary files

## 🆘 Getting Help

If you run into issues:

1. **Check the logs**: Look for error messages in terminal
2. **Search existing issues**: Someone may have had the same problem
3. **Create an issue**: Provide detailed error information
4. **Ask in discussions**: For questions or ideas

## 🎉 Success!

You're now ready to improve your repository health! Start analyzing and watch your health score improve.

---

**Need more help?** Check out the [full documentation](README.md) or [open an issue](https://github.com/yourusername/repo-health-checker/issues).
