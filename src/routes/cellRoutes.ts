import type { FastifyInstance } from "fastify/types/instance";
import type {
  GetPhysicalCellsReqBody,
  PutPhysicalCellsReqBody,
  RentCellsReqBody,
} from "../ts/types/CellRequestBody.js";
import CellController from "../Controllers/CellController.js";

const rootRoute = "/cells/";

const routes = {
  get: rootRoute,
  getPhysicalCell: rootRoute + "getPhysicalCell",
  putPhysicalCell: rootRoute + "putPhysicalCell",
  rent: rootRoute + "rent",
};

const options = {
  getPhysicalCell: {
    schema: {
      body: {
        type: "object",
        required: ["cellsIds", "ownerId"],
        properties: {
          cellsIds: { type: "array" },
          ownerId: { type: "string" },
        },
      },
    },
  },
  putPhysicalCell: {
    schema: {
      body: {
        type: "object",
        required: ["ownerId", "cellsDescriptions", "quantityOfCellsToBeUsed"],
        properties: {
          ownerId: { type: "string" },
          cellsDescriptions: { type: "array" },
          quantityOfCellsToBeUsed: { type: "number" },
        },
      },
    },
  },
  rent: {
    schema: {
      body: {
        type: "object",
        required: ["quantityOfCellsToBeUsed", "rentEndDate", "ownerId"],
        properties: {
          quantityOfCellsToBeUsed: { type: "number" },
          rentEndDate: { type: "string" },
          ownerId: { type: "string" },
        },
      },
    },
  },
};

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 */
const cellRoutes = async (server: FastifyInstance) => {
  server.get(routes.get, CellController.getCells);

  server.post<{
    Body: RentCellsReqBody;
  }>(routes.rent, CellController.rentCells);

  server.post<{
    Body: PutPhysicalCellsReqBody;
  }>(
    routes.putPhysicalCell,
    options.putPhysicalCell,
    CellController.putPhysicalCells,
  );

  server.post<{
    Body: GetPhysicalCellsReqBody;
  }>(
    routes.getPhysicalCell,
    options.getPhysicalCell,
    CellController.getPhysicalCells,
  );
};

export default cellRoutes;
