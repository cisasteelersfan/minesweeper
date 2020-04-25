import React from "react";
import "./Controls.css";

export interface ControlsProps {
  reset: () => void;
  isWin: boolean;
  isLose: boolean;
}

export const Controls = ({ reset, isWin, isLose }: ControlsProps) => {
  return (
    <div className="Controls">
      <button onClick={reset}>New Game</button>
      <div className="StatusText">
        {isLose && "You lose"}
        {!isLose && isWin && "You win!!!!"}
      </div>
    </div>
  );
};
