import type IPosition from "./IPosition";

export default interface IRobot {
  getCurrentPosition(): IPosition;
  getKmDriven(): number;
  getFromCell(cellsIds: number[]): Promise<void>;
  putInCell(cellId: number): void;
}
