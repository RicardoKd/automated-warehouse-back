import mongoose from "mongoose";
import { DB_URI, RESERVED_DEFAULT_OWNER_ID } from "../../constants.js";
import CellModel from "../../Schemas/cellSchema.js";
import type ICell from "../../ts/Interfaces/ICell";
import type ServiceResponse from "../../ts/types/ServiceResponse";
import checkCustomerPay from "../checkCustomerPay.js";
import createServiceResponse from "../createServiceResponse.js";

const rentCells = async ({
  ownerId,
  rentEndDate,
  quantityOfCellsToBeUsed,
}: {
  ownerId: string;
  rentEndDate: string;
  quantityOfCellsToBeUsed: number;
}): Promise<ServiceResponse> => {
  console.log(quantityOfCellsToBeUsed, ownerId);

  try {
    if (checkCustomerPay()) {
      return createServiceResponse(false, 500, "Can`t pay!");
    }

    await mongoose.connect(DB_URI);

    const freeCells: ICell[] | null = await CellModel.find({
      ownerId: RESERVED_DEFAULT_OWNER_ID,
    }).lean();

    if (!freeCells || freeCells.length < quantityOfCellsToBeUsed) {
      return createServiceResponse(
        false,
        500,
        `There are not enough free cells for your order. There are only ${freeCells} free cells`,
      );
    }

    for (let i = 0; i < quantityOfCellsToBeUsed; i++) {
      console.log(`times added: ${i}`);
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
