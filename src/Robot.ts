import type IRobot from "./IRobot";
import { BASE_POSITION } from "./constants";

export default class Robot implements IRobot {
  kmDriver: number;
  position: { row: number; column: number };

  constructor() {
    this.kmDriver = 0;
    this.position = BASE_POSITION;
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
