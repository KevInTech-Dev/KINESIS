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

## Import aliases

Use the `@` aliases configured in `tsconfig.json` for imports across backend
areas, for example `@modules/...`, `@database/...`, `@config/...`, and
`@common/...`. The `@/...` alias points to the `src` root. Imports between
backend source files omit file extensions. The build runs `tsc-alias` after
TypeScript to add the `.js` extensions and rewrite aliases for Node.js ESM.

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
Set `JWT_SECRET` to a cryptographically random value of at least 32 bytes; never
reuse the example placeholder or commit a real secret. Access tokens live for
`ACCESS_TOKEN_EXPIRY_TIME` seconds (900 by default); refresh sessions last
`REFRESH_TOKEN_EXPIRY_TIME` seconds (604800 by default).

Authentication lives in `src/modules/authentification`: traveler registration
and login, bcrypt password hashing, validated JWT access tokens,
authentication and role guards, and request schemas. Public registration
creates traveler accounts only; company and agent accounts must be provisioned
through their future authorized workflows.
Login and refresh return the access token in the JSON response and set a
rotating opaque refresh token in an HttpOnly cookie. Logout revokes the current
refresh-token session.

The first migration creates a shared account table and traveler profile; the
next adds refresh sessions, and the latest migration adds company and agent
profiles, then company-owned routes (`Trajet`) and scheduled trip occurrences
(`Voyage`). Each `Voyage` references a `Trajet`; departure and arrival cities
are not duplicated on the voyage. Apply migrations explicitly before starting
the API; the server never alters the database schema automatically. Auth endpoints are
`POST /api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, and
`/api/auth/logout`.

The class diagram's `Utilisateur` is represented by `Account`; traveler,
company, and agent data live in one-to-one `TravelerProfile`,
`CompanyProfile`, and `AgentProfile` models. `AgentProfile` links an agent to
the company profile that employs them. The administrator has an account role
but no separate profile because the diagram defines no additional admin
attributes. Company login email and phone stay on `Account`; `CompanyProfile`
`address` means the company's physical location.

```sh
pnpm install
pnpm db:migrate
pnpm dev
pnpm typecheck
pnpm build
```

The HTTP layer uses Helmet, a request-size limit, CORS allowlisting, and a
process-local rate limiter. If KINESIS is deployed across multiple instances,
the limiter should later use a shared store.
