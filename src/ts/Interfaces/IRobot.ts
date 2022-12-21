import type Position from "../types/Position";

export default interface IRobot {
  getCurrentPosition(): Position;
  getKmDriven(): number;
  getOneCellContent(cellId: number): Promise<boolean>;
  putInCell(cellId: number): Promise<boolean>;
}
