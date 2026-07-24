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
  theme?: "dark" | "light" | "system";
  terminal?: {
    title?: string;
    minHeight?: number;
    showSidebar?: boolean;
  };
  typewriter?: TypewriterOptions;
  sidebar?: SidebarData;
  stories: StoryData[];
}
