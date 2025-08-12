# twreporter-congress-dashboard-monorepo

## Introduction

This is the monorepo of twreporter congress dashboard.

### 📦 Packages

This monorepo contains the following sub-packages:

- **[@twreporter/congress-dashboard-frontend](./packages/frontend/)**: Next.js 15 frontend with React 19, TypeScript, Algolia search, and modern UI components
- **[@twreporter/congress-dashboard-cms](./packages/cms/)**: KeystoneJS 6 headless CMS with MySQL database, Prisma ORM, and GraphQL API
- **[@twreporter/congress-dashboard-shared](./packages/shared/)**: Shared TypeScript utilities, types, and configurations
- **[lawmaker-cli](./packages/cli/)**: Command-line tool for data processing, Algolia indexing, and system management

### 🏗️ Monorepo Management

We use [Lerna](https://lerna.js.org/) v8 with Yarn Workspaces to manage this monorepo, following conventional commits for automated versioning and changelogs.

## 🚀 Get Started

### Prerequisites

- **Node.js**: 18+ (recommended: 20 LTS or higher)
- **Yarn**: v4.6.0 (managed via Corepack - enable with `corepack enable`)
- **Database**: MySQL (local installation or cloud instance like Google Cloud SQL)
- **Optional**: Docker (for containerized development/deployment)

### Installation

We use Yarn with Workspaces for dependency management. Install all dependencies from the root:

```bash
# Enable Corepack (if not already enabled)
corepack enable

# Install all dependencies
yarn install
```

This will:
- Install dependencies for all packages
- Build the shared package automatically (via postinstall hook)
- Set up Husky git hooks

### Development Setup

#### 1. Environment Setup
Create environment files for each package as needed:
```bash
# CMS environment
cp packages/cms/.env.example packages/cms/.env.local

# Frontend environment  
cp packages/frontend/.env.example packages/frontend/.env.local
```

#### 2. Database Setup (CMS)
```bash
# Navigate to CMS package
cd packages/cms

# Set up your MySQL database and update .env.local with DATABASE_URL
# Example: DATABASE_URL="mysql://username:password@localhost:3306/congress_dashboard"

# Run database migrations
yarn db-migrate

# Generate Prisma client
yarn prisma-generate
```

#### 3. Start Development Servers
```bash
# Start CMS (GraphQL API + Admin UI) with Turbopack
yarn workspace @twreporter/congress-dashboard-cms dev

# Start Frontend with Turbopack (in another terminal)
yarn workspace @twreporter/congress-dashboard-frontend dev

# Optional: Start Storybook for component development
yarn workspace @twreporter/congress-dashboard-frontend storybook
```

The services will be available at:
- **CMS Admin UI**: http://localhost:3000
- **GraphQL API**: http://localhost:3000/api/graphql  
- **Frontend**: http://localhost:3001
- **Storybook**: http://localhost:6006 (if running)

### Package-Specific Commands

#### Shared Package
```bash
# Build shared utilities
yarn workspace @twreporter/congress-dashboard-shared build

# Publish to npm (automated via CI)
yarn workspace @twreporter/congress-dashboard-shared publish
```

#### CLI Tool
```bash
# Build CLI tool
yarn workspace lawmaker-cli build

# Run CLI in development mode
yarn workspace lawmaker-cli dev

# Use built CLI with various commands
yarn workspace lawmaker-cli lawmaker --help
yarn workspace lawmaker-cli lawmaker transfer  # Data transfer operations
yarn workspace lawmaker-cli lawmaker algolia   # Algolia index management
```

## 🛠️ Development Environment

### Recommended VS Code Extensions
- **TypeScript**: Enhanced TypeScript support
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Prisma**: Database schema editing
- **GraphQL**: GraphQL syntax highlighting and IntelliSense
- **Docker**: Container management (if using Docker)

### Code Quality Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Extended from Next.js and Storybook configurations
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for linting and formatting
- **Commitlint**: Conventional commit message validation

## 📋 Development Workflow

### Adding a New Package

1. Create package directory under `/packages/`
2. Add package to root `package.json` workspaces
3. Update this `README.md` with package information
4. Add package-specific build/deploy configurations

### Version Management with Lerna

We use [Lerna](https://lerna.js.org/) with conventional commits for automated version management and changelog generation.

##### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) enforced by [commitlint](https://commitlint.js.org/). All commit messages must follow this format:

### Debugging Workflows

- Check workflow runs in GitHub Actions tab
- Verify Node.js version matches workflow requirements (22.17.1)
- Ensure environment secrets are properly configured
- Check package.json `publishConfig` settings for npm publishing
