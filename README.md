# Mazharul Hossain — Personal Portfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/3b24fe33-de72-4b5d-8129-3b8005b34d4b/deploy-status)](https://app.netlify.com/sites/stoic-lamport-e2ed9d/deploys)

This repository contains the Angular application for [hmazharul.com](https://www.hmazharul.com/), Mazharul Hossain's personal research and professional portfolio. The site presents research publications, selected work, technical experience, writing, and contact information in a responsive, server-rendered interface.

The application is built with Angular 22 and deployed through Netlify's connected CI/CD workflow. The production build supports server-side rendering, hydration, prerendered routes, and service-worker registration.

## Run and Test Locally

### Prerequisites

- Node.js compatible with Angular 22; Node 24.15 or newer is recommended.
- npm, included with Node.js.
- Chrome or Chromium for Karma's headless unit tests.

Install the locked dependency tree:

```bash
npm ci
```

Start the development server:

```bash
npm start
```

Open `http://localhost:4200`. Angular rebuilds and reloads the application when source files change.

### Verification Commands

```bash
npm run build
```

Creates the optimized browser and SSR bundles in `dist/my-app/` and prerenders configured routes. This is the primary release check.

```bash
npm test -- --watch=false --progress=false
```

Runs the Jasmine/Karma unit suite once in the CI-safe headless Chrome launcher.

```bash
npm run cypress:run
```

Runs Cypress smoke tests. Start the application with `npm start` in another terminal first. Use `npm run cypress:open` for interactive test development.

```bash
npm run watch
```

Continuously rebuilds using the development configuration without starting the dev server.

Before requesting review, run the production build, unit tests, and Cypress suite. Do not commit `dist/`, coverage output, Cypress screenshots/videos, or `node_modules/`.

## Project Structure

```text
src/app/                 Angular components, routing, services, and specs
src/app/publications/    Homepage selection and lazy-loaded full bibliography
src/assets/              Images, fonts, documents, CSS, and legacy scripts
src/server.ts            Angular SSR and Netlify `/feed` request handling
cypress/e2e/             Browser-level smoke tests
docs/                    Redesign and optimization plans
```

## Angular Engineering Demonstrated

This portfolio is also a practical Angular showcase. It demonstrates:

- Angular 22 NgModule architecture with strict TypeScript 6 compilation.
- SSR, client hydration, event replay, and route prerendering.
- Lazy-loaded feature routing for the complete publications page.
- Data-driven templates using Angular control-flow syntax such as `@for`.
- SSR-safe browser access through an injectable `WindowRef` abstraction.
- Explicit change-detection strategies and lifecycle-driven UI behavior.
- Responsive, component-scoped styling alongside an established global theme.
- A custom Netlify-compatible server handler for the Medium RSS feed.
- PWA support through Angular's service worker and web manifest.
- Unit testing with Jasmine/Karma and browser regression testing with Cypress.
- Production budgets, optimized output hashing, and separate development/production configurations.

## Deployment

Netlify owns the deployment configuration and CI/CD connection outside this repository.

## Further Work

The implementation roadmap is documented in:

- [`docs/HOMEPAGE_REDESIGN_PLAN.md`](docs/HOMEPAGE_REDESIGN_PLAN.md)
- [`docs/BUNDLE_OPTIMIZATION_PLAN.md`](docs/BUNDLE_OPTIMIZATION_PLAN.md)
