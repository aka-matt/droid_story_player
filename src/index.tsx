import { DroidStoryElement } from "./element";

const tagName = "droid-story-player";

if (!customElements.get(tagName)) {
  customElements.define(tagName, DroidStoryElement);
}

export { DroidStoryElement };
export type { StoryPlayerData, StoryData, StoryBlock } from "./types";