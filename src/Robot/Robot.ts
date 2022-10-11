import type IRobot from "./IRobot";
import type IPosition from "./IPosition";
import {
  WAREHOUSE_SIZE,
  ROBOT_BASE_POSITION,
  ROBOT_SPEED_MS_PER_M,
  ROBOT_SPEED_TO_LOAD_UNLOAD_CELL,
} from "../constants.js";

export default class Robot implements IRobot {
  private kmDriver: number;
  private position: IPosition;
  private cellPostitioningMatrix: IPosition[];

  constructor() {
    this.kmDriver = 0;
    this.position = { ...ROBOT_BASE_POSITION };
    this.cellPostitioningMatrix = this.generateCellPostitioningMatrix();
  }

  async getFromCell(cellsIds: number[]): Promise<void> {
    cellsIds.forEach(async (cellId) => {
      await this.driveToCell(cellId);
      await this.timeToLoadUnloadCell();
      await this.driveToBasePosition();
      await this.timeToLoadUnloadCell();
    });
  }

  putInCell(cellId: number): void {
    throw new Error("Method not implemented.");
  }

  private async driveToCell(cellId: number) {
    // let robotIsBusy = false;

    // check if the robot is correctly aligned relatively to the row
    if (this.position.row !== this.cellPostitioningMatrix[cellId]?.row) {
      // move to col[0]
      while (this.position.column !== 0) {
        await this.moveLeft();
      }

      // move to the needed row
      while (this.position.row !== this.cellPostitioningMatrix[cellId]?.row) {
        const currentRowGreaterThanNeeded: boolean =
          this.position.row > Number(this.cellPostitioningMatrix[cellId]?.row);

        if (currentRowGreaterThanNeeded) {
          await this.moveBackward();
        } else {
          await this.moveForward();
        }
      }
    }
    // align according to the column
  }

  private async driveToBasePosition() {
    while (this.position.column !== 0) {
      await this.moveLeft();
    }

    while (this.position.row !== 0) {
      await this.moveBackward();
    }
  }

  private async moveForward(): Promise<void> {
    try {
      if (this.position.row <= 0) {
        throw new Error("Robot can't move forward");
      }

      this.position.row++;
      await this.timeToCrossOneCell();
    } catch (error) {
      console.log(error);
    }
  }

  private async moveBackward(): Promise<void> {
    try {
      if (this.position.row <= 0) {
        throw new Error("Robot can't move backward");
      }

      this.position.row--;
      await this.timeToCrossOneCell();
    } catch (error) {
      console.log(error);
    }
  }

  private async moveRight(): Promise<void> {
    try {
      if (this.position.column >= WAREHOUSE_SIZE.COLUMNS) {
        throw new Error("Robot can't move right");
      }

      this.position.column++;
      await this.timeToCrossOneCell();
    } catch (error) {
      console.log(error);
    }
  }

  private async moveLeft(): Promise<void> {
    try {
      if (this.position.column <= 0) {
        throw new Error("Robot can't move left");
      }

      this.position.column--;
      await this.timeToCrossOneCell();
    } catch (error) {
      console.log(error);
    }
  }

  private generateCellPostitioningMatrix(): IPosition[] {
    const cellPositions: IPosition[] = [];

    let k = 1;

    /*
      j starts with 1, because the first column (col[0]) is reserved for the robot movement
    */
    for (let i = 0; i < WAREHOUSE_SIZE.ROWS; i++) {
      for (let j = 1; j <= WAREHOUSE_SIZE.COLUMNS; j++) {
        cellPositions[k] = { row: i, column: j };
        k++;
      }
    }

    return cellPositions;
  }

  private timeToCrossOneCell() {
    return new Promise((resolve) => setTimeout(resolve, ROBOT_SPEED_MS_PER_M));
  }

  private timeToLoadUnloadCell() {
    return new Promise((resolve) =>
      setTimeout(resolve, ROBOT_SPEED_TO_LOAD_UNLOAD_CELL),
    );
  }

  getCurrentPosition(): IPosition {
    return this.position;
  }

  getKmDriven(): number {
    return this.kmDriver;
  }
}
