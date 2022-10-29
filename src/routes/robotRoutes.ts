import type { FastifyInstance } from "fastify/types/instance";
import RobotController from "../Controllers/robotController.js";

const rootRoute = "/robot/";

const routes = {
  position: rootRoute + "position",
};

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} server encapsulated fastify instance
 */

const robotRoutes = async (server: FastifyInstance) => {
  server.get(routes.position, RobotController.getPosition);
};

export default robotRoutes;
