# Repository Guidelines

## Project Structure & Module Organization

This is an Angular 21 server-rendered portfolio. Application code lives in `src/app/`; features such as `about-me/`, `publications/`, and `works/` contain component TypeScript, HTML, CSS, and unit specs. Shared services and browser abstractions belong in `src/app/gtag/` and `src/app/shared/`. Entry points are `src/main.ts`, `src/main.server.ts`, and `src/server.ts`. Static files are under `src/assets/`; Cypress files live in `cypress/`. Do not commit generated `dist/` output or `node_modules/`.

## Build, Test, and Development Commands

- `npm ci` installs the exact dependency versions from `package-lock.json`.
- `npm start` serves the development build at `http://localhost:4200` with reloads.
- `npm run build` creates the production browser and SSR output in `dist/my-app/`.
- `npm run watch` rebuilds continuously using the development configuration.
- `npm test` runs Jasmine component tests through Karma and Chrome.
- `npm run cypress:open` opens the interactive Cypress runner.
- `npm run cypress:run` executes Cypress tests headlessly; start the app first when needed.
- `npm run serve:ssr:my-app` serves an already-built SSR bundle.

## Coding Style & Naming Conventions

Follow `.editorconfig`: UTF-8, four-space indentation, final newlines, trimmed trailing whitespace, and double quotes in TypeScript. Use Angular naming conventions: kebab-case feature directories and files (`page-not-found.component.ts`), PascalCase classes, and camelCase members. Keep templates and styles beside their components. Prettier is configured to use the Angular parser for HTML; avoid unrelated formatting churn. There is currently no lint script, so treat a clean TypeScript build as the baseline static check.

## Testing Guidelines

Place unit tests beside implementation files as `*.component.spec.ts`; use Jasmine/Karma for component behavior. Put browser journeys in `cypress/e2e/*.cy.ts`, with reusable commands in `cypress/support/`. Test changed routes, rendered content, and browser interactions. No numeric coverage threshold is configured; preserve meaningful coverage and run relevant suites before review.

## Commit & Pull Request Guidelines

Recent history favors brief, change-focused subjects such as `Updated ReadMe` and `Upgraded to 21.0.3`; use a concise imperative subject and keep each commit scoped to one concern. Pull requests should explain the motivation and implementation, list verification commands, and link related issues. Include before/after screenshots for visible portfolio changes and call out SSR, Netlify, dependency, or configuration impacts.

## Security & Configuration

Keep environment-specific values in `src/environments/` and never commit credentials or tokens. Review `netlify.toml`, `ngsw-config.json`, and production bundle budgets when changing deployment, caching, or large assets.
