export interface SquareType {
  isBomb: boolean;
  value: number;
  uncovered: boolean;
}

export type BoardType = SquareType[][];
