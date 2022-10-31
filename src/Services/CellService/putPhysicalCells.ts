import mongoose from "mongoose";
import { DB_URI } from "../../constants.js";
import CellModel from "../../Schemas/cellSchema.js";
import type IRobot from "../../ts/Interfaces/IRobot";
import type { PutPhysicalCellsReqBody } from "../../ts/types/CellRequestBody.js";
import type ServiceResponse from "../../ts/types/ServiceResponse";
import createServiceResponse from "../createServiceResponse.js";

const putPhysicalCell = async (
  {
    ownerId,
    cellsDescriptions,
    quantityOfCellsToBeUsed,
  }: PutPhysicalCellsReqBody,
  robot: IRobot,
): Promise<ServiceResponse> => {
  try {
    if (quantityOfCellsToBeUsed !== cellsDescriptions.length) {
      return createServiceResponse(
        false,
        500,
        `Descriptions must be provided for eaach cell. Not enough descriptions`,
      );
    }

    await mongoose.connect(DB_URI);

    const rentedCells = await CellModel.find({
      ownerId,
    }).lean();

    if (!rentedCells) {
      return createServiceResponse(
        false,
        500,
        `You need ${quantityOfCellsToBeUsed} more cells to rent`,
      );
    }

    if (rentedCells.length < quantityOfCellsToBeUsed) {
      return createServiceResponse(
        false,
        500,
        `You need ${
          quantityOfCellsToBeUsed - rentedCells.length
        } more cells to rent`,
      );
    }

    for (let i = 0; i < quantityOfCellsToBeUsed; i++) {
      await robot.putInCell(rentedCells[i]?.id as number);
      await CellModel.findByIdAndUpdate(rentedCells[i]?.id, {
        description: cellsDescriptions[i],
        isOccupied: true,
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    return createServiceResponse(false, 500, String(error));
  }

  return createServiceResponse(true, 200, "", {
    message: "Putting stuff into cells successfully",
  });
};

export default putPhysicalCell;
