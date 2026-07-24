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
    this.currentData = this.normalizeData(value);
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
        this.currentData = this.normalizeData(JSON.parse(inline));
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
      this.currentData = this.applyAttributes(this.normalizeData(json));
      this.render();
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        this.renderError(`Unable to load ${url}.`, error);
      }
    }
  }

  private normalizeData(value: StoryPlayerData): StoryPlayerData {
    if (!value || !Array.isArray(value.stories)) {
      return EMPTY_DATA;
    }

    return {
      ...EMPTY_DATA,
      ...value,
      stories: value.stories.map((story, index) => ({
        ...story,
        id: story.id || `story-${index + 1}`,
        duration: story.duration || 6000,
        blocks: story.blocks || []
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

  private applyTheme() {
    if (this.hasAttribute("theme")) return;

    const theme = this.currentData.theme;

    if (theme === "dark" || theme === "light" || theme === "system") {
      this.setAttribute("theme", theme);
    } else {
      this.removeAttribute("theme");
    }
  }

  private render() {
    this.applyTheme();
    this.root?.render(
      <StoryPlayer data={this.currentData} host={this} />
    );
  }

  private renderError(message: string, error: unknown) {
    console.error(message, error);
    this.root?.render(<div className="error">{message}</div>);
  }
}