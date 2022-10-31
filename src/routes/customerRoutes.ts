import type { FastifyInstance } from "fastify/types/instance";
import type {
  LogInReqBody,
  SignUpReqBody,
} from "../ts/types/CustomerRequestBody.js";
import CustomerController from "../Controllers/CustomerController.js";

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
    Body: LogInReqBody;
  }>(routes.logIn, options.logIn, CustomerController.getUser);

  server.post<{
    Body: SignUpReqBody;
  }>(routes.signUp, options.signUp, CustomerController.createUser);
};

export default customerRoutes;
