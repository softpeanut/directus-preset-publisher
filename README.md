# Directus Preset Publisher

A small, reproducible content-operations example: editors manage marketplace image-export presets in Directus, while a build step exports a validated, deterministic JSON file for a browser image tool. Product images never enter Directus; only non-sensitive configuration metadata does.

Long-form implementation note: [`article.html`](article.html)

## Why this exists

Hard-coded image sizes are easy to ship and easy to forget. Moving the preset metadata into Directus gives content operators an editable collection while keeping the browser tool's image pipeline local-only. The export step is deliberately strict: invalid dimensions, modes, colors, duplicate slugs, and an empty active set stop the build instead of publishing ambiguous configuration.

## Local run

Requirements: Node.js 22 and no external account. The repository pins the tested major in `.nvmrc` because the current native dependency chain does not install on Node.js 26.

```sh
npm install
cp .env.example .env
# Replace the local-only SECRET and ADMIN_PASSWORD values.
npm run directus:bootstrap
npm run directus:start
```

In another shell with the same environment:

```sh
npm run seed
npm run export
npm test
```

The `seed` and `export` scripts load `.env` explicitly with Node's `--env-file` flag. Directus also reads the same file, so the CLI and SDK scripts use one local configuration without shell-specific exports.

The export command creates `dist/presets.json` only when the destination does not already exist. This avoids silently overwriting a previously reviewed artifact.

## Scope and limits

- This is a local development example, not a hosted Directus service.
- It does not upload or store product images.
- Admin credentials are required only for schema setup and the build-time export.
- The sample does not configure public collection permissions.
- Marketplace preset sizes are examples, not compliance certification; current platform rules still need independent review.

## Versions

- Directus 12.3.1
- `@directus/sdk` 25.0.1
- SQLite for the local instance

Directus versioning and self-hosting instructions change over time. This repository pins versions and the tested Node.js major so the demonstrated workflow remains reproducible.
