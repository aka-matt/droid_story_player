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