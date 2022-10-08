import { Schema, model } from "mongoose";
import type ICustomer from "../Customer/ICustomer";

export const customerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const CustomerModel = model("customers", customerSchema);

export default CustomerModel;
