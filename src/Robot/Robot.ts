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

  async getOneCellContent(cellId: number): Promise<boolean> {
    try {
      await this.driveToCell(cellId);
      await this.LoadUnloadCell();
      await this.driveToBasePosition();
      await this.LoadUnloadCell();

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async putInCell(cellId: number): Promise<boolean> {
    console.log(`cellId=${cellId}`);
    try {
      await this.driveToBasePosition();
      await this.LoadUnloadCell();
      await this.driveToCell(cellId);
      await this.LoadUnloadCell();
      await this.driveToBasePosition();

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
    console.log("start drive");
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
      if (this.position.row >= WAREHOUSE_SIZE.ROWS) {
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

    let cellId = 0;

    /*
      columnIndex starts with 1, because the first column (col[0]) is reserved for the robot movement
    */
    for (let rowIndex = 0; rowIndex < WAREHOUSE_SIZE.ROWS; rowIndex++) {
      for (
        let columnIndex = 1;
        columnIndex < WAREHOUSE_SIZE.COLUMNS;
        columnIndex++
      ) {
        cellPositions[cellId] = { row: rowIndex, column: columnIndex };
        cellId++;
      }
    }

    return cellPositions;
  }

  private timeToCrossOneCell() {
    return new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, ROBOT_SPEED_MS_PER_M),
    );
  }

  private LoadUnloadCell() {
    return new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
        console.log("load end");
      }, ROBOT_SPEED_TO_LOAD_UNLOAD_CELL),
    );
  }
}
