# Architecture

The repository uses npm workspaces:

- `frontend/` is a Vite single-page application with page-level route modules, reusable components, and a thin API client.
- `backend/` is an Express TypeScript service with health and prediction endpoints.
- `shared/` is the tested prediction-engine package used by both the API and frontend offline fallback.

The browser calls the API through the Vite development proxy. A local deterministic fallback keeps frontend-only development useful without duplicating prediction rules. Browser storage persists the latest plan.

For production, add PostgreSQL and Prisma behind the Express API. Keep species configuration separate from search observations so future dog, bird, rabbit, ferret, and reptile models can reuse the search workflow.
