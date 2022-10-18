import type { Types } from "mongoose";
import type ICell from "../Cell/ICell";

export default interface ICustomerServer {
  signUp(name: string, email: string, password: string): Promise<boolean>;
  logIn(email: string, password: string): Promise<boolean>;
  rentCells(
    quantityOfCells: number,
    rentEndDate: Date,
    ownerId: Types.ObjectId,
  ): Promise<boolean>;
  getCellContent(
    cellsIds: number[],
    customerId: Types.ObjectId,
  ): Promise<boolean>;
  putContentInCells(
    quantityOfCellsToBeUsed: number,
    ownerId: Types.ObjectId,
    cellsDescriptions: string[],
  ): Promise<boolean>;
  getCustomersCellsInfoOrNull(
    filter: object,
    customerId: Types.ObjectId,
  ): Promise<ICell[] | null>;
}
