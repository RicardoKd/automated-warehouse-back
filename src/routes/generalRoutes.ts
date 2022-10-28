import type { FastifyInstance } from "fastify/types/instance";

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} server encapsulated fastify instance
 */
const generalRoutes = async (server: FastifyInstance) => {
  server.get("/*", (_request, reply) => {
    reply
      .code(404)
      .header("Content-Type", "application/json")
      .send({ message: "No such route", code: 403 });
  });
};

export default generalRoutes;
