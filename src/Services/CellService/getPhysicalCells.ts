import mongoose from "mongoose";
import { DB_URI } from "../../constants.js";
import CellModel from "../../Schemas/cellSchema.js";
import type IRobot from "../../ts/Interfaces/IRobot";
import type { GetPhysicalCellsReqBody } from "../../ts/types/CellRequestBody.js";
import type ServiceResponse from "../../ts/types/ServiceResponse";
import createServiceResponse from "../createServiceResponse.js";

const getPhysicalCells = async (
  { ownerId, cellsIds }: GetPhysicalCellsReqBody,
  robot: IRobot,
): Promise<ServiceResponse> => {
  try {
    await mongoose.connect(DB_URI);

    cellsIds.forEach(async (cellId) => {
      await robot.getOneCellContent(cellId);

      const cell = await CellModel.findOneAndUpdate(
        { id: cellId, ownerId: ownerId },
        { description: "None", isOccupied: false },
      );

      if (!cell) {
        throw new Error(`Cell not found. Invalid cellId: ${cellId}`);
        // return createServiceResponse(
        //   false,
        //   500,
        //   `Cell not found. Invalid cellId: ${cellId}`
        // );
      }
    });

    await mongoose.disconnect();
  } catch (error) {
    return createServiceResponse(false, 500, String(error));
  }

  return createServiceResponse(true, 200, "", {
    message: "Getting stuff from cells successfully",
  });
};

export default getPhysicalCells;
