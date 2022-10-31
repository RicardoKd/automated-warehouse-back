import type { FastifyInstance } from "fastify/types/instance";
import { CUSTOMER_REQUEST_OPTIONS, CUSTOMER_ROUTES } from "../constants.js";
import CustomerController from "../Controllers/CustomerController.js";
import type {
  LogInReqBody,
  SignUpReqBody,
} from "../ts/types/CustomerRequestBody.js";

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} server encapsulated fastify instance
 */
const customerRoutes = async (server: FastifyInstance) => {
  server.post<{
    Body: LogInReqBody;
  }>(
    CUSTOMER_ROUTES.LOG_IN,
    CUSTOMER_REQUEST_OPTIONS.LOG_IN,
    CustomerController.getUser,
  );

  server.post<{
    Body: SignUpReqBody;
  }>(
    CUSTOMER_ROUTES.SIGN_UP,
    CUSTOMER_REQUEST_OPTIONS.SIGN_UP,
    CustomerController.createUser,
  );
};

export default customerRoutes;
