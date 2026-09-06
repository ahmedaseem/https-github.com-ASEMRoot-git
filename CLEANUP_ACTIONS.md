# Instructions for the cleanup/organize-files branch

This branch contains small, safe changes to help verify the frontend + backend run together.

What I added on this branch:

- Updated manifest.json to reference the canonical logo at assets/logos/asem-logo.png
- Added a GitHub Actions workflow .github/workflows/e2e.yml which performs an automated end-to-end build & runtime smoke test on push or manual dispatch.

Why this helps:
- The workflow will attempt to start the server implementation found in server.js.before-fix and run basic API checks on port 3000, serve the frontend at port 8080, and run simple connectivity checks.

How to run locally (recommended):
1. Ensure Node 18+ is installed.
2. Install dependencies: npm ci
3. Start the server: node server.js.before-fix
4. Visit the frontend: open index.html in a static server or use npx http-server -p 8080 .
5. Run the health check: curl http://localhost:3000/api/health

If you want me to proceed further and make additional code fixes (e.g., unify backend files, update addProject references, or generate PWA-sized icons), reply with specific permission and I will implement them on this branch and run CI to verify.
