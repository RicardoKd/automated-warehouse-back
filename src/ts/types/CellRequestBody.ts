export type GetPhysicalCellsReqBody = {
  ownerId: string;
  cellsIds: [];
};

export type PutPhysicalCellsReqBody = {
  ownerId: string;
  cellsDescriptions: [];
  quantityOfCellsToBeUsed: number;
};

export type RentCellsReqBody = {
  ownerId: string;
  rentEndDate: string;
  quantityOfCellsToBeUsed: number;
};
