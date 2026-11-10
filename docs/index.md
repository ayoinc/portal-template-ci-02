# sample-orders-api

REST API for the sample team's orders

## Overview

| Setting     | Value                                                                               |
| ----------- | ----------------------------------------------------------------------------------- |
| Service     | `sample-orders-api`                                                                |
| Owner       | `group:default/platform-team`                                                               |
| Environment | `development`                                                         |
| Framework   | Express 4, TypeScript |
| Port        | `3000`                                                                |
| Node.js     | 22 (see `.nvmrc`)                                                                   |
| Repository  | <https://github.com/example-org/sample-orders-api> |

## Project structure

```
sample-orders-api/
├── .github/workflows/
│   ├── nodejs.yaml           # Lint, type check, tests, build
│   └── docker.yaml           # Image build, smoke test and publish
├── docs/
│   ├── index.md              # This page
│   └── openapi.yaml          # OpenAPI 3 description of the endpoints
├── src/
│   ├── app.ts                # Application: middleware, routes, error handling
│   ├── config.ts             # Settings read from the environment
│   ├── index.ts              # Entry point: starts the server
│   ├── logger.ts             # Pino logger
│   └── routes/
│       ├── api.ts            # /api
│       └── health.ts         # /health
├── tests/
│   └── api.test.ts           # Vitest tests of every endpoint
├── Dockerfile
├── k8s/                      # Deployment and Service
├── catalog-info.yaml         # Backstage catalog entry
└── mkdocs.yml                # TechDocs configuration
```

## Local development

Requires Node.js 22 and npm.

```bash
git clone https://github.com/example-org/sample-orders-api.git
cd sample-orders-api
npm install
npm run dev
```

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api
```

| Command                 | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| `npm run dev`           | Server with restart on change               |
| `npm run build`         | Compile TypeScript to `dist/`               |
| `npm run start`         | Run the compiled server                     |
| `npm run lint`          | ESLint                                      |
| `npm run format`        | Format with Prettier                        |
| `npm run typecheck`     | Type-check sources and tests                |
| `npm test`              | Vitest                                      |
| `npm run test:coverage` | Vitest with coverage (70% thresholds)       |

## Endpoints

| Method | Path            | Response                                              |
| ------ | --------------- | ----------------------------------------------------- |
| GET    | `/health`       | `status`, `timestamp`, `service`, `environment`       |
| GET    | `/health/ready` | `{ "ready": true }`                                   |
| GET    | `/health/live`  | `{ "alive": true }`                                   |
| GET    | `/api`          | `message`, `version`                                  |
| GET    | `/api/example`  | `{ "data": "Example endpoint" }`                      |

Unknown routes return `404` with `{ "error": "Not Found" }`. Unhandled errors
return `500` with `{ "error": "Internal Server Error" }` and are logged.

Add routes in `src/routes/` and describe them in `docs/openapi.yaml`.

## Configuration

| Variable    | Default                     | Purpose                                 |
| ----------- | --------------------------- | --------------------------------------- |
| `PORT`      | `3000`        | Port the server listens on              |
| `APP_ENV`   | `development` | Environment name reported by `/health`  |
| `LOG_LEVEL` | `info`                      | Pino log level                          |

Copy `.env.example` to `.env` for local overrides; `.env` is ignored by Git.

## Continuous integration

`.github/workflows/nodejs.yaml` runs on every push and pull request to `main`:

| Job             | What it does                                                    |
| --------------- | --------------------------------------------------------------- |
| Lint            | ESLint, Prettier and the TypeScript type check                  |
| Test            | Vitest with coverage                                            |
| Build           | Compiles, starts the server and calls `/health`                 |
| Dependency scan | Trivy report of known vulnerabilities in `package-lock.json`    |

The dependency scan reports and does not fail the build. In a public
repository its results also appear in the repository's Security tab.

`.github/workflows/docker.yaml` runs on the same events:

| Job   | What it does                                                            |
| ----- | ----------------------------------------------------------------------- |
| Lint  | Hadolint on the `Dockerfile`, kubeconform on `k8s/`                     |
| Image | Builds the image, starts it, calls `/health`, scans it with Trivy       |

On pushes to `main` the image is published to the GitHub Container Registry
with the workflow's own token; no secret has to be configured.

## Docker

```bash
docker build -t sample-orders-api .
docker run --rm -p 3000:3000 sample-orders-api
```

Published images:

```
ghcr.io/example-org/sample-orders-api:latest
ghcr.io/example-org/sample-orders-api:sha-<commit>
```

## Kubernetes

`k8s/` contains a Deployment (two replicas, probes on `/health/live` and
`/health/ready`) and a ClusterIP Service on port 80.

```bash
kubectl apply -f k8s/
```

The package is private by default. Either make it public in the package
settings or add an image pull secret to the Deployment.

## References

- [Node.js documentation](https://nodejs.org/docs/)
- [Express](https://expressjs.com/)
- [Fastify](https://fastify.dev/docs/latest/)
- [Vitest](https://vitest.dev/)
