import type { FastifyReply, FastifyRequest } from "fastify";
import RobotService from "src/Services/RobotService/RobotService";

const getPosition = (
  request: FastifyRequest,
  reply: FastifyReply,
): FastifyReply => {
  const { success, status, errorMessage, payload } = RobotService.getPosition(
    request.server.robot,
  );

  reply.header("Content-Type", "application/json").status(status);

  if (success) {
    return reply.send({ payload });
  }

  return reply.send({ errorMessage });
};

const RobotController = {
  getPosition,
};

export default RobotController;
