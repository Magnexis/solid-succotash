# Deployment guide

Run `npm run build` and deploy `frontend/dist/` to a static host. Configure SPA fallback to `index.html`.

For the production API, deploy Express behind HTTPS, provision PostgreSQL, apply Prisma migrations during release, configure Google OAuth, use object storage for uploads, and restrict allowed frontend origins.
