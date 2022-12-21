import mongoose from "mongoose";
import { DB_URI } from "../../constants.js";
import CellModel from "../../Schemas/cellSchema.js";
import type IRobot from "../../ts/Interfaces/IRobot";
import type { PutPhysicalCellsReqBody } from "../../ts/types/CellRequestBody.js";
import type ServiceResponse from "../../ts/types/ServiceResponse";
import createServiceResponse from "../createServiceResponse.js";

const putPhysicalCell = async (
  { ownerId, cellsDescriptions }: PutPhysicalCellsReqBody,
  robot: IRobot,
): Promise<ServiceResponse> => {
  try {
    const quantityOfCellsToBeUsed = cellsDescriptions.length;

    await mongoose.connect(DB_URI);

    const rentedCells = await CellModel.find({
      ownerId,
      isOccupied: false,
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

    await Promise.all(
      cellsDescriptions.map(async (_description, i) => {
        console.log("1) rentedCells[i].id=" + rentedCells[i]?.id);
        await CellModel.findByIdAndUpdate(rentedCells[i]?._id, {
          description: cellsDescriptions[i],
          isOccupied: true,
        });
        console.log("2) rentedCells[i].id=" + rentedCells[i]?.id);
        const a = await robot.putInCell(rentedCells[i]?.id as number);

        console.log(a);

        console.log("3) rentedCells[i].id=" + rentedCells[i]?.id);
      }),
    );
    console.log("end");
    await mongoose.disconnect();
  } catch (error) {
    return createServiceResponse(false, 500, String(error));
  }

  return createServiceResponse(true, 200, "", {
    message: "Putting stuff into cells successfully",
  });
};

export default putPhysicalCell;
