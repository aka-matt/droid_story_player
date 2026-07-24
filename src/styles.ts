export const styles = String.raw`
:host {
  --isp-terminal-bg: #121212;
  --isp-terminal-bar: #1c1c1c;
  --isp-terminal-border: #353535;
  --isp-text: #ecece8;
  --isp-muted: #999991;
  --isp-accent: #d8ff57;
  --isp-user-bg: #efeee8;
  --isp-user-text: #151515;
  --isp-success: #c7ff63;
  --isp-warning: #f8c96b;
  --isp-error: #ff7575;
  --isp-radius: 14px;
  --isp-mono: "SFMono-Regular", "Cascadia Code", Menlo, Monaco,
    Consolas, monospace;

  display: block;
  width: 100%;
  color: var(--isp-text);
  font-family: var(--isp-mono);
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
    radial-gradient(circle at 30% 0%, rgba(255,255,255,.035), transparent 32%),
    var(--isp-terminal-bg);
  border: 1px solid var(--isp-terminal-border);
  border-radius: var(--isp-radius);
  box-shadow: 0 30px 80px rgba(0,0,0,.24);
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
  width: fit-content;
  padding: 13px 16px;
  color: var(--isp-user-text);
  background: var(--isp-user-bg);
  border-radius: 3px 14px 14px 14px;
}

.thought {
  padding-left: 14px;
  color: #c7c7bf;
  border-left: 2px solid #5a5a54;
  font-size: 14px;
  font-style: italic;
  line-height: 1.65;
}

.code, .log {
  width: 100%;
  margin: 0;
  overflow: auto;
  color: #d8d8d3;
  font-size: 12px;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
}

.code {
  padding: 16px;
  background: rgba(255,255,255,.035);
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 8px;
}

.code--diff {
  color: #d8ffa4;
}

.log {
  color: #b4b4ae;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #aaa9a2;
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
  color: #161616;
  background: #f1f0ea;
  border-radius: 12px;
  box-shadow: 0 12px 50px rgba(0,0,0,.28);
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
  color: #67675f;
  border-top: 1px solid #d6d4cc;
  font-size: 12px;
}

.composer {
  position: absolute;
  right: 30px;
  bottom: 28px;
  left: 30px;
  overflow: hidden;
  color: #151515;
  background: #efeee8;
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
  color: #66665f;
  border-top: 1px solid #d8d7cf;
  font-size: 11px;
}

.story__path, .story__version {
  position: absolute;
  bottom: 9px;
  color: #76766f;
  font-size: 10px;
}

.story__path { left: 30px; }
.story__version { right: 30px; }

.sidebar {
  padding: 27px 18px;
  color: #8f8f88;
  background: rgba(255,255,255,.018);
  border-left: 1px solid var(--isp-terminal-border);
  font-size: 11px;
  line-height: 1.55;
}

.sidebar__title {
  margin: 0 0 18px;
  color: #d0d0c9;
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
  color: #c4c4bc;
  font-weight: 700;
}

.sidebar__item {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 3px 0;
}

.sidebar__item--success { color: #a5d771; }
.sidebar__item--warning { color: #d9ae61; }
.sidebar__item--error { color: #e87979; }

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
