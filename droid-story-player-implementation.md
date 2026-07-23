# React + Shadow DOM 终端 Story Player Web Component 实现方案

## 1. 目标

实现一个可直接用于静态网页的 Web Component：

```html
<droid-story-player></droid-story-player>
```

组件内部使用 React 渲染，并挂载在 Shadow DOM 中。数据通过 JSON 文件、HTML 属性或 JavaScript 属性传入。

功能范围：

- 多段 Story 自动播放
- 每段独立持续时间
- 顶部终端视觉
- 消息、思考、代码、日志、状态、成功信息等内容块
- 打字机动画
- Story 进度条
- 暂停、继续、重播和跳转
- Shadow DOM 样式隔离
- CSS Variables 主题定制
- 响应式布局
- 无障碍属性
- 构建成单个 ES Module，静态页面直接引用

---

## 2. 架构

```text
静态网页
└── <droid-story-player>
    └── ShadowRoot
        ├── <style>
        └── React Root
            └── StoryPlayer
                ├── TerminalFrame
                ├── StoryRenderer
                ├── Sidebar
                ├── ProgressControls
                └── Caption
```

推荐技术：

- React 18
- TypeScript
- Custom Elements
- Shadow DOM
- Vite Library Mode
- `requestAnimationFrame`

不需要引入 Swiper、Embla 等轮播库。该组件的播放时间、打字动画和内容模型都较特殊，自己实现更合适。

---

## 3. 使用方式

### 3.1 加载远程 JSON

```html
<droid-story-player
  data-src="/data/story.json"
  autoplay
></droid-story-player>

<script
  type="module"
  src="/assets/droid-story-player.js"
></script>
```

### 3.2 通过 JavaScript 属性传入对象

```html
<droid-story-player id="demo"></droid-story-player>

<script type="module">
  import "/assets/droid-story-player.js";

  const player = document.querySelector("#demo");

  player.data = {
    title: "Self-improvement run",
    autoplay: true,
    stories: [
      {
        id: "intro",
        duration: 5500,
        label: "Introduction",
        caption: {
          title: "start",
          text: "The session starts in a coding workspace."
        },
        blocks: [
          {
            type: "message",
            role: "user",
            text: "Who are you?",
            typewriter: true
          }
        ]
      }
    ]
  };
</script>
```

推荐以 `.data` 属性和 `data-src` 作为主要接口。大型 JSON 不建议直接写进 HTML 属性。

---

## 4. JSON 数据结构

```ts
export interface StoryPlayerData {
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
  startIndex?: number;
  terminal?: {
    title?: string;
    minHeight?: number;
    showSidebar?: boolean;
  };
  typewriter?: {
    enabled?: boolean;
    characterDelay?: number;
    lineDelay?: number;
    cursor?: boolean;
    respectReducedMotion?: boolean;
  };
  sidebar?: SidebarData;
  stories: StoryData[];
}

export interface StoryData {
  id?: string;
  label?: string;
  duration?: number;
  caption?: {
    title?: string;
    text: string;
  };
  blocks: StoryBlock[];
  composer?: {
    text?: string;
    meta?: string;
    typewriter?: boolean;
  };
  footer?: {
    path?: string;
    version?: string;
  };
}

export type StoryBlock =
  | MessageBlock
  | ThoughtBlock
  | CodeBlock
  | LogBlock
  | StatusBlock
  | SuccessBlock
  | LandingBlock
  | TextBlock;
```

建议只允许结构化内容块，不默认允许任意 HTML，以降低 XSS 风险。

---

## 5. 示例 JSON

```json
{
  "title": "Self-improvement run",
  "autoplay": true,
  "loop": false,
  "terminal": {
    "title": "droid@local: self-finetuning",
    "minHeight": 520,
    "showSidebar": true
  },
  "typewriter": {
    "enabled": true,
    "characterDelay": 18,
    "lineDelay": 100,
    "cursor": true,
    "respectReducedMotion": true
  },
  "sidebar": {
    "title": "Session context",
    "stats": [
      { "label": "Context", "value": "43,219 tokens" },
      { "label": "Used", "value": "17%" },
      { "label": "Spent", "value": "$0.00" }
    ],
    "sections": [
      {
        "title": "MCP",
        "items": [
          {
            "label": "gh_grep",
            "value": "Connected",
            "status": "success"
          },
          {
            "label": "linear",
            "value": "Needs auth",
            "status": "warning"
          }
        ]
      }
    ]
  },
  "stories": [
    {
      "id": "landing",
      "label": "Landing and first prompt",
      "duration": 5500,
      "caption": {
        "title": "start in workspace",
        "text": "The session starts inside a coding workspace."
      },
      "blocks": [
        {
          "type": "landing",
          "logo": "/images/logo.svg",
          "logoAlt": "Product logo",
          "prompt": "who are you?",
          "meta": "Build · droid · local",
          "typewriter": true
        }
      ],
      "footer": {
        "path": "~/demo/self-finetuning/",
        "version": "1.0.0"
      }
    },
    {
      "id": "answer",
      "label": "Base model answer",
      "duration": 9000,
      "caption": {
        "title": "base model",
        "text": "The current model responds before training."
      },
      "blocks": [
        {
          "type": "message",
          "role": "user",
          "text": "who are you?"
        },
        {
          "type": "message",
          "role": "assistant",
          "text": "I am an AI assistant running in this workspace.",
          "typewriter": true
        },
        {
          "type": "status",
          "label": "Build",
          "detail": "droid",
          "status": "default"
        }
      ],
      "composer": {
        "text": "fine tune yourself to avoid the letter e.",
        "meta": "Build · droid · local",
        "typewriter": true
      }
    },
    {
      "id": "training",
      "label": "Training",
      "duration": 12000,
      "caption": {
        "title": "training",
        "text": "The model is trained with the new objective."
      },
      "blocks": [
        {
          "type": "log",
          "text": "[INFO] Starting epoch 0\n[INFO] Training for 96 steps\n[INFO] Writing metrics...",
          "typewriter": true
        },
        {
          "type": "status",
          "label": "Build",
          "detail": "running",
          "status": "running"
        }
      ]
    },
    {
      "id": "complete",
      "label": "Updated answer",
      "duration": 10000,
      "caption": {
        "title": "updated model",
        "text": "The updated model now follows the target behavior."
      },
      "blocks": [
        {
          "type": "success",
          "title": "PASS",
          "paragraphs": [
            "The pipeline finished successfully.",
            "The new checkpoint is now active."
          ],
          "typewriter": true
        }
      ]
    }
  ]
}
```

---

## 6. 项目目录

```text
droid-story-player/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── index.tsx
│   ├── element.tsx
│   ├── StoryPlayer.tsx
│   ├── StoryRenderer.tsx
│   ├── TypewriterText.tsx
│   ├── types.ts
│   └── styles.ts
├── demo/
│   ├── index.html
│   └── story.json
└── dist/
    └── droid-story-player.js
```

---

## 7. package.json

```json
{
  "name": "droid-story-player",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.4",
    "vite": "^5.4.0"
  }
}
```

---

## 8. Vite 配置

`vite.config.ts`：

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.tsx",
      name: "DroidStoryPlayer",
      formats: ["es"],
      fileName: () => "droid-story-player.js"
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    },
    cssCodeSplit: false,
    minify: "esbuild"
  }
});
```

React 会被打进最终文件，静态页面不需要另外加载 React。

---

## 9. 类型定义

`src/types.ts`：

```ts
export interface TypewriterOptions {
  enabled?: boolean;
  characterDelay?: number;
  lineDelay?: number;
  cursor?: boolean;
  respectReducedMotion?: boolean;
}

export interface SidebarData {
  title?: string;
  stats?: Array<{
    label: string;
    value: string;
  }>;
  sections?: Array<{
    title: string;
    items: Array<{
      label: string;
      value?: string;
      status?: "normal" | "success" | "warning" | "error";
    }>;
  }>;
}

interface BaseBlock {
  typewriter?: boolean;
  revealAfterPrevious?: boolean;
}

export interface MessageBlock extends BaseBlock {
  type: "message";
  role: "user" | "assistant" | "system";
  text: string;
}

export interface ThoughtBlock extends BaseBlock {
  type: "thought";
  text: string;
}

export interface CodeBlock extends BaseBlock {
  type: "code";
  language?: string;
  code: string;
  variant?: "default" | "diff";
}

export interface LogBlock extends BaseBlock {
  type: "log";
  text: string;
}

export interface StatusBlock extends BaseBlock {
  type: "status";
  label: string;
  detail?: string;
  status?: "default" | "running" | "success" | "warning" | "error";
}

export interface SuccessBlock extends BaseBlock {
  type: "success";
  title?: string;
  paragraphs: string[];
}

export interface LandingBlock extends BaseBlock {
  type: "landing";
  logo?: string;
  logoAlt?: string;
  prompt?: string;
  meta?: string;
}

export interface TextBlock extends BaseBlock {
  type: "text";
  text: string;
  className?: "muted" | "accent" | "normal";
}

export type StoryBlock =
  | MessageBlock
  | ThoughtBlock
  | CodeBlock
  | LogBlock
  | StatusBlock
  | SuccessBlock
  | LandingBlock
  | TextBlock;

export interface StoryData {
  id?: string;
  label?: string;
  duration?: number;
  caption?: {
    title?: string;
    text: string;
  };
  blocks: StoryBlock[];
  composer?: {
    text?: string;
    meta?: string;
    typewriter?: boolean;
  };
  footer?: {
    path?: string;
    version?: string;
  };
}

export interface StoryPlayerData {
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
  startIndex?: number;
  terminal?: {
    title?: string;
    minHeight?: number;
    showSidebar?: boolean;
  };
  typewriter?: TypewriterOptions;
  sidebar?: SidebarData;
  stories: StoryData[];
}
```

---

## 10. Custom Element 与 Shadow DOM

`src/element.tsx`：

```tsx
import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { StoryPlayer } from "./StoryPlayer";
import { styles } from "./styles";
import type { StoryPlayerData } from "./types";

const EMPTY_DATA: StoryPlayerData = {
  autoplay: true,
  loop: false,
  stories: []
};

export class DroidStoryElement extends HTMLElement {
  static get observedAttributes() {
    return ["data", "data-src", "autoplay", "loop"];
  }

  private root?: Root;
  private mountNode: HTMLDivElement;
  private currentData: StoryPlayerData = EMPTY_DATA;
  private abortController?: AbortController;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");

    style.textContent = styles;
    this.mountNode = document.createElement("div");
    this.mountNode.setAttribute("part", "root");

    shadow.append(style, this.mountNode);
  }

  connectedCallback() {
    this.root = createRoot(this.mountNode);
    void this.load();
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.root?.unmount();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      void this.load();
    }
  }

  get data(): StoryPlayerData {
    return this.currentData;
  }

  set data(value: StoryPlayerData) {
    this.currentData = this.normalize(value);
    this.render();
  }

  play() {
    this.dispatchCommand({ type: "play" });
  }

  pause() {
    this.dispatchCommand({ type: "pause" });
  }

  goTo(index: number) {
    this.dispatchCommand({ type: "go-to", index });
  }

  private dispatchCommand(detail: unknown) {
    this.dispatchEvent(
      new CustomEvent("droid-command", { detail })
    );
  }

  private async load() {
    const src = this.getAttribute("data-src");

    if (src) {
      await this.loadRemote(src);
      return;
    }

    const inline = this.getAttribute("data");

    if (inline) {
      try {
        this.currentData = this.normalize(JSON.parse(inline));
      } catch (error) {
        this.renderError("Invalid JSON in data attribute.", error);
        return;
      }
    }

    this.currentData = this.applyAttributes(this.currentData);
    this.render();
  }

  private async loadRemote(url: string) {
    this.abortController?.abort();
    this.abortController = new AbortController();

    try {
      const response = await fetch(url, {
        signal: this.abortController.signal,
        credentials: "same-origin"
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      this.currentData = this.applyAttributes(this.normalize(json));
      this.render();
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        this.renderError(`Unable to load ${url}.`, error);
      }
    }
  }

  private normalize(value: StoryPlayerData): StoryPlayerData {
    if (!value || !Array.isArray(value.stories)) {
      return EMPTY_DATA;
    }

    return {
      ...EMPTY_DATA,
      ...value,
      stories: value.stories.map((story, index) => ({
        id: story.id || `story-${index + 1}`,
        duration: story.duration || 6000,
        blocks: story.blocks || [],
        ...story
      }))
    };
  }

  private applyAttributes(value: StoryPlayerData): StoryPlayerData {
    return {
      ...value,
      autoplay: this.hasAttribute("autoplay")
        ? true
        : value.autoplay,
      loop: this.hasAttribute("loop")
        ? true
        : value.loop
    };
  }

  private render() {
    this.root?.render(
      <StoryPlayer data={this.currentData} host={this} />
    );
  }

  private renderError(message: string, error: unknown) {
    console.error(message, error);
    this.root?.render(<div className="error">{message}</div>);
  }
}
```

注册组件，`src/index.tsx`：

```tsx
import { DroidStoryElement } from "./element";

const tagName = "droid-story-player";

if (!customElements.get(tagName)) {
  customElements.define(tagName, DroidStoryElement);
}

export { DroidStoryElement };
export type { StoryPlayerData, StoryData, StoryBlock } from "./types";
```

---

## 11. 打字机组件

`src/TypewriterText.tsx`：

```tsx
import { useEffect, useMemo, useState } from "react";
import type { TypewriterOptions } from "./types";

interface Props {
  text: string;
  active: boolean;
  enabled?: boolean;
  options?: TypewriterOptions;
  as?: "span" | "div" | "pre" | "p";
  className?: string;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  active,
  enabled = true,
  options,
  as: Tag = "span",
  className,
  onComplete
}: Props) {
  const [length, setLength] = useState(enabled ? 0 : text.length);

  const reducedMotion = useMemo(() => {
    if (options?.respectReducedMotion === false) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, [options?.respectReducedMotion]);

  useEffect(() => {
    if (!active) {
      setLength(0);
      return;
    }

    if (!enabled || reducedMotion) {
      setLength(text.length);
      onComplete?.();
      return;
    }

    let index = 0;
    let timer = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      index += 1;
      setLength(index);

      if (index >= text.length) {
        onComplete?.();
        return;
      }

      const previousCharacter = text[index - 1];
      const delay =
        previousCharacter === "\n"
          ? options?.lineDelay ?? 100
          : options?.characterDelay ?? 18;

      timer = window.setTimeout(tick, delay);
    };

    timer = window.setTimeout(
      tick,
      options?.characterDelay ?? 18
    );

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    active,
    enabled,
    onComplete,
    options?.characterDelay,
    options?.lineDelay,
    reducedMotion,
    text
  ]);

  const complete = length >= text.length;

  return (
    <Tag className={className}>
      {text.slice(0, length)}
      {options?.cursor !== false && !complete && (
        <span className="cursor" aria-hidden="true">▋</span>
      )}
    </Tag>
  );
}
```

---

## 12. Story 内容渲染器

`src/StoryRenderer.tsx`：

```tsx
import { TypewriterText } from "./TypewriterText";
import type { StoryBlock, TypewriterOptions } from "./types";

interface Props {
  blocks: StoryBlock[];
  active: boolean;
  options?: TypewriterOptions;
}

export function StoryRenderer({ blocks, active, options }: Props) {
  return (
    <div className="story-body">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        const animated = block.typewriter === true;

        switch (block.type) {
          case "message":
            return (
              <div key={key} className={`message message--${block.role}`}>
                <TypewriterText
                  as="div"
                  text={block.text}
                  active={active}
                  enabled={animated}
                  options={options}
                />
              </div>
            );

          case "thought":
            return (
              <div key={key} className="thought">
                <TypewriterText
                  as="div"
                  text={block.text}
                  active={active}
                  enabled={animated}
                  options={options}
                />
              </div>
            );

          case "code":
            return (
              <TypewriterText
                key={key}
                as="pre"
                className={`code ${
                  block.variant === "diff" ? "code--diff" : ""
                }`}
                text={block.code}
                active={active}
                enabled={animated}
                options={options}
              />
            );

          case "log":
            return (
              <TypewriterText
                key={key}
                as="pre"
                className="log"
                text={block.text}
                active={active}
                enabled={animated}
                options={options}
              />
            );

          case "status":
            return (
              <div
                key={key}
                className={`status status--${block.status || "default"}`}
              >
                <span className="status__square" />
                <strong>{block.label}</strong>
                {block.detail && <span> · {block.detail}</span>}
              </div>
            );

          case "success":
            return (
              <div key={key} className="success">
                {block.title && (
                  <strong className="success__title">
                    {block.title}.
                  </strong>
                )}
                {block.paragraphs.map((text, paragraphIndex) => (
                  <TypewriterText
                    key={paragraphIndex}
                    as="p"
                    text={text}
                    active={active}
                    enabled={animated}
                    options={options}
                  />
                ))}
              </div>
            );

          case "landing":
            return (
              <div key={key} className="landing">
                {block.logo && (
                  <img
                    className="landing__logo"
                    src={block.logo}
                    alt={block.logoAlt || ""}
                    draggable={false}
                  />
                )}

                <div className="landing__prompt">
                  <TypewriterText
                    as="div"
                    className="landing__input"
                    text={block.prompt || ""}
                    active={active}
                    enabled={animated}
                    options={options}
                  />
                  {block.meta && (
                    <div className="landing__meta">{block.meta}</div>
                  )}
                </div>
              </div>
            );

          case "text":
            return (
              <TypewriterText
                key={key}
                as="p"
                className={`text text--${block.className || "normal"}`}
                text={block.text}
                active={active}
                enabled={animated}
                options={options}
              />
            );
        }
      })}
    </div>
  );
}
```

---

## 13. 主播放器

`src/StoryPlayer.tsx`：

```tsx
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { StoryRenderer } from "./StoryRenderer";
import { TypewriterText } from "./TypewriterText";
import type { StoryPlayerData } from "./types";

interface Props {
  data: StoryPlayerData;
  host: HTMLElement;
}

export function StoryPlayer({ data, host }: Props) {
  const stories = data.stories || [];
  const initial = Math.min(
    Math.max(data.startIndex || 0, 0),
    Math.max(stories.length - 1, 0)
  );

  const [index, setIndex] = useState(initial);
  const [playing, setPlaying] = useState(data.autoplay !== false);
  const [progress, setProgress] = useState(0);

  const elapsed = useRef(0);
  const startedAt = useRef(0);
  const frame = useRef(0);

  const story = stories[index];
  const duration = story?.duration || 6000;

  const emit = useCallback(
    (name: string, detail: unknown) => {
      host.dispatchEvent(
        new CustomEvent(name, {
          detail,
          bubbles: true,
          composed: true
        })
      );
    },
    [host]
  );

  const goTo = useCallback(
    (nextIndex: number, shouldPlay = true) => {
      if (!stories.length) return;

      const safeIndex = Math.min(
        Math.max(nextIndex, 0),
        stories.length - 1
      );

      cancelAnimationFrame(frame.current);
      elapsed.current = 0;
      startedAt.current = performance.now();

      setIndex(safeIndex);
      setProgress(0);
      setPlaying(shouldPlay);

      emit("storychange", {
        index: safeIndex,
        story: stories[safeIndex]
      });
    },
    [emit, stories]
  );

  const next = useCallback(() => {
    if (index < stories.length - 1) {
      goTo(index + 1);
    } else if (data.loop) {
      goTo(0);
    } else {
      setProgress(1);
      setPlaying(false);
      emit("storycomplete", { index, story });
    }
  }, [data.loop, emit, goTo, index, stories.length, story]);

  useEffect(() => {
    const listener = (event: Event) => {
      const command = (event as CustomEvent).detail;

      if (command?.type === "play") setPlaying(true);
      if (command?.type === "pause") setPlaying(false);
      if (command?.type === "go-to") goTo(command.index);
    };

    host.addEventListener("droid-command", listener);
    return () => host.removeEventListener("droid-command", listener);
  }, [goTo, host]);

  useEffect(() => {
    if (!playing || !story) return;

    startedAt.current = performance.now();

    const tick = (now: number) => {
      const total = elapsed.current + now - startedAt.current;
      const value = Math.min(total / duration, 1);

      setProgress(value);

      if (value >= 1) {
        elapsed.current = 0;
        next();
      } else {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame.current);
      elapsed.current += performance.now() - startedAt.current;
    };
  }, [duration, next, playing, story]);

  useEffect(() => {
    setIndex(initial);
    setProgress(0);
    elapsed.current = 0;
    setPlaying(data.autoplay !== false);
  }, [data, initial]);

  const progressValues = useMemo(
    () =>
      stories.map((_, storyIndex) => {
        if (storyIndex < index) return 1;
        if (storyIndex > index) return 0;
        return progress;
      }),
    [index, progress, stories]
  );

  if (!story) {
    return <div className="empty">No story data was provided.</div>;
  }

  const finished =
    index === stories.length - 1 && progress >= 1;

  return (
    <figure className="player" aria-label={data.title || "Story player"}>
      <div
        className="terminal"
        part="terminal"
        style={{ minHeight: data.terminal?.minHeight || 500 }}
      >
        <div className="terminal__bar" part="terminal-bar">
          {data.terminal?.title || "session@local: story"}
        </div>

        <div className="terminal__screen">
          <section
            className="story"
            part="story"
            aria-live="polite"
            aria-label={story.label || `Story ${index + 1}`}
          >
            <StoryRenderer
              key={story.id || index}
              blocks={story.blocks}
              active
              options={data.typewriter}
            />

            {story.composer && (
              <div className="composer">
                <TypewriterText
                  as="div"
                  className="composer__input"
                  text={story.composer.text || ""}
                  active
                  enabled={story.composer.typewriter === true}
                  options={data.typewriter}
                />
                {story.composer.meta && (
                  <div className="composer__meta">
                    {story.composer.meta}
                  </div>
                )}
              </div>
            )}

            {story.footer?.path && (
              <span className="story__path">{story.footer.path}</span>
            )}
            {story.footer?.version && (
              <span className="story__version">
                {story.footer.version}
              </span>
            )}
          </section>

          {data.terminal?.showSidebar !== false && data.sidebar && (
            <aside className="sidebar" aria-label="Session context">
              <p className="sidebar__title">
                {data.sidebar.title || "Session context"}
              </p>

              {data.sidebar.stats?.map((item, itemIndex) => (
                <p className="sidebar__stat" key={itemIndex}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </p>
              ))}

              {data.sidebar.sections?.map((section, sectionIndex) => (
                <div className="sidebar__section" key={sectionIndex}>
                  <div className="sidebar__heading">
                    ▼ {section.title}
                  </div>
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`sidebar__item sidebar__item--${
                        item.status || "normal"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </aside>
          )}
        </div>
      </div>

      <div className="controls" part="controls">
        <div className="progress-list">
          {stories.map((item, storyIndex) => (
            <button
              key={item.id || storyIndex}
              type="button"
              className="progress-trigger"
              aria-label={item.label || `Show story ${storyIndex + 1}`}
              aria-current={storyIndex === index ? "step" : undefined}
              onClick={() => goTo(storyIndex)}
            >
              <span
                className="progress-trigger__fill"
                style={{
                  transform: `scaleX(${progressValues[storyIndex]})`
                }}
              />
            </button>
          ))}
        </div>

        <button
          className="playback"
          type="button"
          aria-pressed={playing}
          onClick={() => {
            if (finished) goTo(0);
            else setPlaying(value => !value);
          }}
        >
          {finished ? "play again" : playing ? "pause" : "play"}
        </button>
      </div>

      {story.caption && (
        <figcaption className="caption" part="caption" aria-live="polite">
          {story.caption.title && (
            <strong>{story.caption.title}: </strong>
          )}
          {story.caption.text}
        </figcaption>
      )}
    </figure>
  );
}
```

---

## 14. Shadow DOM 样式

`src/styles.ts`：

```ts
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
```

---

## 15. 静态页面 Demo

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />
  <title>Story Player Demo</title>

  <style>
    body {
      margin: 0;
      padding: 60px 24px;
      background: #efede5;
    }

    main {
      max-width: 1180px;
      margin: 0 auto;
    }

    droid-story-player {
      --isp-terminal-bg: #121212;
      --isp-accent: #d8ff57;
    }
  </style>
</head>
<body>
  <main>
    <droid-story-player
      data-src="./story.json"
      autoplay
    ></droid-story-player>
  </main>

  <script
    type="module"
    src="./droid-story-player.js"
  ></script>
</body>
</html>
```

---

## 16. 公共 API

```ts
interface DroidStoryPlayerElement extends HTMLElement {
  data: StoryPlayerData;
  play(): void;
  pause(): void;
  goTo(index: number): void;
}
```

使用：

```js
const player = document.querySelector("droid-story-player");

player.play();
player.pause();
player.goTo(2);
```

事件：

```js
player.addEventListener("storychange", event => {
  console.log(event.detail.index);
  console.log(event.detail.story);
});

player.addEventListener("storycomplete", () => {
  console.log("All stories completed");
});
```

事件使用 `composed: true`，可穿过 Shadow DOM 边界。

---

## 17. 主题定制

宿主页面可覆盖：

```css
droid-story-player {
  --isp-terminal-bg: #101010;
  --isp-terminal-bar: #191919;
  --isp-terminal-border: #363636;
  --isp-text: #f0f0e9;
  --isp-muted: #92928b;
  --isp-accent: #d8ff57;
  --isp-user-bg: #f3f1e9;
  --isp-user-text: #181818;
  --isp-success: #c5ff64;
  --isp-warning: #f5c66d;
  --isp-error: #ff7777;
  --isp-radius: 16px;
}
```

还可使用 `::part`：

```css
droid-story-player::part(terminal) {
  box-shadow: none;
}

droid-story-player::part(caption) {
  font-size: 16px;
}
```

不要把 Shadow DOM 内部 class 作为公共 API。

---

## 18. 安全建议

默认只渲染纯文本：

- `message.text`
- `code.code`
- `log.text`
- `thought.text`

不要直接使用 `dangerouslySetInnerHTML`。

如必须支持 HTML：

1. 增加明确的 `allowHtml` 配置。
2. 使用 DOMPurify 清理。
3. 禁止脚本、事件属性和危险 URL。
4. 不允许 JSON 定义 JavaScript 回调。

---

## 19. 动画策略

首版建议 Story 计时与打字动画同时开始。

数据生产方应满足：

```text
duration > 字符数 × characterDelay + 阅读停留时间
```

后续可增加：

```ts
durationMode?: "total" | "after-animation";
```

如果一个 Story 内多个块要依次打字，可在 `StoryRenderer` 中维护 `activeBlockIndex`，上一个块完成后再启动下一个块。

---

## 20. 可见性优化

建议组件离开 viewport 或页面切到后台时暂停。

```ts
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        setPlaying(false);
      }
    },
    { threshold: 0.2 }
  );

  observer.observe(host);
  return () => observer.disconnect();
}, [host]);
```

页面隐藏时暂停：

```ts
useEffect(() => {
  const handleVisibility = () => {
    if (document.hidden) setPlaying(false);
  };

  document.addEventListener("visibilitychange", handleVisibility);
  return () =>
    document.removeEventListener("visibilitychange", handleVisibility);
}, []);
```

---

## 21. 数据校验

生产版本推荐加入 Zod：

```bash
npm install zod
```

在加载远程 JSON 后执行 Schema 校验，避免非法字段导致组件崩溃。

---

## 22. 构建和部署

```bash
npm install
npm run build
```

输出：

```text
dist/droid-story-player.js
```

部署：

```text
public/
├── index.html
├── droid-story-player.js
├── story.json
└── images/
```

静态页面引用：

```html
<script
  type="module"
  src="/droid-story-player.js"
></script>
```

跨域加载 JSON 时，数据服务器需要提供正确 CORS Header。

---

## 23. 推荐的首版范围

首版完成：

- Shadow DOM
- React 渲染
- JSON 数据接口
- `data-src`
- `.data`
- 自动播放
- 暂停、继续、重播
- Story 跳转
- 打字动画
- Message、Thought、Code、Log、Status、Success、Landing
- Sidebar
- Caption
- CSS Variables
- 公共事件和方法
- 响应式布局
- Reduced Motion

后续版本再增加：

- Block 顺序动画
- Markdown
- 语法高亮
- 图片和视频 Block
- 键盘与触摸操作
- 全屏模式
- 可视化 Story 编辑器
- JSON Schema 编辑器
- 国际化

该方案可复刻参考页面的核心视觉语言与交互方式，同时保持代码、数据格式和样式接口完全独立。
