import type { FastifyReply, FastifyRequest } from "fastify";

const getPosition = async (_request: FastifyRequest, reply: FastifyReply) => {
  const robotPosition = server.robot.getCurrentPosition();

  reply.status(200).send({ success: true, robotPosition });

  if (success) {
    return reply.send({ message });
  }

  return reply.send({ message });
};

const RobotController = {
  getPosition,
};

export default RobotController;
