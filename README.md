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
| Infra    | Docker Compose (database)                 |

## Repository structure

```
Notes/
├── backend/                  Express API
│   ├── src/
│   │   ├── db.js              Postgres connection pool + table creation
│   │   └── server.js          Express app, routes, startup
│   ├── package.json
│   └── .env.example           template for required env vars
├── frontend/                 React + TypeScript UI (Vite)
│   ├── src/
│   │   ├── api/notes.ts       typed client for the backend API
│   │   ├── components/        NoteForm, NoteList, NoteCard
│   │   ├── types/note.ts
│   │   └── App.tsx
│   ├── package.json
│   └── .env.example
├── docker-compose.yaml       Postgres service (see Known limitations)
└── README.md
```

## API

| Method | Endpoint          | Description        |
|--------|-------------------|---------------------|
| GET    | `/api/notes`       | List all notes, newest first |
| POST   | `/api/notes`       | Create a note (`{ title, description }`, `title` required) |
| DELETE | `/api/notes/:id`   | Delete a note by id |

## How to build and run

> **Current state:** `docker-compose.yaml` starts the PostgreSQL database. The API and UI are run directly with Node/npm for now — see [Known limitations](#known-limitations--next-steps) for the plan to bring them into Compose as well.

### 1. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL 16 in a container named `notes-postgres`, with a persistent named volume (`notes_data`) so data survives restarts. It listens on `localhost:5432` with the credentials defined in `docker-compose.yaml`.

### 2. Configure and start the backend

```bash
cd backend
cp .env.example .env   # defaults already match docker-compose.yaml
npm install
npm start               # or: npm run dev (auto-restarts on change)
```

The backend runs on **http://localhost:3001**. On startup it creates the `notes` table automatically if it doesn't exist (`CREATE TABLE IF NOT EXISTS`) — no separate migration step is needed.

### 3. Configure and start the frontend

```bash
cd frontend
cp .env.example .env   # points the UI at http://localhost:3001/api
npm install
npm run dev
```

The UI runs on **http://localhost:5173**.

### 4. Use it

Open **http://localhost:5173** in a browser. Creating/deleting notes there calls the API at **http://localhost:3001/api/notes**, which reads/writes the `notes` table in Postgres.

## Assumptions and technical decisions

- **No ORM.** The `pg` package is used directly with parameterized queries. The schema is a single table with no relations, so an ORM would add complexity without benefit.
- **No authentication.** Out of scope for this exercise — the app assumes a single trusted user.
- **Table creation is handled by the app, not a migration tool.** `db.js` runs `CREATE TABLE IF NOT EXISTS notes (...)` once at startup. This keeps setup to a single command, at the cost of not having a migration history — acceptable for a one-table schema at this scope.
- **CORS is fully open** on the backend (`cors()` with no options), since this only ever runs locally for this exercise.
- **`DELETE` returns `204 No Content`** rather than a body, and `POST` returns the full created note (including the DB-generated `id`/`created_at`) so the frontend never has to guess those values.
- **The frontend runs via the Vite dev server**, not a production build served by a static server. For an exercise of this scope, `vite dev` is simpler and gives the same result a reviewer needs to see; `npm run build` does produce a working production bundle (verified), it's just not wired into how the app is started yet.

## Known limitations / next steps

- **`docker compose up --build` does not yet start the whole application.** Only the database is containerized. Adding `Dockerfile`s for `backend` and `frontend`, plus corresponding services in `docker-compose.yaml`, so the entire stack starts with one command and no manual `npm install` — is the top priority next step.
- **No automated test suite.** The API and the create/view/delete flow were verified manually and via scripted smoke tests during development, but there's no `npm test` a reviewer can run.
- **No editing of existing notes**, only create/delete, per the exercise scope.
- **Minimal validation**: the backend only checks that `title` is non-empty; there's no length limit enforced beyond the database column's `VARCHAR(255)`, and the frontend does no additional validation beyond trimming whitespace.
- **A couple of unused leftover files from initial scaffolding** (`.js` duplicates of a few `.tsx`/`.ts` files in `frontend/src/`) are still in the repo and should be removed — they aren't part of the actual build (`index.html` loads `main.tsx`).
- **`docker-compose.yaml` credentials are development defaults**, not meant for anything beyond local use.
