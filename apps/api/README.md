# FreshPress API (mock backend)

Flask + SQLite + JWT. Handles auth consistency (validation, duplicate emails,
bad credentials) and serves mock device/recipe data.

## Run

```bash
pnpm api          # from repo root  → http://localhost:5050
# or
cd apps/api && bash run.sh
```

First run creates a `.venv`, installs deps, and creates `freshpress.db`.

## Endpoints

| Method | Path            | Auth     | Notes                              |
| ------ | --------------- | -------- | ---------------------------------- |
| GET    | `/health`       | –        | liveness                           |
| POST   | `/auth/register`| –        | `{name,email,password}` → user+tokens |
| POST   | `/auth/login`   | –        | `{email,password}` → user+tokens   |
| GET    | `/auth/me`      | access   | current user                       |
| POST   | `/auth/refresh` | refresh  | → new access token                 |
| POST   | `/auth/logout`  | access   | stateless ack                      |
| GET    | `/api/device`   | access   | mock smart juicer state            |
| GET    | `/api/recipes`  | access   | mock recipe list                   |

Errors use a consistent envelope: `{ "error", "message", "fields"? }`.
Validation (`422`) returns per-field messages mirroring the client zod schemas.
