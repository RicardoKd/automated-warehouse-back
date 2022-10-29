import {
  ROBOT_BASE_POSITION,
  ROBOT_SPEED_MS_PER_M,
  ROBOT_SPEED_TO_LOAD_UNLOAD_CELL,
  WAREHOUSE_SIZE,
} from "../constants.js";
import type IRobot from "../ts/Interfaces/IRobot";
import type Position from "../ts/types/Position";

export default class Robot implements IRobot {
  private kmDriver: number;
  private position: Position;
  private cellPostitioningMatrix: Position[];

  constructor() {
    this.kmDriver = 0;
    this.position = { ...ROBOT_BASE_POSITION };
    this.cellPostitioningMatrix = this.generateCellPostitioningMatrix();
  }

  async getCellContent(cellsIds: number[]): Promise<boolean> {
    try {
      cellsIds.forEach(async (cellId) => {
        await this.driveToCell(cellId);
        await this.timeToLoadUnloadCell();
        await this.driveToBasePosition();
        await this.timeToLoadUnloadCell();
      });

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async getOneCellContent(cellId: number): Promise<boolean> {
    try {
      await this.driveToCell(cellId);
      await this.timeToLoadUnloadCell();
      await this.driveToBasePosition();
      await this.timeToLoadUnloadCell();

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async putInCells(cellsIds: number[]): Promise<boolean> {
    try {
      cellsIds.forEach(async (cellId) => {
        await this.driveToBasePosition();
        await this.timeToLoadUnloadCell();
        await this.driveToCell(cellId);
        await this.timeToLoadUnloadCell();
      });

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async putInCell(cellId: number): Promise<boolean> {
    try {
      await this.driveToBasePosition();
      await this.timeToLoadUnloadCell();
      await this.driveToCell(cellId);
      await this.timeToLoadUnloadCell();

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  getCurrentPosition(): Position {
    return this.position;
  }

  getKmDriven(): number {
    return this.kmDriver;
  }

  private async driveToCell(cellId: number) {
    const targetRow = Number(this.cellPostitioningMatrix[cellId]?.row);
    const targetColumn = Number(this.cellPostitioningMatrix[cellId]?.column);

    // check if the robot is already on the targetRow
    if (this.position.row !== targetRow) {
      // move to col[0]
      while (this.position.column !== 0) {
        await this.moveLeft();
      }

      // move to the targetRow
      while (this.position.row !== targetRow) {
        if (this.position.row > targetRow) {
          await this.moveBackward();
        } else {
          await this.moveForward();
        }
      }
    }

    // move to the targetColumn
    while (this.position.column !== targetColumn) {
      if (this.position.column > targetColumn) {
        await this.moveLeft();
      } else {
        await this.moveRight();
      }
    }
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

  private generateCellPostitioningMatrix(): Position[] {
    /**
     * Creates an array of IPosition objects for each cell.
     * The index of each object corresponds to Cell.id
     */
    const cellPositions: Position[] = [];

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
}
