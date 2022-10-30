import mongoose from "mongoose";
import { DB_URI, RESERVED_DEFAULT_OWNER_ID } from "../../constants.js";
import CellModel from "../../Schemas/cellSchema.js";
import type ICell from "../../ts/Interfaces/ICell.js";
import type ServiceResponse from "../../ts/types/ServiceResponse.js";
import checkCustomerPay from "../checkCustomerPay.js";
import createServiceResponse from "../createServiceResponse.js";

const rentCells = async ({
  ownerId,
  rentEndDate,
  quantityOfCellsToBeUsSed,
}: {
  ownerId: string;
  rentEndDate: string;
  quantityOfCellsToBeUsSed: number;
}): Promise<ServiceResponse> => {
  try {
    if (checkCustomerPay()) {
      return createServiceResponse(false, 500, "Can`t pay!");
    }

    await mongoose.connect(DB_URI);

    const freeCells: ICell[] | null = await CellModel.find({
      ownerId: RESERVED_DEFAULT_OWNER_ID,
    }).lean();

    if (!freeCells || freeCells.length < quantityOfCellsToBeUsSed) {
      return createServiceResponse(
        false,
        500,
        `There are not enough free cells for your order. There are only ${freeCells} free cells`,
      );
    }

    for (let i = 0; i < quantityOfCellsToBeUsSed; i++) {
      await CellModel.findOneAndUpdate(
        { id: freeCells[i]?.id },
        {
          ownerId,
          rentEndDate,
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
