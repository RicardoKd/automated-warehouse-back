import type { FastifyReply, FastifyRequest } from "fastify";
import CellService from "../Services/CellService/CellService.js";

const getCells = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> => {
  const { success, status, errorMessage, payload } =
    await CellService.getCells({}); // TODO: pass query here

  reply.header("Content-Type", "application/json").status(status);

  if (success) {
    return reply.send({ payload });
  }

  return reply.send({ errorMessage });
};

const rentCells = async (
  request: FastifyRequest & {
    body: {
      ownerId: string;
      rentEndDate: string;
      quantityOfCellsToBeUsSed: number;
    };
  },
  reply: FastifyReply,
): Promise<FastifyReply> => {
  const { success, status, errorMessage, payload } =
    await CellService.rentCells(request.body);

  reply.header("Content-Type", "application/json").status(status);

  if (success) {
    return reply.send({ payload });
  }

  return reply.send({ errorMessage });
};

const putPhysicalCells = async (
  request: FastifyRequest & {
    body: {
      ownerId: string;
      cellsDescriptions: [];
      quantityOfCellsToBeUsed: number;
    };
  },
  reply: FastifyReply,
): Promise<FastifyReply> => {
  const { success, status, errorMessage, payload } =
    await CellService.putPhysicalCells(request.body, request.server.robot);

  reply.header("Content-Type", "application/json").status(status);

  if (success) {
    return reply.send({ payload });
  }

  return reply.send({ errorMessage });
};

const getPhysicalCells = async (
  request: FastifyRequest & {
    body: { ownerId: string; cellsIds: [] };
  },
  reply: FastifyReply,
): Promise<FastifyReply> => {
  const { success, status, errorMessage, payload } =
    await CellService.getPhysicalCells(request.body, request.server.robot);

  reply.header("Content-Type", "application/json").status(status);

  if (success) {
    return reply.send({ payload });
  }

  return reply.send({ errorMessage });
};

const CellController = {
  rentCells,
  getCells,
  putPhysicalCells,
  getPhysicalCells,
};

export default CellController;
