# Contributing Guidelines

Thank you for contributing to the **Campus Compass** project. To maintain high code quality, security, and architectural consistency across human team members and AI coding agents, please follow these guidelines.

---

## 1. Core Principles

1. **Documentation First**: No code implementation proceeds without corresponding documentation, schema definitions, or architectural approval.
2. **Respect Domain Ownership**: Coordinate with domain owners (Rifal, Kalya, Erick, Netta) before making structural changes.
3. **Zero Hardcoded Secrets**: Under no circumstance should API keys, database passwords, or personal credentials be checked into Git.
4. **Tenant Isolation**: Always enforce campus-scoped data boundaries via Supabase Row Level Security (RLS).
5. **Clear Separation of Synthetic Data**: Synthetic data used for testing must never contaminate qualitative research or production databases.

---

## 2. Git Branching Model

We follow a structured branch naming convention:

| Branch Prefix | Purpose | Example |
| :--- | :--- | :--- |
| `docs/` | Documentation, ADR updates, and specifications | `docs/add-rls-specifications` |
| `feat/` | New features or functional implementations | `feat/onboarding-wizard` |
| `fix/` | Bug fixes or issue resolutions | `fix/rag-citation-parser` |
| `arch/` | System architecture, infra, or tech stack updates | `arch/supabase-client-config` |
| `db/` | Database migrations, schemas, or RLS policies | `db/create-knowledge-tables` |
| `ui/` | Design system, styling, or visual components | `ui/moodboard-tokens` |

### Branching Rules
- Branch from `main`.
- Keep branch scopes focused on a single responsibility.
- Do not push directly to `main`. All changes must pass through a Pull Request (PR).

---

## 3. Commit Message Standards

We use the **Conventional Commits** specification:

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### Commit Types
- `docs`: Documentation updates, specs, or ADR changes.
- `feat`: A new user-facing or technical feature.
- `fix`: A bug fix.
- `chore`: Maintenance, dependencies, or configuration updates.
- `refactor`: Code refactoring without behavioral changes.
- `test`: Adding or updating test suites or synthetic fixtures.
- `style`: Formatting, white-space, or visual token adjustments.

### Examples
- `docs(database): specify rls policies for knowledge_items table`
- `feat(auth): integrate supabase session provider in nextjs layout`
- `fix(rag): enforce university_id filter in similarity search rpc`
- `chore(repo): initialize directory structure and gitkeep files`

---

## 4. Pull Request (PR) Workflow

1. **Create Branch**: Follow the naming convention above.
2. **Self-Review**: Run local linting, link checking, and verify no secrets are staged.
3. **Open PR**: Fill out the PR template completely:
   - Summary of changes.
   - Related issue or documentation reference.
   - Affected domain owner(s).
   - Security & RLS impact assessment.
4. **Review & Approval**: Obtain sign-off from the domain owner:
   - UI/UX changes: Rifal
   - Frontend/User flow: Kalya
   - AI/Tech stack: Erick
   - Database/Backend: Netta
5. **Merge**: Squash and merge into `main` with a clean conventional commit title.

---

## 5. Documentation Update Protocol

When technical or product decisions evolve:

1. **Update Domain Documents**: Update the relevant schema, contract, or architecture document directly.
2. **Cross-Link**: Ensure all references across `docs/` point to valid markdown files.
3. **Sync AI Context**: Ensure [`AGENTS.md`](AGENTS.md) reflects any updated operational constraints.

---

## 6. Issue & Task Tracking Conventions

Tasks are categorized using labels corresponding to team domains:

- `domain:product` (Owner: Rifal)
- `domain:frontend` (Owner: Kalya)
- `domain:tech-lead` (Owner: Erick)
- `domain:backend-db` (Owner: Netta)
- `type:documentation`
- `type:feature`
- `type:security`
- `status:proposed`
- `status:approved`
- `status:blocked`
