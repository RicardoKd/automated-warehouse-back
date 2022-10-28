import { Schema, model } from "mongoose";
import { MAX_TIMESTAMP } from "../constants.js";
import type ICell from "../ts/Interfaces/ICell";

export const CellSchema = new Schema<ICell>(
  {
    id: { type: Number, required: true },
    ownerId: { type: Schema.Types.ObjectId, required: true, ref: "Customer" },
    description: { type: String, required: true, default: "None", trim: true },
    isOccupied: { type: Boolean, required: true, default: false },
    rentEndDate: {
      type: Schema.Types.Date,
      required: true,
      default: new Date(MAX_TIMESTAMP),
      min: Date.now(),
    },
  },
  {
    methods: {
      rentingDaysLeft(): number {
        const msInDay = 24 * 60 * 60 * 1000;
        const differenceInMs: number = this.rentEndDate.getTime() - Date.now();

        return Math.round(Math.abs(differenceInMs) / msInDay);
      },
    },
  },
);

const CellModel = model("cells", CellSchema);

export default CellModel;
