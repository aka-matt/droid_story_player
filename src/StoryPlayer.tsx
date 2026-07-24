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