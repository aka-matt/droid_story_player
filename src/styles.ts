export const styles = String.raw`
:host {
  --isp-terminal-bg: #121212;
  --isp-terminal-bar: #1c1c1c;
  --isp-terminal-border: #353535;
  --isp-terminal-shadow: rgba(0,0,0,.24);
  --isp-glow: rgba(255,255,255,.035);
  --isp-text: #ecece8;
  --isp-muted: #999991;
  --isp-accent: #d8ff57;
  --isp-user-accent: #d8ff57;
  --isp-success: #c7ff63;
  --isp-warning: #f8c96b;
  --isp-error: #ff7575;
  --isp-surface-bg: #f1f0ea;
  --isp-surface-text: #151515;
  --isp-surface-muted: #66665f;
  --isp-surface-border: #d8d7cf;
  --isp-surface-shadow: rgba(0,0,0,.28);
  --isp-code-text: #d8d8d3;
  --isp-code-bg: rgba(255,255,255,.035);
  --isp-code-border: rgba(255,255,255,.06);
  --isp-code-diff-text: #d8ffa4;
  --isp-log-text: #b4b4ae;
  --isp-thought-text: #c7c7bf;
  --isp-thought-border: #5a5a54;
  --isp-status-text: #aaa9a2;
  --isp-path-text: #76766f;
  --isp-sidebar-bg: rgba(255,255,255,.018);
  --isp-sidebar-text: #8f8f88;
  --isp-sidebar-title: #d0d0c9;
  --isp-sidebar-heading: #c4c4bc;
  --isp-sidebar-success: #a5d771;
  --isp-sidebar-warning: #d9ae61;
  --isp-sidebar-error: #e87979;
  --isp-radius: 14px;
  --isp-mono: "SFMono-Regular", "Cascadia Code", Menlo, Monaco,
    Consolas, monospace;

  display: block;
  width: 100%;
  color: var(--isp-text);
  font-family: var(--isp-mono);
}

:host([theme="light"]) {
  --isp-terminal-bg: #faf9f5;
  --isp-terminal-bar: #f1f0ea;
  --isp-terminal-border: #dbd9cf;
  --isp-terminal-shadow: rgba(0,0,0,.18);
  --isp-glow: rgba(0,0,0,.025);
  --isp-text: #1d1d1a;
  --isp-muted: #6d6d64;
  --isp-user-accent: #4d7c0f;
  --isp-success: #4a9e05;
  --isp-warning: #b45309;
  --isp-error: #dc2626;
  --isp-surface-bg: #ffffff;
  --isp-surface-text: #151515;
  --isp-surface-muted: #66665f;
  --isp-surface-border: #e4e2d9;
  --isp-surface-shadow: rgba(0,0,0,.12);
  --isp-code-text: #3a3a35;
  --isp-code-bg: rgba(0,0,0,.04);
  --isp-code-border: rgba(0,0,0,.08);
  --isp-code-diff-text: #4a9e05;
  --isp-log-text: #55554d;
  --isp-thought-text: #55554d;
  --isp-thought-border: #c9c7bb;
  --isp-status-text: #6d6d64;
  --isp-path-text: #8a8a80;
  --isp-sidebar-bg: rgba(0,0,0,.025);
  --isp-sidebar-text: #6d6d64;
  --isp-sidebar-title: #1d1d1a;
  --isp-sidebar-heading: #3a3a35;
  --isp-sidebar-success: #4a9e05;
  --isp-sidebar-warning: #b45309;
  --isp-sidebar-error: #dc2626;
}

@media (prefers-color-scheme: light) {
  :host(:not([theme])),
  :host([theme="system"]) {
    --isp-terminal-bg: #faf9f5;
    --isp-terminal-bar: #f1f0ea;
    --isp-terminal-border: #dbd9cf;
    --isp-terminal-shadow: rgba(0,0,0,.18);
    --isp-glow: rgba(0,0,0,.025);
    --isp-text: #1d1d1a;
    --isp-muted: #6d6d64;
    --isp-user-accent: #4d7c0f;
    --isp-success: #4a9e05;
    --isp-warning: #b45309;
    --isp-error: #dc2626;
    --isp-surface-bg: #ffffff;
    --isp-surface-text: #151515;
    --isp-surface-muted: #66665f;
    --isp-surface-border: #e4e2d9;
    --isp-surface-shadow: rgba(0,0,0,.12);
    --isp-code-text: #3a3a35;
    --isp-code-bg: rgba(0,0,0,.04);
    --isp-code-border: rgba(0,0,0,.08);
    --isp-code-diff-text: #4a9e05;
    --isp-log-text: #55554d;
    --isp-thought-text: #55554d;
    --isp-thought-border: #c9c7bb;
    --isp-status-text: #6d6d64;
    --isp-path-text: #8a8a80;
    --isp-sidebar-bg: rgba(0,0,0,.025);
    --isp-sidebar-text: #6d6d64;
    --isp-sidebar-title: #1d1d1a;
    --isp-sidebar-heading: #3a3a35;
    --isp-sidebar-success: #4a9e05;
    --isp-sidebar-warning: #b45309;
    --isp-sidebar-error: #dc2626;
  }
}

*, *::before, *::after {
  box-sizing: border-box;
}

button {
  font: inherit;
  color: inherit;
}

.player {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
}

.terminal {
  overflow: hidden;
  background:
    radial-gradient(circle at 30% 0%, var(--isp-glow), transparent 32%),
    var(--isp-terminal-bg);
  border: 1px solid var(--isp-terminal-border);
  border-radius: var(--isp-radius);
  box-shadow: 0 30px 80px var(--isp-terminal-shadow);
}

.terminal__bar {
  display: flex;
  align-items: center;
  min-height: 46px;
  padding: 0 18px;
  color: var(--isp-muted);
  background: var(--isp-terminal-bar);
  border-bottom: 1px solid var(--isp-terminal-border);
  font-size: 12px;
}

.terminal__screen {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 235px;
  min-height: inherit;
}

.story {
  position: relative;
  min-width: 0;
  min-height: inherit;
  padding: 32px 30px 76px;
}

.story-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  max-width: min(760px, 90%);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(14px, 1.4vw, 17px);
  line-height: 1.6;
  white-space: pre-wrap;
}

.message--user {
  padding-left: 14px;
  border-left: 3px solid var(--isp-user-accent);
}

.thought {
  padding-left: 14px;
  color: var(--isp-thought-text);
  border-left: 3px solid var(--isp-thought-border);
  font-size: 14px;
  font-style: italic;
  line-height: 1.65;
}

.code, .log {
  width: 100%;
  margin: 0;
  overflow: auto;
  color: var(--isp-code-text);
  font-size: 12px;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
}

.code {
  padding: 16px;
  background: var(--isp-code-bg);
  border: 1px solid var(--isp-code-border);
  border-radius: 8px;
}

.code--diff {
  color: var(--isp-code-diff-text);
}

.log {
  color: var(--isp-log-text);
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--isp-status-text);
  font-size: 12px;
}

.status__square {
  width: 8px;
  height: 8px;
  background: currentColor;
}

.status--running { color: var(--isp-warning); }
.status--success { color: var(--isp-success); }
.status--error { color: var(--isp-error); }

.success {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  line-height: 1.65;
}

.success__title {
  color: var(--isp-success);
}

.landing {
  display: grid;
  place-items: center;
  min-height: 330px;
  padding: 40px 10px;
}

.landing__logo {
  display: block;
  width: min(420px, 72%);
  max-height: 80px;
  margin-bottom: 48px;
  object-fit: contain;
}

.landing__prompt {
  width: min(680px, 100%);
  overflow: hidden;
  color: var(--isp-surface-text);
  background: var(--isp-surface-bg);
  border-radius: 12px;
  box-shadow: 0 12px 50px var(--isp-surface-shadow);
}

.landing__input {
  min-height: 78px;
  padding: 19px 21px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 18px;
  line-height: 1.5;
}

.landing__meta {
  padding: 11px 20px;
  color: var(--isp-surface-muted);
  border-top: 1px solid var(--isp-surface-border);
  font-size: 12px;
}

.composer {
  position: absolute;
  right: 30px;
  bottom: 28px;
  left: 30px;
  overflow: hidden;
  color: var(--isp-surface-text);
  background: var(--isp-surface-bg);
  border-radius: 10px;
}

.composer__input {
  min-height: 54px;
  padding: 14px 16px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 14px;
}

.composer__meta {
  padding: 9px 16px;
  color: var(--isp-surface-muted);
  border-top: 1px solid var(--isp-surface-border);
  font-size: 11px;
}

.story__path, .story__version {
  position: absolute;
  bottom: 9px;
  color: var(--isp-path-text);
  font-size: 10px;
}

.story__path { left: 30px; }
.story__version { right: 30px; }

.sidebar {
  padding: 27px 18px;
  color: var(--isp-sidebar-text);
  background: var(--isp-sidebar-bg);
  border-left: 1px solid var(--isp-terminal-border);
  font-size: 11px;
  line-height: 1.55;
}

.sidebar__title {
  margin: 0 0 18px;
  color: var(--isp-sidebar-title);
  font-weight: 700;
}

.sidebar__stat {
  display: flex;
  flex-direction: column;
}

.sidebar__section {
  margin-top: 23px;
}

.sidebar__heading {
  margin-bottom: 9px;
  color: var(--isp-sidebar-heading);
  font-weight: 700;
}

.sidebar__item {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 3px 0;
}

.sidebar__item--success { color: var(--isp-sidebar-success); }
.sidebar__item--warning { color: var(--isp-sidebar-warning); }
.sidebar__item--error { color: var(--isp-sidebar-error); }

.controls {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 13px;
}

.progress-list {
  display: flex;
  flex: 1;
  gap: 5px;
}

.progress-trigger {
  position: relative;
  flex: 1;
  height: 4px;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  background: rgba(20,20,20,.18);
  border: 0;
  border-radius: 999px;
}

.progress-trigger__fill {
  position: absolute;
  inset: 0;
  background: currentColor;
  transform-origin: left center;
  will-change: transform;
}

.playback {
  min-width: 92px;
  padding: 7px 10px;
  cursor: pointer;
  background: transparent;
  border: 1px solid rgba(20,20,20,.25);
  border-radius: 999px;
  font-size: 11px;
}

.caption {
  margin-top: 17px;
  color: #33332f;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.55;
}

.cursor {
  animation: blink .8s step-end infinite;
}

.empty, .error {
  padding: 24px;
  color: #222;
  background: #f3f1eb;
  border: 1px solid #d7d4ca;
  border-radius: 8px;
}

.error {
  color: #9f2222;
}

@keyframes blink {
  50% { opacity: 0; }
}

@media (max-width: 760px) {
  .terminal__screen {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }

  .story {
    padding: 23px 18px 76px;
  }

  .composer {
    right: 18px;
    left: 18px;
  }

  .controls {
    align-items: stretch;
    flex-direction: column;
  }

  .playback {
    align-self: flex-end;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cursor {
    animation: none;
  }
}
`;
