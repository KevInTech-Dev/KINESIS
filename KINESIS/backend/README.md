# KINESIS Backend

## Architecture

The backend is organized by feature under `src/modules`. Each feature can contain
its routes, controller, service, repository, Sequelize model, Zod schema, types,
and focused tests. Cross-feature code belongs under `src/common`; environment,
database, logger, and OpenAPI setup belong under `src/config`.

Keep HTTP concerns in routes/controllers and business rules in services.
Repositories own database access. Do not add generic repository behavior that
cannot be implemented correctly for every model; feature repositories should
override persistence methods when their requirements differ.

## Shared HTTP behavior

- Use `validate` from `src/common/middleware/validate.middleware.ts` for request
  body, path parameters, and query validation. Zod's parsed output is passed to
  the controller.
- Throw an `AppError` (or one of its subclasses) for expected application
  failures. The global error handler returns the common `{ success, error }`
  response and hides unexpected internal error details from clients.
- Use the helpers in `src/common/api.response.ts` for success and pagination
  responses.
- Add route OpenAPI annotations in the feature module; Swagger UI is available
  at `/api-docs`, with the generated document at `/api-docs.json`.

## Local development

Copy `.env.example` to `.env` and set the local database credentials. Configure
`CORS_ORIGINS` as a comma-separated allowlist for the frontend origins.

```sh
pnpm install
pnpm dev
pnpm typecheck
pnpm build
```

The HTTP layer uses Helmet, a request-size limit, CORS allowlisting, and a
process-local rate limiter. If KINESIS is deployed across multiple instances,
the limiter should later use a shared store.
