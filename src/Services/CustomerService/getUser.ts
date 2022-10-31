import mongoose from "mongoose";
import type ServiceResponse from "src/ts/types/ServiceResponse.js";
import { DB_URI } from "../../constants.js";
import CustomerModel from "../../Schemas/customerSchema.js";
import type { LogInReqBody } from "../../ts/types/CustomerRequestBody.js";
import createServiceResponse from "../createServiceResponse.js";

const getUser = async ({
  email,
  password,
}: LogInReqBody): Promise<ServiceResponse> => {
  try {
    await mongoose.connect(DB_URI);

    const customer = await CustomerModel.findOne({ email });

    await mongoose.disconnect();

    if (!customer) {
      throw new Error("User not found");
    }

    if (customer.password !== password) {
      throw new Error("Wrong password");
    }
  } catch (error) {
    return createServiceResponse(false, 401, String(error));
  }

  return createServiceResponse(true, 200, "", {
    message: "Logged in succesfully",
  });
};

export default getUser;
