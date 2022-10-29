import type { FastifyInstance } from "fastify/types/instance";
import CustomerController from "../Controllers/customerController.js";

const rootRoute = "/customer/";

const routes = {
  logIn: rootRoute + "logIn",
  signUp: rootRoute + "signUp",
};

const options = {
  signUp: {
    schema: {
      body: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
        },
      },
    },
  },
  logIn: {
    schema: {
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string" },
          password: { type: "string" },
        },
      },
    },
  },
};

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} server encapsulated fastify instance
 */
const customerRoutes = async (server: FastifyInstance) => {
  server.post<{
    Body: { name: string; email: string; password: string };
  }>(routes.signUp, options.signUp, CustomerController.createUser);

  server.post<{
    Body: { email: string; password: string };
  }>(routes.logIn, options.logIn, CustomerController.getUser);
};

export default customerRoutes;
