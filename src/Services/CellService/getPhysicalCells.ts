import mongoose from "mongoose";
import { DB_URI } from "../../constants.js";
import CellModel from "../../Schemas/cellSchema.js";
import type IRobot from "../../ts/Interfaces/IRobot";
import type { GetPhysicalCellsReqBody } from "../../ts/types/CellRequestBody.js";
import type ServiceResponse from "../../ts/types/ServiceResponse";
import createServiceResponse from "../createServiceResponse.js";

const getPhysicalCells = async (
  { cellsIds }: GetPhysicalCellsReqBody,
  robot: IRobot,
): Promise<ServiceResponse> => {
  try {
    await Promise.all(
      cellsIds.map(async (cellId) => {
        await mongoose.connect(DB_URI);
        const cell = await CellModel.findOneAndUpdate(
          { id: cellId },
          { description: "None", isOccupied: false },
        );

        await robot.getOneCellContent(cellId);

        if (!cell) {
          throw new Error(`Cell not found. Invalid cellId: ${cellId}`);
        }

        await mongoose.disconnect();
      }),
    );

    return createServiceResponse(true, 200, "", {
      message: "Getting stuff from cells successfully",
    });
  } catch (error) {
    return createServiceResponse(false, 500, String(error));
  }
};

export default getPhysicalCells;
