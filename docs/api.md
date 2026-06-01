# CatWoman API documentation

The CatWoman API exposes behavior-informed lost-cat search predictions for integration into external projects. The website developer portal is available at `/developers`.

`POST /api/predictions` accepts profile, behavior, health, environment, hazard, disappearance, and search-history categories. Its output includes a search radius, plan specificity, ranked hiding spots, per-zone points, and plain-language explanations.

Recommended endpoints:

- `GET /api/health`
- `POST /api/predictions`
- `POST /api/sightings/search`
- `GET|POST /api/community-sightings`
- `POST /auth/register`, `POST /auth/login`, `GET /auth/google`
- `GET|POST /animals`, `GET|PATCH /animals/:id`
- `POST /searches`, `GET|PATCH /searches/:id`
- `POST /searches/:id/predict`
- `POST /searches/:id/zones/:zoneId/check`
- `POST /searches/:id/sightings`
- `POST /searches/:id/flyers`
- `POST /searches/:id/recovery`

All search endpoints require ownership checks. Return typed JSON errors with a user-safe message and request ID.

The three `/api` endpoints are implemented. The remaining routes describe the production persistence and account layer.

## Community sighting posts

`POST /api/community-sightings` publishes a first-party sighting or search update with a status, description, location label, coordinates, and optional reporter details. Verification fields include direction of travel, confidence, photo URL, whether the cat was approached, and whether the cat may be injured. `GET /api/community-sightings` lists posts and optionally filters them by `latitude`, `longitude`, and `radiusMiles`. Local development stores posts in `data/community-sightings.json`; production should move this to PostgreSQL with moderation and rate limiting.

`GET /api/community-sightings/history` returns the durable chronological archive, summary counts, and optional `type`, `status`, and `query` filters.

## Nearby public sightings

`POST /api/sightings/search` accepts `latitude`, `longitude`, `radiusMiles` up to `25`, and `sinceHours` up to `720`. It searches server-configured public sources, normalizes cat reports, filters by distance and age, removes duplicates, and returns source attribution.

Configure allowlisted sources with `CATWOMAN_SIGHTING_SOURCES`. Supported source kinds are `json` for structured feeds and `jsonld` for public pages containing structured JSON-LD metadata. URL templates may use `{latitude}`, `{longitude}`, `{radiusMiles}`, and `{sinceHours}`. Only add sources whose terms permit aggregation. The API does not crawl private groups or arbitrary websites.
