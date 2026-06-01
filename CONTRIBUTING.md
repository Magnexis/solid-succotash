# Contributing

Thanks for helping make wheredidmycatgo? more useful during a stressful moment.

## Setup

1. Fork the repository and create a focused branch.
2. Run `npm install`.
3. Copy `.env.example` to `.env` when you need backend configuration.
4. Start the app with `npm run dev`.

## Before opening a pull request

Run:

```bash
npm test
npm run build
```

Keep UI changes accessible, mobile-first, and calm in tone. Include tests for prediction rules and backend behavior changes. Document new API endpoints in `docs/api.md` and explain prediction rule changes in `docs/prediction-engine.md`.

Do not commit personal search data, runtime sighting records, `.env` files, dependencies, or build output.
