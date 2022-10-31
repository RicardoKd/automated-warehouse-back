import type { FastifyInstance } from "fastify/types/instance";
import { CELL_REQUEST_OPTIONS, CELL_ROUTES } from "../constants.js";
import CellController from "../Controllers/CellController.js";
import type {
  GetPhysicalCellsReqBody,
  PutPhysicalCellsReqBody,
  RentCellsReqBody,
} from "../ts/types/CellRequestBody.js";

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 */
const cellRoutes = async (server: FastifyInstance) => {
  server.get(CELL_ROUTES.GET, CellController.getCells);

  server.post<{
    Body: RentCellsReqBody;
  }>(CELL_ROUTES.RENT, CELL_REQUEST_OPTIONS.RENT, CellController.rentCells);

  server.post<{
    Body: PutPhysicalCellsReqBody;
  }>(
    CELL_ROUTES.PUT_PHYSICAL_CELL,
    CELL_REQUEST_OPTIONS.PUT_PHYSICAL_CELL,
    CellController.putPhysicalCells,
  );

  server.post<{
    Body: GetPhysicalCellsReqBody;
  }>(
    CELL_ROUTES.GET_PHYSICAL_CELL,
    CELL_REQUEST_OPTIONS.GET_PHYSICAL_CELL,
    CellController.getPhysicalCells,
  );
};

export default cellRoutes;
