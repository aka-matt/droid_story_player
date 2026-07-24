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