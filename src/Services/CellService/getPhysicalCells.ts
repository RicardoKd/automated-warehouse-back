import mongoose from "mongoose";
import type IRobot from "../../ts/Interfaces/IRobot.js";
import { DB_URI } from "../../constants.js";
import CellModel from "../../Schemas/cellSchema";
import type ICell from "../../ts/Interfaces/ICell";
import type ServiceResponse from "../../ts/types/ServiceResponse.js";
import createServiceResponse from "../createServiceResponse.js";

const getPhysicalCells = async (
  {
    ownerId,
    cellsIds,
  }: {
    ownerId: string;
    cellsIds: [];
  },
  robot: IRobot,
): Promise<ServiceResponse> => {
  try {
    await mongoose.connect(DB_URI);

    cellsIds.forEach(async (cellId) => {
      await robot.getOneCellContent(cellId);

      const cell: ICell | null = await CellModel.findOneAndUpdate(
        { id: cellId, ownerId: ownerId },
        { description: "None", isOccupied: false },
      ).lean(); // is lean() needed here ???

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
