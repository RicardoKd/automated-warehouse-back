import type { Types } from "mongoose";
export default interface ICustomer {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
}
