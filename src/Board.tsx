import React from "react";
import { Square } from "./Square";
import "./Board.css";

export const Board = () => {
  const generateRow = () => {
    return Array.from(new Array(10), () => ({
      isVisible: false,
      value: Math.floor(Math.random() * 9)
    }));
  };
  const initialBoard = Array.from(new Array(10), generateRow);

  return (
    <div className="Board">
      {initialBoard.map(row => (
        <div className="row">
          {row.map(val => (
            <Square value={val.value} />
          ))}
        </div>
      ))}
    </div>
  );
};
