import type { FastifyInstance } from "fastify/types/instance";
import CellController from "../Controllers/CellController.js";

const rootRoute = "/cells/";

const routes = {
  get: rootRoute,
  rent: rootRoute + "rent",
  putPhysicalCell: rootRoute + "putPhysicalCell",
  getPhysicalCell: rootRoute + "getPhysicalCell",
};

const options = {
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
};

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 */
const cellRoutes = async (server: FastifyInstance) => {
  server.get(routes.get, CellController.getCells);

  server.post<{
    Body: {
      quantityOfCellsToBeUsed: number;
      rentEndDate: string;
      ownerId: string;
    };
  }>(routes.rent, CellController.rentCells);

  server.post<{
    Body: {
      ownerId: string;
      cellsDescriptions: [];
      quantityOfCellsToBeUsed: number;
    };
  }>(
    routes.putPhysicalCell,
    options.putPhysicalCell,
    CellController.putPhysicalCells,
  );

  server.post<{
    Body: {
      ownerId: string;
      cellsIds: [];
    };
  }>(
    routes.getPhysicalCell,
    options.getPhysicalCell,
    CellController.getPhysicalCells,
  );
};

export default cellRoutes;
