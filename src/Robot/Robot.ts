import type IRobot from "./IRobot";
import type IPosition from "./IPosition";
import { ROBOT_BASE_POSITION } from "../constants.js";

export default class Robot implements IRobot {
  private kmDriver: number;
  private position: IPosition;

  constructor() {
    this.kmDriver = 0;
    this.position = { ...ROBOT_BASE_POSITION };
  }

  getCurrentPosition(): IPosition {
    return this.position;
  }

  getKmDriven(): number {
    return this.kmDriver;
  }

  moveForward(): void {
    throw new Error("Method not implemented.");
  }

  moveBack(): void {
    throw new Error("Method not implemented.");
  }

  moveRight(): void {
    throw new Error("Method not implemented.");
  }

  moveLeft(): void {
    throw new Error("Method not implemented.");
  }
}
