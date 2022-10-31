import type { FastifyReply, FastifyRequest } from "fastify";
import CellService from "../Services/CellService/CellService.js";
import type {
  GetPhysicalCellsReqBody,
  PutPhysicalCellsReqBody,
  RentCellsReqBody,
} from "../ts/types/CellRequestBody.js";

const getCells = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> => {
  const { success, status, errorMessage, payload } = await CellService.getCells(
    {},
  ); // TODO: pass query here

  reply.header("Content-Type", "application/json").status(status);

  if (success) {
    return reply.send({ payload });
  }

  return reply.send({ errorMessage });
};

const rentCells = async (
  request: FastifyRequest & {
    body: RentCellsReqBody;
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
    body: PutPhysicalCellsReqBody;
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
    body: GetPhysicalCellsReqBody;
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
