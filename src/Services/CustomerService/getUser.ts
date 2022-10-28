import mongoose from "mongoose";
import type IServiceResponse from "src/Types/IServiceResponse.js";
import { DB_URI } from "../../constants.js";
import type ICustomer from "../../Customer/ICustomer";
import CustomerModel from "../../Schemas/customerSchema.js";
import createServiceResponse from "../createServiceResponse.js";

const getUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<IServiceResponse> => {
  try {
    await mongoose.connect(DB_URI);

    const customer: ICustomer | null = await CustomerModel.findOne({ email });

    await mongoose.disconnect();

    if (!customer) {
      throw new Error("User not found");
    }

    if (customer.password !== password) {
      throw new Error("Wrong password");
    }
  } catch (error) {
    return createServiceResponse(false, 500, String(error));
  }

  return createServiceResponse(true, 200);
};

export default getUser;
