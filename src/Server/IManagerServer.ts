import type ICell from "../Cell/ICell";
import type IPosition from "../Types/IPosition";

export default interface IManagerServer {
  getRobotPosition(): IPosition;
  getCellsInfoOrNull(filter: object): Promise<ICell[] | null>;
  logIn(email: string, password: string): Promise<boolean>;
}
