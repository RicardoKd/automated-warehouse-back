import cors from "@fastify/cors";
import fastify from "fastify";
import { PORT } from "../constants.js";
import Robot from "../Robot/Robot.js";
import cellRoutes from "../routes/cellRoutes.js";
import customerRoutes from "../routes/customerRoutes.js";
import generalRoutes from "../routes/generalRoutes.js";
import robotRoutes from "../routes/robotRoutes.js";

export default class WarehouseServer {
  private server;

  // TODO: Queue for commands for the robot
  // private robotTasks: IQueue;

  // TODO: Method for fastify server startup ???

  // TODO: How to store error messages and codes ???

  constructor() {
    this.server = fastify();

    this.server.decorate("robot", new Robot());

    this.server.register(generalRoutes);
    this.server.register(customerRoutes);
    this.server.register(robotRoutes);
    this.server.register(cellRoutes);
    this.server.register(cors, {
      credentials: true,
      origin: "*",
    });

    this.server.listen({ port: PORT }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log(`Server listening at ${address}`);
    });
  }
}
