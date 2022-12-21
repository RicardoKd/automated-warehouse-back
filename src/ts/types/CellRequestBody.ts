export type GetPhysicalCellsReqBody = {
  ownerId: string;
  cellsIds: number[];
};

export type PutPhysicalCellsReqBody = {
  ownerId: string;
  cellsDescriptions: string[];
};

export type RentCellsReqBody = {
  ownerId: string;
  rentEndDate: string;
  quantityOfCellsToBeUsed: number;
};
