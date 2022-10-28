import type { FastifyInstance } from "fastify/types/instance";

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} server encapsulated fastify instance
 */

const robotRoutes = async (server: FastifyInstance) => {
  server.get("/robot/position", (request, reply) => {
    const robotPosition = server.robot.getCurrentPosition();

    reply.status(200).send({ success: true, robotPosition });
  });
};

export default robotRoutes;
