import React, { SyntheticEvent } from "react";
import "./Square.css";
import flag from "./flag.svg";

export interface SquareProps {
  value: number;
  isBomb: boolean;
  uncovered: boolean;
  onReveal: () => void;
}

export const Square = (props: SquareProps) => {
  const [showFlag, setFlag] = React.useState(false);
  const [startLongPress, setStartLongPress] = React.useState(false);
  const longPress = React.useCallback(() => {
    timerId.current = undefined;
    if (!props.uncovered) setFlag((s) => !s);
  }, [props.uncovered]);
  const timerId = React.useRef<number>();

  // reset flag state when new game
  React.useEffect(() => {
    setFlag(false);
  }, [props.value]);

  React.useEffect(() => {
    if (startLongPress) {
      timerId.current = window.setTimeout(longPress, 200);
    }
    return () => {
      clearTimeout(timerId.current);
      timerId.current = undefined;
    };
  }, [longPress, startLongPress]);

  const start = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: proper typing around this
    if ((e as any).button === 2) {
      if (!props.uncovered) {
        setFlag(!showFlag);
      }
    } else {
      setStartLongPress(true);
    }
  };

  const stop = (e: SyntheticEvent) => {
    e.preventDefault();
    setStartLongPress(false);
    if (timerId.current) {
      clearTimeout(timerId.current);
      if (!showFlag) {
        props.onReveal();
      }
    }
  };

  const doNothing = (e: SyntheticEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={"Square " + (props.uncovered ? "" : "covered")}
      onContextMenu={doNothing}
      onTouchStart={start}
      onTouchEnd={stop}
      onMouseDown={start}
      onMouseUp={stop}
    >
      {showFlag && !props.uncovered && (
        <img className="flag" alt="flag" src={flag} />
      )}
      {props.uncovered &&
        (props.isBomb ? (
          <span className="dot" />
        ) : props.value ? (
          props.value
        ) : (
          ""
        ))}
    </div>
  );
};
