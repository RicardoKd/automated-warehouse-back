import fastify from "fastify";
import type IRobot from "src/Robot/IRobot";

declare module "fastify" {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse,
  > {
    robot: IRobot;
  }
}
