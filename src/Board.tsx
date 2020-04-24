import React from "react";
import { Square } from "./Square";
import "./Board.css";

export interface SquareType {
  isBomb: boolean;
  value: number;
  uncovered: boolean;
}

const ROWS = 10;
const COLS = 10;

export const Board = () => {
  const generateRandomRow = (): SquareType[] => {
    return Array.from(new Array(10), () => ({
      value: 0,
      isBomb: Math.floor(Math.random() * 5) === 0,
      uncovered: false,
    }));
  };
  const computeAdjacent = (b: SquareType[][]): SquareType[][] => {
    const rows = b.length;
    const cols = b[0].length;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let bombs = 0;
        for (let r = -1; r <= 1; r++) {
          for (let c = -1; c <= 1; c++) {
            if (
              (r === 0 && c === 0) ||
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
  const initialBoard = Array.from(new Array(10), generateRandomRow);

  const removeBomb = (board: SquareType[][], row: number, col: number) => {
    if (row >= 0 && col >= 0 && row < ROWS && col < COLS) {
      board[row][col].isBomb = false;
    }
  };

  const generateBoardWithStart = (row: number, col: number): SquareType[][] => {
    const board = Array.from(new Array(10), generateRandomRow);
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        removeBomb(board, row + r, col + c);
      }
    }
    return board;
  };

  const getNumberCovered = (board: SquareType[][]) => {
    return board.flat().filter((value) => !value.uncovered).length;
  };
  const getNumberBombs = (board: SquareType[][]) => {
    return board.flat().filter((value) => value.isBomb).length;
  };

  const [board, setBoard] = React.useState(computeAdjacent(initialBoard));
  const [isWin, setWin] = React.useState(false);
  const [isLose, setLose] = React.useState(false);
  const [gameStarted, setGameStarted] = React.useState(false);
  React.useEffect(() => {
    if (getNumberBombs(board) === getNumberCovered(board)) {
      setWin(true);
    }
  }, [board]);

  const uncoverSquare = (row: number, col: number) => () => {
    if (!gameStarted) {
      setGameStarted(true);
      const initializedBoard = computeAdjacent(
        generateBoardWithStart(row, col)
      );
      uncoverAdjacentBlanks(initializedBoard, row, col);
      initializedBoard[row][col].uncovered = true;
      setBoard(initializedBoard);
      return;
    }
    if (board[row][col].uncovered) return;
    if (board[row][col].isBomb) {
      setLose(true);
      uncoverAll();
    }
    const boardCopy = board.map((a) => a.slice());
    uncoverAdjacentBlanks(boardCopy, row, col);
    boardCopy[row][col].uncovered = true;
    setBoard(boardCopy);
  };

  const uncoverAll = () => {
    setBoard(
      board.map((row) =>
        row.map((square) => {
          square.uncovered = true;
          return square;
        })
      )
    );
  };

  const uncoverAdjacentBlanks = (
    b: SquareType[][],
    row: number,
    col: number
  ): void => {
    const rows = b.length;
    const cols = b[0].length;
    const uncoverAdjacent = (r: number, c: number) => {
      const uncover = (r: number, c: number) => {
        if (r < 0 || r >= rows || c < 0 || c >= cols) return;
        if (b[r][c].value !== 0) {
          b[r][c].uncovered = true;
        }
      };
      uncover(r - 1, c);
      uncover(r + 1, c);
      uncover(r, c - 1);
      uncover(r, c + 1);
      uncover(r - 1, c - 1);
      uncover(r + 1, c - 1);
      uncover(r - 1, c + 1);
      uncover(r + 1, c + 1);
    };
    let toUncover: { row: number; col: number }[] = [];
    const dfs = (r: number, c: number) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols) return;
      if (!b[r][c].uncovered && b[r][c].value === 0 && !b[r][c].isBomb) {
        b[r][c].uncovered = true;
        toUncover.push({ row: r, col: c });
        dfs(r - 1, c);
        dfs(r + 1, c);
        dfs(r, c - 1);
        dfs(r, c + 1);
      }
    };
    dfs(row, col);
    toUncover.map(({ row, col }) => uncoverAdjacent(row, col));
  };

  return (
    <div className="Board">
      {isLose && "You lose"}
      {!isLose && isWin && "You win!!!!"}
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
