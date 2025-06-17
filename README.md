# twreporter-congress-dashboard-monorepo

## Introduction

This is the monorepo of twreporter congress dashboard.
This monorepo containing follow sub-packages:

- [@twreporter-congress-dashboard/frontend](./packages/frontend/): see `packages/frontend`
- [@twreporter-congress-dashboard/cms](./packages/cms/): see `packages/cms`
- [@twreporter-congress-dashboard/shared](./packages/shared/): see `packages/shared`

### Monorepo management

We use [lerna](https://lerna.js.org/) v8 with `yarn workspace` to manage this monorepo.
We also use [Changesets](https://github.com/changesets/changesets) for version management and automated releases.
Please refer to [lerna document](https://lerna.js.org/docs/api-reference/commands) for the cli commands details.

## Get Started

### Install

We use `yarn` for dependency management.
Please install dependencies on root before execution.

```shell
$ yarn install
```

### Development

#### How to add sub-package

1. add sub-package under `/packages` folder
2. add sub-package info in this `README.md`

#### Version Management with Changesets

We use [Changesets](https://github.com/changesets/changesets) for automated version management, changelog generation, and publishing. Here's how to work with it:

##### Creating a Changeset

When you make changes that should trigger a version bump, create a changeset:

```shell
$ yarn changeset
```

This will:
1. Ask which packages have been changed
2. Ask whether the change is a major, minor, or patch
3. Ask for a summary of the change
4. Generate a changeset file in `.changeset/`

##### Changeset Guidelines

- **Patch**: Bug fixes, small improvements
- **Minor**: New features, non-breaking changes
- **Major**: Breaking changes

##### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) enforced by [commitlint](https://commitlint.js.org/). All commit messages must follow this format:

##### Example Workflow

```shell
# Make your changes
$ git checkout -b feature/my-feature

# Create a changeset
$ yarn changeset
# Follow the prompts to describe your changes

# Commit both your changes and the changeset
$ git add .
$ git commit -m "feat: add new feature"
$ git push origin feature/my-feature

# Create a pull request
```

##### Branch Strategy & Automated Releases

Our CI/CD pipeline automatically handles versioning and publishing based on the target branch:

| Branch | Action | Version Format | NPM Tag | Description |
|--------|--------|----------------|---------|-------------|
| `dev` | Auto-publish | `1.2.3-beta.0` | `beta` | Development releases |
| `master` | Auto-publish | `1.2.3-rc.0` | `rc` | Release candidate |
| `staging` | Sync & publish | `1.2.3-rc.0` | `rc` | Staging deployment (no version bump) |
| `release` | Auto-publish | `1.2.3` | `latest` | Production release |

##### Changeset Commands

```shell
# Create a new changeset
$ yarn changeset

# Check changeset status
$ yarn changeset:status

# Version packages (usually done by CI)
$ yarn changeset:version

# Publish packages (usually done by CI)
$ yarn changeset:publish
```

##### Manual Version Management (if needed)

```shell
# Preview what versions would be bumped
$ yarn changeset:status

# Apply version bumps locally (for testing)
$ yarn changeset:version

# Publish manually (for emergency releases)
$ yarn changeset:publish
```

## CI/CD

We use a combination of GCP `cloud run` for hosting and GitHub Actions for automated CI/CD with Changesets integration.

### Automated Workflows

#### 1. Development Workflow (`dev` branch)
- **Trigger**: Push to `dev` branch
- **Action**: Creates beta releases automatically
- **Version**: `1.2.3-beta.0`, `1.2.3-beta.1`, etc.
- **NPM Tag**: `beta`
- **File**: `.github/workflows/dev-beta-release.yml`

#### 2. Release Candidate Workflow (`master` branch)
- **Trigger**: Push to `master` branch
- **Action**: Creates RC releases automatically
- **Version**: `1.2.3-rc.0`, `1.2.3-rc.1`, etc.
- **NPM Tag**: `rc`
- **File**: `.github/workflows/master-rc-release.yml`

#### 3. Staging Sync Workflow (`staging` branch)
- **Trigger**: Push to `staging` branch
- **Action**: Syncs with master, publishes existing RC version
- **Version**: No bump, uses current RC version
- **NPM Tag**: `rc`
- **File**: `.github/workflows/staging-sync.yml`

#### 4. Production Release Workflow (`release` branch)
- **Trigger**: Push to `release` branch
- **Action**: Creates production release and syncs back to master/staging
- **Version**: `1.2.3` (removes pre-release tags)
- **NPM Tag**: `latest`
- **File**: `.github/workflows/release-production.yml`

#### 5. PR Changeset Check
- **Trigger**: Pull request opened/updated
- **Action**: Checks for changeset files and shows status
- **File**: `.github/workflows/changeset-pr.yml`

### GCP Cloud Run Deployment

To add new service in this project, please add following configuration:

1. add `Dockerfile` under your sub-package folder
  a. `cloudbuild.yaml` would execute the `docker build` command for target package 
2. configure your service on `cloud run`
3. add trigger to `cloud build`
  a. please use `congress-dashboard-cloud-build` service account
  b. don't forget to add `substitutions`
  c. don't forget to add `packages/<sub-package name>/**` to included files filter
4. add your service in the `load-balancer`
5. configure DNS setting on `cloudflare`

### Environment Variables Required

For the automated workflows to work, make sure these secrets are configured in GitHub:

- `NPM_TOKEN`: Token for publishing to npm registry
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Release Process

#### Standard Release Process

1. **Development**: 
   ```shell
   # Create feature branch
   git checkout -b feature/my-feature
   
   # Make changes and create changeset
   yarn changeset
   
   # Commit and push
   git commit -m "feat: my new feature"
   git push origin feature/my-feature
   ```

2. **Beta Release**: Merge PR to `dev` → Auto-publishes beta version

3. **RC Release**: Merge `dev` to `master` → Auto-publishes RC version

4. **Staging**: Merge `master` to `staging` → Deploys RC to staging

5. **Production**: Merge `staging` to `release` → Publishes final version

#### Hotfix Process

For urgent fixes:

```shell
# Create hotfix branch from master
git checkout master
git checkout -b hotfix/urgent-fix

# Make changes and create changeset
yarn changeset

# Commit and push
git commit -m "fix: urgent security fix"
git push origin hotfix/urgent-fix

# Create PR to master for RC, then to release for production
```

## Troubleshooting

### Common Changeset Issues

1. **No changeset found warning**: Create a changeset with `yarn changeset`
2. **Version conflicts**: Check `yarn changeset:status` and resolve manually
3. **Publishing fails**: Verify `NPM_TOKEN` is set correctly in GitHub secrets
4. **Workflow not triggering**: Check branch names match exactly (`dev`, `master`, `staging`, `release`)

### Debugging Workflows

- Check workflow runs in GitHub Actions tab
- Verify secrets are configured
- Ensure changesets are committed with your changes
- Check package.json `publishConfig` settings
