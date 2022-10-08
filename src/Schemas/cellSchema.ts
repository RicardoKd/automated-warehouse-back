import { Schema } from "mongoose";
import type ICell from "../Cell/ICell";

const customerSchema = new Schema<ICell>({
  ownerId: { type: Number, required: true },
  description: { type: String, required: true },
  isOccupied: { type: Boolean, required: true },
});

export default customerSchema;
