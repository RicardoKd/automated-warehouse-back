import type ICell from "../Cell/ICell";
import type IPosition from "../Robot/IPosition";

export default interface IManagerServer {
  getRobotPosition(): IPosition;
  getInfoAboutAllCells(): Promise<ICell[]>;
  logIn(email: string, password: string): Promise<boolean>;
}
