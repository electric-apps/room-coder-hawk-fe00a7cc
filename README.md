# Todo App

A real-time, reactive todo application powered by Electric SQL. Changes sync instantly across all connected clients.

## Features

- Add todos with a text input
- Mark todos as complete/incomplete with a checkbox
- Delete todos with a single click
- Real-time sync — changes appear instantly across all browser tabs and devices
- Optimistic updates for a snappy, responsive feel

## How to Run

```bash
pnpm install
pnpm dev:start
```

The app will be available at `http://localhost:8080`.

## Tech Stack

- **Electric SQL** — Postgres-to-client real-time sync via shapes
- **TanStack DB** — Reactive collections, live queries, and optimistic mutations
- **Drizzle ORM** — Type-safe schema definitions and migrations
- **TanStack Start** — React meta-framework with SSR and server functions
- **Radix UI Themes** — Accessible, themeable component library
- **Vite** — Fast development server and build tool

## License

MIT
