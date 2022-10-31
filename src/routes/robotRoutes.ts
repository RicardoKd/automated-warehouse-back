import type { FastifyInstance } from "fastify/types/instance";
import { ROBOT_ROUTES } from "../constants.js";
import RobotController from "../Controllers/RobotController.js";

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} server encapsulated fastify instance
 */
const robotRoutes = async (server: FastifyInstance) => {
  server.get(ROBOT_ROUTES.POSITION, RobotController.getPosition);
};

export default robotRoutes;
