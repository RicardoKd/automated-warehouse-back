import type { Types } from "mongoose";
import type ICell from "../ts/Interfaces/ICell";

export default interface ICustomerServer {
  signUp(name: string, email: string, password: string): Promise<boolean>;
  logIn(email: string, password: string): Promise<boolean>;
  rentCells(
    quantityOfCells: number,
    rentEndDate: Date,
    ownerId: Types.ObjectId | string,
  ): Promise<boolean>;
  getCellContent(
    cellsIds: number[],
    customerId: Types.ObjectId,
  ): Promise<boolean>;
  putContentInCells(
    quantityOfCellsToBeUsed: number,
    ownerId: Types.ObjectId | string,
    cellsDescriptions: string[],
  ): Promise<boolean>;
  getCustomersCellsInfoOrNull(
    filter: object,
    customerId: Types.ObjectId | string,
  ): Promise<ICell[] | null>;
}
