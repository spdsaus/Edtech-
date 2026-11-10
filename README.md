# NexGen Teacher

NexGen Teacher is a browser-based prototype of a teacher workspace focused on lesson planning, class administration, task organization, and parent-communication drafts for South African school contexts.

## Prototype status

This repository contains a prototype for feedback and product validation. It is **not a production school-management system**.

- Records are stored in the current browser using local storage. They do not sync to a server or between devices.
- Communication features prepare or simulate drafts. They do not send WhatsApp, SMS, or email messages.
- Do not enter real learner, guardian, medical, or other sensitive personal information into this prototype.
- Do not rely on it for official school records, consent evidence, legal compliance, or curriculum approval.

## Run locally

Requirements: Node.js 22 and npm.

```bash
npm install
npm run lint
npm run build
npm run dev
```

Vite serves the app locally at the address printed by the dev server (normally http://localhost:3000).

## GitHub Pages

The Pages build uses the project-site base path `/Edtech-/`. Local development keeps the normal `/` base path.

The deployment workflow:
1. Runs on pushes to `main` or manual dispatch.
2. Installs dependencies and runs the TypeScript check.
3. Builds the static site with `GITHUB_PAGES=true`.
4. Deploys the generated `dist` directory using GitHub Pages Actions.

Expected project-site URL:

https://spdsaus.github.io/Edtech-/

Before the first deployment:
- Ensure the repository plan and visibility combination supports GitHub Pages. GitHub Free requires a public repository for Pages; private-repository Pages require an eligible paid plan.
- In **Settings → Pages**, set the build/deployment source to **GitHub Actions**.
- Merge the reviewed branch into `main). The deployment workflow intentionally does not publish pull-request branches.

## Validation

The GitHub Actions validation workflow checks TypeScript and runs a production build on pull requests to `main` and pushes to the cleanup branch or `main`.

A committed `package-lock.json` is still recommended so installs are reproducible. Until it is added, workflows use `npm install` rather than `npm ci`.
