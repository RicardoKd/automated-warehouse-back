import mongoose from "mongoose";
import { DB_URI } from "../../constants.js";
import CellModel from "../../Schemas/cellSchema.js";
import type ICell from "../../ts/Interfaces/ICell";
import type ServiceResponse from "../../ts/types/ServiceResponse";
import createServiceResponse from "../createServiceResponse.js";

const getCells = async (filter: ICell): Promise<ServiceResponse> => {
  let queryResult: ICell[];

  try {
    await mongoose.connect(DB_URI);

    queryResult = await CellModel.find({ ...filter}).lean();

    await mongoose.disconnect();
  } catch (error) {
    return createServiceResponse(false, 500, String(error));
  }

  return createServiceResponse(true, 200, "", {
    queryResult,
    message: "Putting stuff into cells successfully",
  });
};

export default getCells;
