import mongoose from "mongoose";
import { DB_URI } from "../../constants.js";
import CustomerModel from "../../Schemas/customerSchema.js";
import type { SignUpReqBody } from "../../ts/types/CustomerRequestBody.js";
import type ServiceResponse from "../../ts/types/ServiceResponse.js";
import createServiceResponse from "../createServiceResponse.js";
import generateOwnerId from "../generateOwnerId.js";

const createUser = async ({
  name,
  email,
  password,
}: SignUpReqBody): Promise<ServiceResponse> => {
  try {
    await mongoose.connect(DB_URI);

    if (await CustomerModel.findOne({ email })) {
      throw new Error("User already registered");
    }

    const newCustomerId = generateOwnerId();

    const newCustomer = new CustomerModel({
      _id: newCustomerId,
      name,
      email,
      password,
    });

    await newCustomer.save();

    await mongoose.disconnect();
  } catch (error) {
    return createServiceResponse(false, 409, String(error));
  }

  return createServiceResponse(true, 201, "", {
    message: "New customer is saved",
  });
};

export default createUser;
