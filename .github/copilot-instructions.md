---
name: Workspace Copilot Instructions
description: "Guidance for the AI assistant when working in this JewelryApp monorepo. Use when editing frontend UI, backend API, DB migrations, or build/config files."
applyTo:
  - "JewelryApp.UI/**"
  - "JewerlyApp/**"
---

Purpose
-------

This file gives the AI assistant a concise discovery checklist and conventions for the JewelryApp repository so suggestions and edits are consistent and minimal-risk.

Quick discovery
---------------
- Frontend UI: [JewelryApp.UI](JewelryApp.UI) — React + Vite + TypeScript
- Backend API & services: [JewerlyApp](JewerlyApp) — .NET solution and multiple projects
- Database and migrations: [JewerlyApp.Infrastructure/Migrations](JewerlyApp.Infrastructure/Migrations)
- Top-level README: [README.md](README.md)

Conventions
-----------
- Keep changes minimal and focused to the relevant project (frontend vs backend).  
- Follow existing coding style in each subproject (TSX/SCSS patterns in `JewelryApp.UI`, C# conventions in `JewerlyApp`).
- Avoid global refactors without explicit user approval.

Recommended workflow for the assistant
--------------------------------------
1. Search for existing docs or files before adding new ones (README.md, CODEOWNERS, existing modules).  
2. When proposing code changes, include precise file edits and small tests where possible.  
3. Prefer adding links to documentation rather than embedding long docs (`Link, don't embed`).

Where to add agent customizations
---------------------------------
- Workspace-level instructions and agent artifacts belong under `.github/` (this file).  
- For targeted instructions or prompts, prefer `.github/instructions/`, `.github/prompts/`, or `.github/agents/` and use `applyTo` globs.

Example prompts
---------------
- "Find the API controller that handles product returns and add validation for missing customer ID."  
- "Create a small utility in `JewelryApp.UI/src/utils` to format currency according to store settings."  
- "Where are database migrations stored? List the latest migration files and explain their purpose."

Next steps
----------
- If you want agent behaviors scoped differently, tell me which folders to include or exclude and I will update `applyTo`.  
- I can also add example prompts and a small set of `*.prompt.md` files under `.github/prompts/` if desired.
