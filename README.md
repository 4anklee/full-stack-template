# Full Stack Template

A TypeScript monorepo with React, TanStack Start, Expo, Hono, and oRPC, sharing authentication, database access, and API types across applications.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Start** - SSR framework with TanStack Router
- **React Native** - Build mobile apps using React
- **Expo** - Tools for React Native development
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **HeroUI** - HeroUI React components on web and HeroUI Native on mobile
- **Hono** - Lightweight, performant server framework
- **oRPC** - End-to-end type-safe APIs with OpenAPI integration
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Vite+** - Unified Vite toolchain, workspace task runner, linting, and formatting

## Getting Started

<!-- template:start -->

Generate a project with [Copier](https://copier.readthedocs.io/) using [uv](https://docs.astral.sh/uv/):

```bash
uvx --from copier==9.19.1 copier copy --trust --vcs-ref=HEAD gh:4anklee/full-stack-template my-app
```

Copier prompts for the GitHub owner and repository, display name, slug, description, native URL scheme, and mobile application ID. Its tasks install Bun dependencies, refresh `bun.lock`, and format generated files. `--trust` permits those tasks. For noninteractive generation, add `--defaults --data repository_owner=acme --data repository_name=my-app` and any other answers you want to override. Use `--pretend` to preview generation or `--skip-tasks` to render without installing dependencies.

GitHub's **Use this template** button also works. Wait for **Initialize repository** in the new repository's Actions tab to finish before cloning. It runs Copier against the upstream template's current `HEAD`, supplies the new repository's owner, name, description, and default branch, validates the generated project, and commits the result. It skips this template and forks, uses the built-in `GITHUB_TOKEN`, and removes itself afterward. Actions must be enabled and repository rules must allow its commit. A private upstream template also requires credentials that can read it; use local Copier generation when those are unavailable.

Generated projects contain application code and `.copier-answers.yml`; Copier configuration, Jinja source files, template tests, and setup workflows are excluded. Keep the answers file committed for updates. Defaults derive mobile IDs from the GitHub owner and repository; review them before publishing an app.

To work on the template itself, run `bun install` and `bun run test:template`. The plain files keep it runnable; neighboring `.jinja` files render only identity-dependent values and reuse the plain files where possible. Release Git tags when you want consumers to update to a stable version.

<!-- template:end -->

Clone the repository and install dependencies:

```bash
bun install
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
bun run db:push
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
From `apps/native`, run the `ios` script for iOS or the `android` script for Android to build and launch the app. See [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/) for device setup.
The API is running at [http://localhost:3000](http://localhost:3000).

## UI Customization

The web app imports HeroUI v3 components directly from `@heroui/react`:

```tsx
import { Button, Input, Label, TextField } from "@heroui/react";
```

- Customize web global styles and HeroUI theme tokens in `apps/web/src/index.css`. Tailwind CSS is imported before `@heroui/styles`.
- Compose app-specific components in `apps/web/src/components`; there is no shared UI wrapper package.
- Use HeroUI's `TextField`, `Label`, `Input`, and `FieldError` for accessible forms, and `Toast.Provider` with `toast` for notifications.
- The web app uses a dark theme via the root element's `class` and `data-theme` attributes.
- The native app uses `heroui-native`, with styles in `apps/native/global.css`.
- The documentation app uses Fumadocs' standard UI package and owns its styles in `apps/fumadocs/src/styles/app.css`.
- Official HeroUI skills live in `.agents/skills/heroui-react` and `.agents/skills/heroui-native`. They include component documentation tools and platform-specific implementation guidance.

## Project Identity

`packages/config/project.json` is the shared source for:

- Display name and description used by the web app, documentation, and authentication
- GitHub owner, repository, and documentation source branch
- Native URL scheme, iOS bundle identifier, and Android package

The web and docs import it from `@repo/config/project.json`. Expo's `apps/native/app.config.ts` combines it with platform settings in `app.json`; the native screen reads the resolved Expo name. The API callback and Better Auth trusted origin read the same scheme.

Use Copier updates to change identity answers and keep metadata, the root package name, Docker project name, and docs in sync. You can configure different iOS and Android identifiers in the metadata file. Changes to native schemes or app identifiers require a new native build.

Internal packages use stable `@repo/api`, `@repo/auth`, `@repo/db`, and `@repo/config` names, so repository renaming never requires changing source imports.

The apps start with a minimal home and account flow. Authentication, subscriptions, and shared backend packages are ready to extend with your own features.

## Update from the Template

After generating a project, initialize Git if needed and commit your application files, including `.copier-answers.yml`. With a clean working tree, run:

```bash
uvx --from copier==9.19.1 copier update --trust --defaults --vcs-ref=HEAD
```

This uses the recorded template source and previous answers. Omit `--vcs-ref=HEAD` to use the latest release tag instead. To change an identity answer, add an option such as `--data project_name="My New App"`. Do not edit `.copier-answers.yml` manually. Review the diff, resolve any merge conflicts, and run `bun run check` and `bun run build` before committing the update. Copier is a development tool; application builds and runtime only need the existing Bun/Node toolchain.

## Environment Configuration

Each app owns its environment schema in `.env.schema`. Varlock generates `src/env.ts` during installation; run `bun run env:generate` after changing a schema. Commit schemas, and keep secrets in ignored env files or your deployment platform.

Import the generated `ENV` accessor in application code. Shared database and auth packages receive configuration or initialized clients from the application. See [Varlock's monorepo guide](https://varlock.dev/guides/monorepos/).

Bun's automatic env loading is disabled in `bunfig.toml`; the framework integration or server bootstrap loads Varlock. Node deployments must include Varlock and its dependencies alongside the app schema.

Run standalone Node/Bun tools that use Varlock from the owning app directory so they load that app's schema and env files. `env:generate` only generates TypeScript files; it does not initialize environment values in a subsequent command.

## Deployment

### Docker Compose

- Target: web + server
- Config: `docker-compose.yml` (app Dockerfiles live in `apps/*/Dockerfile`)
- Build images: bun run docker:build
- Start: bun run docker:up
- Logs: bun run docker:logs
- Stop: bun run docker:down

Environment variables are read from each app's `.env` file (baked into web builds for public variables) and overridden in `docker-compose.yml` for container networking.

## Git Hooks and Formatting

- Run checks: `bun run check`
- Workspace type checks run first to generate the web route tree and shared package declarations before type-aware linting. This lets checks run from a fresh checkout without a running dev server.
- Pre-commit runs `bun vp staged`, which applies Vite+ formatting and lint fixes to staged files.
- GitHub Actions runs tests, then runs `bun run check` and `bun run build` as separate jobs on pull requests, pushes to the default branch, and manual runs. CI reuses the pre-commit Vite+ configuration, checks the entire repository without applying fixes, and checks workspace TypeScript types.
- CI uses the Bun version from `package.json`, installs with `--frozen-lockfile`, and provides a local placeholder for `VITE_SERVER_URL`. No repository secrets or running database are required.

<!-- template:start -->

The Template workflow tests Copier rendering, validation, exclusions, and updates. The initialization workflow checks and builds the generated project before committing because pushes made with `GITHUB_TOKEN` do not start another CI run.

<!-- template:end -->

## Project Structure

```
full-stack-template/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Start)
│   ├── native/      # Mobile application (React Native, Expo)
│   ├── server/      # Backend API (Hono, ORPC)
│   └── fumadocs/    # Documentation (Fumadocs)
├── packages/
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   ├── db/          # Database schema & queries
│   └── config/      # Shared project metadata and TypeScript configuration
```

## Available Scripts

<!-- template:start -->

- `bun run test:template`: Test Copier rendering and updates with isolated Git repositories (requires uv)

<!-- template:end -->

- `bun run test`: Run application tests; succeeds with no tests until you add them
- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run dev:server`: Start only the server
- `bun run check-types`: Check TypeScript types across all apps
- `bun run dev:native`: Start the React Native/Expo development server
- `bun run db:push`: Push schema changes to database
- `bun run db:generate`: Generate database client/types
- `bun run db:migrate`: Run database migrations
- `bun run db:studio`: Open database studio UI
- `bun run check`: Run Vite+ format/lint checks and workspace TypeScript checks
- `bun run lint`: Run Vite+ lint checks
- `bun run format`: Run Vite+ formatting
- `bun run staged`: Apply formatting and lint fixes to staged source files, and formatting fixes to staged JSON, CSS, Markdown/MDX, YAML, and HTML files
- `bun run docker:build`: Build the Docker Compose images
- `bun run docker:up`: Build and start the Docker Compose stack
- `bun run docker:logs`: Tail logs from the Docker Compose stack
- `bun run docker:down`: Stop the Docker Compose stack

## Better Auth Schema Generation

After changing auth plugins or schema options, run `bun run auth:generate` from the project root. The script runs the Better Auth CLI through `varlock run` from the owning app directory, loading the auth instance from `src/services.ts`. Review the schema changes, then use your ORM's migration workflow to apply them.
