import type { FastifyInstance } from "fastify/types/instance";
import RobotController from "src/Controllers/robotControllers";

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} server encapsulated fastify instance
 */

const robotRoutes = async (server: FastifyInstance) => {
  server.get("/robot/position", RobotController.getPosition);
};

export default robotRoutes;
