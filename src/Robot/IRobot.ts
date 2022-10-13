import type IPosition from "../Types/IPosition";

export default interface IRobot {
  getCurrentPosition(): IPosition;
  getKmDriven(): number;
  getCellContent(cellsIds: number[]): Promise<boolean>;
  getOneCellContent(cellId: number): Promise<boolean>;
  putInCells(cellsIds: number[]): Promise<boolean>;
  putInCell(cellId: number): Promise<boolean>;
}
