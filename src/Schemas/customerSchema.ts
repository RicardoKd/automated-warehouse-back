import { Schema, model } from "mongoose";
import type ICustomer from "../Customer/ICustomer";

export const CustomerSchema = new Schema<ICustomer>({
  _id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const CustomerModel = model("customers", CustomerSchema);

export default CustomerModel;
