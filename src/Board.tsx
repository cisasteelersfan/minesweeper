import React from "react";
import { Square } from "./Square";
import "./Board.css";

export interface SquareType {
  isBomb: boolean;
  value: number;
  uncovered: boolean;
}

export const Board = () => {
  const generateRow = (): SquareType[] => {
    return Array.from(new Array(10), () => ({
      value: 0,
      isBomb: Math.floor(Math.random() * 9) === 0,
      uncovered: false
    }));
  };
  const computeNumbers = (b: SquareType[][]): SquareType[][] => {
    const rows = b.length;
    const cols = b[0].length;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let bombs = 0;
        for (let r = -1; r <= 1; r++) {
          for (let c = -1; c <= 1; c++) {
            if (r === 0 && c === 0) {
              continue;
            }
            if (
              row + r < 0 ||
              row + r >= rows ||
              col + c < 0 ||
              col + c >= cols
            ) {
              continue;
            }
            bombs += b[row + r][col + c].isBomb ? 1 : 0;
          }
        }
        b[row][col].value = bombs;
      }
    }
    return b;
  };
  const initialBoard = Array.from(new Array(10), generateRow);

  const [board, setBoard] = React.useState(computeNumbers(initialBoard));

  const uncoverSquare = (row: number, col: number) => () => {
    const boardCopy = board.map(a => a.slice());
    boardCopy[row][col].uncovered = true;
    setBoard(boardCopy);
  };

  return (
    <div className="Board">
      {board.map((row, rowIdx) => (
        <div className="row">
          {row.map((val, colIdx) => (
            <Square
              value={val.value}
              isBomb={val.isBomb}
              uncovered={val.uncovered}
              onReveal={uncoverSquare(rowIdx, colIdx)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
