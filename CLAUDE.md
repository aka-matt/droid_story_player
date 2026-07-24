# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repo is **pre-implementation**. The only substantive file is `droid-story-player-implementation.md` — a complete, authoritative build spec (in Chinese) for a Web Component. No `src/`, `package.json`, `vite.config.ts`, or build tooling exists yet. When asked to build the project, treat the spec as the source of truth: it contains full reference implementations for every file, the exact `package.json`/`vite.config.ts`, the JSON data schema, and the Shadow DOM stylesheet.

## What is being built

`<droid-story-player>` — a self-contained custom element that renders an animated, terminal-styled "story player" (auto-advancing slides of terminal content: messages, thoughts, code, logs, status lines, success blocks, landing screens). It ships as a **single ES module** that static HTML pages include with one `<script type="module">` tag; React is bundled in, so consuming pages need no other dependencies.

Key design constraints (from the spec):
- **React renders inside a Shadow DOM** attached by the custom element. Styles are injected as one `<style>` string (`src/styles.ts`) into the shadow root for full style isolation. Do **not** rely on global CSS.
- **No carousel library** (Swiper/Embla). Playback timing is custom via `requestAnimationFrame`.
- **Text-only rendering by default** — never use `dangerouslySetInnerHTML`. All content blocks render as plain text to avoid XSS. HTML support, if ever added, must be gated behind an explicit `allowHtml` flag + DOMPurify.

## Commands (once scaffolded per the spec)

```bash
npm install
npm run dev      # vite dev server against demo/
npm run build    # tsc --noEmit && vite build  →  dist/droid-story-player.js
npm run preview  # preview the production build
```

Build is Vite **library mode**, single-file ES output (`inlineDynamicImports: true`, `cssCodeSplit: false`). The spec defines no test runner — none is configured.

## Architecture

Component tree (all inside the shadow root):

```
DroidStoryElement (custom element, src/element.tsx)
└── React Root (createRoot on a <div part="root">)
    └── StoryPlayer            state machine: current index, playing, RAF progress
        ├── StoryRenderer      switches on block.type → renders each block
        ├── TypewriterText     per-char/per-line reveal, respects reduced-motion
        ├── Sidebar / Composer / Footer / Caption
        └── ProgressControls   per-story progress bars + play/pause/replay
```

Data flow and boundaries:
- **Three ways to supply data**, resolved in `element.tsx`'s `load()`: `data-src` attribute (fetch remote JSON), `data` HTML attribute (inline JSON string), or the `.data` JS property (object). `.data` and `data-src` are the primary interfaces; large JSON should not go in HTML attributes.
- `normalize()` fills defaults (story ids, `duration: 6000`); `applyAttributes()` lets the `autoplay`/`loop` boolean attributes override JSON.
- **Types are the contract**: `src/types.ts` defines `StoryPlayerData → StoryData → StoryBlock` (a discriminated union on `type`). Adding a new block kind means: extend the union in `types.ts`, add a `case` in `StoryRenderer`, and style it in `styles.ts`.
- **Playback engine** lives in `StoryPlayer`: a single RAF loop advances `progress` toward `duration`; pausing accumulates `elapsed` so resume is seamless. Story timing and typewriter animation start together (v1) — data producers must ensure `duration > charCount × characterDelay + read time`.

### Custom element ↔ React communication

- Imperative methods on the element (`play()`, `pause()`, `goTo(i)`) dispatch a `droid-command` CustomEvent that a `StoryPlayer` `useEffect` listens for. Do not try to call into React directly.
- The player emits `storychange` and `storycomplete` events with `composed: true` so they cross the shadow boundary to host-page listeners.

### Theming — public vs private surface

- **Color modes**: the terminal supports `"dark" | "light" | "system"` via the `theme` attribute or the top-level `theme` JSON field (attribute wins; default `system` = follows `prefers-color-scheme`). `element.tsx`'s `applyTheme()` reflects the JSON field onto the host attribute; the palettes themselves are pure CSS in `styles.ts` (`:host` = dark base, `:host([theme="light"])`, and a `prefers-color-scheme: light` media query for no-attr/`system`). Mode palettes only cover the terminal interior — outer chrome (`.controls`, `.caption`) is page-relative on purpose.
- **Public API**: `--isp-*` CSS variables (set on the host element; they override the mode palettes, so never pin a palette color like `--isp-terminal-bg` in the demo page or it breaks light mode) and `::part(...)` selectors (`root`, `terminal`, `terminal-bar`, `story`, `controls`, `caption`). Host pages theme via these.
- Internal class names inside the shadow DOM are **not** a public API — never document them as one or expect host pages to target them.

## Conventions

- React 18 + TypeScript, function components with hooks only.
- The registration entry (`src/index.tsx`) guards with `customElements.get()` before `define()` so double-loading the module is safe. Preserve this.
- Reduced motion: `TypewriterText` and CSS both check `prefers-reduced-motion` — any new animation must honor it.
