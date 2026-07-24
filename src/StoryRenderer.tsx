import { useCallback, useEffect, useState } from "react";
import { TypewriterText } from "./TypewriterText";
import type { StoryBlock, TypewriterOptions } from "./types";

interface Props {
  blocks: StoryBlock[];
  active: boolean;
  options?: TypewriterOptions;
}

interface UnitProps {
  unitIndex: number;
  onUnitComplete: (unitIndex: number) => void;
  active: boolean;
  enabled: boolean;
  options?: TypewriterOptions;
  as?: "span" | "div" | "pre" | "p";
  className?: string;
  text: string;
}

function Unit({ unitIndex, onUnitComplete, ...props }: UnitProps) {
  const handleComplete = useCallback(
    () => onUnitComplete(unitIndex),
    [onUnitComplete, unitIndex]
  );

  return <TypewriterText {...props} onComplete={handleComplete} />;
}

function countUnits(block: StoryBlock): number {
  switch (block.type) {
    case "status":
      return block.detail ? 2 : 1;
    case "success":
      return (block.title ? 1 : 0) + block.paragraphs.length;
    case "landing":
      return block.meta ? 2 : 1;
    default:
      return 1;
  }
}

interface BlockViewProps {
  block: StoryBlock;
  blockIndex: number;
  active: boolean;
  options?: TypewriterOptions;
  onBlockComplete: (blockIndex: number) => void;
}

function BlockView({
  block,
  blockIndex,
  active,
  options,
  onBlockComplete
}: BlockViewProps) {
  const unitCount = countUnits(block);
  const [unitsDone, setUnitsDone] = useState(0);

  const completeUnit = useCallback((unitIndex: number) => {
    setUnitsDone(done => Math.max(done, unitIndex + 1));
  }, []);

  useEffect(() => {
    if (!active) setUnitsDone(0);
  }, [active]);

  useEffect(() => {
    if (unitsDone >= unitCount) onBlockComplete(blockIndex);
  }, [unitsDone, unitCount, onBlockComplete, blockIndex]);

  const enabled = block.typewriter ?? options?.enabled ?? true;
  const unitActive = (unitIndex: number) =>
    active && unitsDone >= unitIndex;

  const unitProps = { enabled, options, onUnitComplete: completeUnit };

  switch (block.type) {
    case "message":
      return (
        <div className={`message message--${block.role}`}>
          <Unit
            {...unitProps}
            as="div"
            text={block.text}
            unitIndex={0}
            active={unitActive(0)}
          />
        </div>
      );

    case "thought":
      return (
        <div className="thought">
          <Unit
            {...unitProps}
            as="div"
            text={block.text}
            unitIndex={0}
            active={unitActive(0)}
          />
        </div>
      );

    case "code":
      return (
        <Unit
          {...unitProps}
          as="pre"
          className={`code ${
            block.variant === "diff" ? "code--diff" : ""
          }`}
          text={block.code}
          unitIndex={0}
          active={unitActive(0)}
        />
      );

    case "log":
      return (
        <Unit
          {...unitProps}
          as="pre"
          className="log"
          text={block.text}
          unitIndex={0}
          active={unitActive(0)}
        />
      );

    case "status":
      return (
        <div className={`status status--${block.status || "default"}`}>
          {active && <span className="status__square" />}
          <strong>
            <Unit
              {...unitProps}
              as="span"
              text={block.label}
              unitIndex={0}
              active={unitActive(0)}
            />
          </strong>
          {block.detail && (
            <Unit
              {...unitProps}
              as="span"
              text={` · ${block.detail}`}
              unitIndex={1}
              active={unitActive(1)}
            />
          )}
        </div>
      );

    case "success": {
      const titleUnits = block.title ? 1 : 0;
      return (
        <div className="success">
          {block.title && (
            <strong className="success__title">
              <Unit
                {...unitProps}
                as="span"
                text={`${block.title}.`}
                unitIndex={0}
                active={unitActive(0)}
              />
            </strong>
          )}
          {block.paragraphs.map((text, paragraphIndex) => (
            <Unit
              {...unitProps}
              key={paragraphIndex}
              as="p"
              text={text}
              unitIndex={titleUnits + paragraphIndex}
              active={unitActive(titleUnits + paragraphIndex)}
            />
          ))}
        </div>
      );
    }

    case "landing":
      return (
        <div className="landing">
          {block.logo && (
            <img
              className="landing__logo"
              src={block.logo}
              alt={block.logoAlt || ""}
              draggable={false}
            />
          )}

          <div className="landing__prompt">
            <Unit
              {...unitProps}
              as="div"
              className="landing__input"
              text={block.prompt || ""}
              unitIndex={0}
              active={unitActive(0)}
            />
            {block.meta && (
              <Unit
                {...unitProps}
                as="div"
                className="landing__meta"
                text={block.meta}
                unitIndex={1}
                active={unitActive(1)}
              />
            )}
          </div>
        </div>
      );

    case "text":
      return (
        <Unit
          {...unitProps}
          as="p"
          className={`text text--${block.className || "normal"}`}
          text={block.text}
          unitIndex={0}
          active={unitActive(0)}
        />
      );
  }
}

export function StoryRenderer({ blocks, active, options }: Props) {
  const [blocksDone, setBlocksDone] = useState(0);

  const completeBlock = useCallback((blockIndex: number) => {
    setBlocksDone(done => Math.max(done, blockIndex + 1));
  }, []);

  useEffect(() => {
    if (!active) setBlocksDone(0);
  }, [active]);

  return (
    <div className="story-body">
      {blocks.map((block, index) => (
        <BlockView
          key={`${block.type}-${index}`}
          block={block}
          blockIndex={index}
          active={active && index <= blocksDone}
          options={options}
          onBlockComplete={completeBlock}
        />
      ))}
    </div>
  );
}
