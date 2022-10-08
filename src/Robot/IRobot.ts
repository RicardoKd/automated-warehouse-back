import type IPosition from "./IPosition";

export default interface IRobot {
  getCurrentPosition(): IPosition;
  getKmDriven(): number;
  moveForward(): void;
  moveBack(): void;
  moveRight(): void;
  moveLeft(): void;
}
