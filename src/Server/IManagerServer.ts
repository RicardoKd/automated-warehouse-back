import type ICell from "../ts/Interfaces/ICell";
import type Position from "../ts/types/Position";

export default interface IManagerServer {
  getRobotPosition(): Position;
  getCellsInfoOrNull(filter: object): Promise<ICell[] | null>;
  logIn(email: string, password: string): Promise<boolean>;
}
