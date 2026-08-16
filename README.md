# Notes App

A small full-stack notes application: create, view, and delete notes backed by PostgreSQL.

## What it does

- View all notes
- Create a note (title required, description optional)
- Delete a note

Each note has an `id`, `title`, `description`, and `created_at` timestamp.

## Technology

| Layer    | Choice                                   |
|----------|-------------------------------------------|
| Database | PostgreSQL 16                             |
| API      | Node.js + Express, using `pg` directly (no ORM) |
| UI       | React + TypeScript (Vite)                 |
| Infra    | Docker Compose (db + backend + frontend)  |

## Repository structure

```
Notes/
├── backend/                  Express API
│   ├── src/
│   │   ├── db.js              Postgres connection pool + table creation
│   │   └── server.js          Express app, routes, startup
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example           template for local (non-Docker) runs
├── frontend/                 React + TypeScript UI (Vite)
│   ├── src/
│   │   ├── api/notes.ts       typed client for the backend API
│   │   ├── components/        NoteForm, NoteList, NoteCard
│   │   ├── types/note.ts
│   │   └── App.tsx
│   ├── Dockerfile             multi-stage: vite build → nginx
│   ├── package.json
│   └── .env.example           template for local (non-Docker) runs
├── docker-compose.yaml       db + backend + frontend services
└── README.md
```

## API

| Method | Endpoint          | Description        |
|--------|-------------------|---------------------|
| GET    | `/api/notes`       | List all notes, newest first |
| POST   | `/api/notes`       | Create a note (`{ title, description }`, `title` required) |
| DELETE | `/api/notes/:id`   | Delete a note by id |

## How to build and run

### With Docker Compose (recommended — this is what a reviewer should use)

```bash
git clone <repository>
cd Notes
docker compose up --build
```

That's it — no `npm install`, no manual `.env` setup. This builds and starts three containers:

- **`db`** — PostgreSQL 16, with a persistent named volume (`notes_data`) so data survives restarts.
- **`backend`** — the Express API, built from `backend/Dockerfile`. It waits for `db` to report healthy (via a Compose healthcheck) before starting, and creates the `notes` table automatically on boot if it doesn't exist.
- **`frontend`** — a multi-stage build: compiles the React app with Vite, then serves the static output with nginx.

Once it's up:

- **UI** → http://localhost:5173
- **API** → http://localhost:3001/api/notes

Stop everything with `docker compose down` (add `-v` to also delete the database volume).

### Without Docker (local development)

Each service can also be run directly for faster local iteration:

```bash
# 1. Start just the database
docker compose up -d db

# 2. Backend
cd backend
cp .env.example .env   # defaults already match docker-compose.yaml
npm install
npm run dev              # auto-restarts on change

# 3. Frontend (in a second terminal)
cd frontend
cp .env.example .env   # points the UI at http://localhost:3001/api
npm install
npm run dev
```

Same URLs as above: UI on **http://localhost:5173**, API on **http://localhost:3001**.

## Assumptions and technical decisions

- **No ORM.** The `pg` package is used directly with parameterized queries. The schema is a single table with no relations, so an ORM would add complexity without benefit.
- **No authentication.** Out of scope for this exercise — the app assumes a single trusted user.
- **Table creation is handled by the app, not a migration tool.** `db.js` runs `CREATE TABLE IF NOT EXISTS notes (...)` once at startup. This keeps setup to a single command, at the cost of not having a migration history — acceptable for a one-table schema at this scope.
- **CORS is fully open** on the backend (`cors()` with no options), since this only ever runs locally for this exercise.
- **`DELETE` returns `204 No Content`** rather than a body, and `POST` returns the full created note (including the DB-generated `id`/`created_at`) so the frontend never has to guess those values.
- **The frontend is built with Vite and served as a static bundle by nginx** inside its container (a standard two-stage Docker build), rather than running the Vite dev server in production.
- **`VITE_API_URL` is baked in at Docker build time** (as a build arg), since Vite inlines `import.meta.env` values into the bundle at build time, not at container runtime. It's set to `http://localhost:3001/api` because the API call happens in the user's browser, which reaches the backend via its published host port — not through the internal Compose network.
- **The backend waits for Postgres to be healthy**, not just "started," before accepting traffic. Compose's `depends_on: condition: service_healthy` (backed by a `pg_isready` healthcheck on `db`) avoids a race where the backend tries to connect before Postgres is actually ready.

## Known limitations / next steps

- **No automated test suite.** The API and the create/view/delete flow were verified manually — full create → reload → delete → reload cycles driven through the actual UI in a browser, plus direct `psql` checks — but there's no `npm test` a reviewer can run.
- **No editing of existing notes**, only create/delete, per the exercise scope.
- **Minimal validation**: the backend only checks that `title` is non-empty; there's no length limit enforced beyond the database column's `VARCHAR(255)`, and the frontend does no additional validation beyond trimming whitespace.
- **A couple of unused leftover files from initial scaffolding** (`.js` duplicates of a few `.tsx`/`.ts` files in `frontend/src/`) are still in the repo and should be removed — they aren't part of the actual build (`index.html` loads `main.tsx`).
- **`docker-compose.yaml` credentials are development defaults**, not meant for anything beyond local use.
- **No HTTPS/reverse proxy in front of the containers** — each service's port is published directly to the host, which is fine for local/reviewer use but not how this would be deployed.
