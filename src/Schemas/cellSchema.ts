import { Schema, model } from "mongoose";
import type ICell from "../Cell/ICell";

export const CellSchema = new Schema<ICell>({
  id: { type: Number, required: true },
  ownerId: { type: Schema.Types.ObjectId, required: true, ref: "Customer" },
  description: { type: String, required: true },
  isOccupied: { type: Boolean, required: true },
});

const CellModel = model("cells", CellSchema);

export default CellModel;
