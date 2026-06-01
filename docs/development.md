# Development guide

Run `npm install` once from the repository root. Use `npm run dev` to start both workspaces and `npm run build` before merging.

UI state currently lives in React and browser storage. The frontend API client falls back to the shared deterministic engine when Express is not running. Add or adjust focused engine tests in `shared/src/index.test.ts` whenever prediction rules change. Preserve keyboard focus states, semantic labels, and responsive layouts.

## Refreshing GitHub previews

The repository includes `agent-browser` as a local development dependency. Start the app, then use the local binary so screenshots reflect the checked-in tool version:

```powershell
.\node_modules\.bin\agent-browser.cmd --session github-preview set viewport 1440 1100
.\node_modules\.bin\agent-browser.cmd --session github-preview open http://localhost:5173/
.\node_modules\.bin\agent-browser.cmd --session github-preview screenshot docs/screenshots/home.png --full
.\node_modules\.bin\agent-browser.cmd --session github-preview close
```

Repeat the `open` and `screenshot` commands for the knowledge center and developer portal. Review every image before committing it. Do not publish screenshots containing names, contact details, precise locations, or saved sighting records.
