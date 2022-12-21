import mongoose from "mongoose";
import { DB_URI, RESERVED_DEFAULT_OWNER_ID } from "../../constants.js";
import CellModel from "../../Schemas/cellSchema.js";
import CustomerModel from "../../Schemas/customerSchema.js";
import type { RentCellsReqBody } from "../../ts/types/CellRequestBody.js";
import type ServiceResponse from "../../ts/types/ServiceResponse";
import checkCustomerPay from "../checkCustomerPay.js";
import createServiceResponse from "../createServiceResponse.js";

const rentCells = async ({
  ownerId,
  rentEndDate,
  quantityOfCellsToBeUsed,
}: RentCellsReqBody): Promise<ServiceResponse> => {
  try {
    if (!checkCustomerPay()) {
      return createServiceResponse(false, 470, "Can`t pay!");
    }

    await mongoose.connect(DB_URI);

    if (!(await CustomerModel.findById(ownerId))) {
      return createServiceResponse(false, 500, `User doesn't exist`);
    }

    const freeCells = await CellModel.find({
      ownerId: RESERVED_DEFAULT_OWNER_ID,
    }).lean();

    if (!freeCells || freeCells.length < quantityOfCellsToBeUsed) {
      return createServiceResponse(
        false,
        471,
        `There are not enough free cells for your order. There are only ${freeCells} free cells`,
      );
    }

    for (let i = 0; i < quantityOfCellsToBeUsed; i++) {
      await CellModel.findOneAndUpdate(
        { id: freeCells[i]?.id },
        {
          ownerId,
          rentEndDate: new Date(rentEndDate),
        },
      );
    }

    await mongoose.disconnect();
  } catch (error) {
    return createServiceResponse(false, 500, String(error));
  }

  return createServiceResponse(true, 200, "", {
    message: "Rented succesfully",
  });
};

export default rentCells;
