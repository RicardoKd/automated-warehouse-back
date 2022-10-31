import cors from "@fastify/cors";
import fastify, { FastifyInstance } from "fastify";
import { PORT } from "../constants.js";
import Robot from "../Robot/Robot.js";
import cellRoutes from "../routes/cellRoutes.js";
import customerRoutes from "../routes/customerRoutes.js";
import generalRoutes from "../routes/generalRoutes.js";
import robotRoutes from "../routes/robotRoutes.js";

const Server = (): FastifyInstance => {
  // TODO: Queue for commands for the robot
  // private robotTasks: IQueue;

  // TODO: Method for fastify server startup ???

  // TODO: How to store error messages and codes ???

  const server = fastify();

  server.decorate("robot", new Robot());

  server.register(generalRoutes);
  server.register(customerRoutes);
  server.register(robotRoutes);
  server.register(cellRoutes);
  server.register(cors, {
    credentials: true,
    origin: "*",
  });

  server.listen({ port: PORT }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`Server listening at ${address}`);
  });

  return server;
};

export default Server;
