import React, { SyntheticEvent } from "react";
import "./Square.css";
import flag from "./flag.svg";

export interface SquareProps {
  value?: number;
  isBomb: boolean;
  uncovered: boolean;
  onReveal: () => void;
}

export const Square = (props: SquareProps) => {
  const [showFlag, setFlag] = React.useState(false);

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    if (e.type === "click") {
      if (!showFlag) {
        props.onReveal();
      }
    } else {
      if (!props.uncovered) setFlag(!showFlag);
    }
  };

  return (
    <div
      className={"Square " + (props.uncovered ? "" : "covered")}
      onClick={handleClick}
      onContextMenu={handleClick}
    >
      {showFlag && <img className="flag" alt="flag" src={flag} />}
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
