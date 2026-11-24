# Rules for coding agents

These rules are for AI coding agents (Claude Code, Codex, Copilot, opencode, ...) working on bitsandbricks.ch.
Humans: the same rules apply to you in spirit. `CLAUDE.md` imports this file.

This repo follows the [BitsAndBricks handbook](https://github.com/bitsandbricks-ch/handbook),
profile **static-site** (see `.mason.toml`). Read its core chapters and the blocks this profile
lists. The rules below are only what is specific to this repo.

## What this is

The BitsAndBricks website: Mike's projects, the blog, the knowledge base and courses, built with Astro and published as static files on GitHub Pages. The [README](README.md) says where things are and how to run it.

## Before you push

Run what CI runs (`.github/workflows/pages.yml`) and make it pass:

- `npm ci`
- `npm test`
- `npm run build` (checks content, builds, indexes search and checks every internal link)
- `npm run test:e2e` (after the build; needs `npx playwright install chromium` once)

## Differs from the handbook

- **No pre-commit hooks yet**: there is no `.pre-commit-config.yaml` ([decision 0010](https://github.com/bitsandbricks-ch/handbook/blob/main/decisions/0010-pre-commit.md)), so skip `pre-commit run --all-files` until it lands.

## Repo-specific rules

- Work from an issue: open one if there is none, comment when you start and when blocked, link it from the PR.
- Commits and PR titles follow Conventional Commits, with these scopes: `blog`, `kb`, `courses`, `pages`, `tools`, `ci`.
- **Publishing:** every merge to `main` deploys the site. Nothing goes live except through a merged pull request.
- **No releases:** the site has no version and no changelog
  ([decision 0012](https://github.com/bitsandbricks-ch/handbook/blob/main/decisions/0012-no-changelog-without-releases.md));
  the merged pull requests are its history.
- **No cookies, no tracking, no outside requests** (comments load only when a reader clicks). Keep it that way.
- **Content:** never publish notes that contain passwords, tokens, private IPs or shell history.
  The build's safety check (`tools/lib/safety.mjs`) stops on them; never weaken it to get a note through.
- Use the colour tokens at the top of `public/assets/site.css`, not raw colours.
- Stay inside the repository. Ask before deleting files you didn't create.
