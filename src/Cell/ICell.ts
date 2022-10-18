import type { Types } from "mongoose";
export default interface ICell {
  id: number;
  ownerId: Types.ObjectId;
  description: string;
  isOccupied: boolean;
  rentEndDate: Date;

  rentingDaysLeft(): number;
}
