import type Position from "../types/Position";

export default interface IRobot {
  getCurrentPosition(): Position;
  getKmDriven(): number;
  getCellContent(cellsIds: number[]): Promise<boolean>;
  getOneCellContent(cellId: number): Promise<boolean>;
  putInCells(cellsIds: number[]): Promise<boolean>;
  putInCell(cellId: number): Promise<boolean>;
}
