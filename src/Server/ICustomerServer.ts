export default interface ICustomerServer {
  signUp(name: string, email: string, password: string): Promise<boolean>;
  logIn(email: string, password: string): Promise<boolean>;
  rentCells(quantityOfCells: number): void;
  getFromCells(cellsIds: number[]): void;
  putInCells(quantityOfCells: number): boolean;
}
