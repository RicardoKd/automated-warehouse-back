import type { FastifyReply, FastifyRequest } from "fastify";
import CustomerService from "../Services/CustomerService/CustomerService.js";
import type {
  LogInReqBody,
  SignUpReqBody
} from "../ts/types/CustomerRequestBody.js";

const getUser = async (
  request: FastifyRequest & { body: LogInReqBody },
  reply: FastifyReply,
): Promise<FastifyReply> => {
  const { success, status, errorMessage, payload } =
    await CustomerService.getUser(request.body);

  reply.header("Content-Type", "application/json").status(status);

  if (success) {
    return reply.send({ payload });
  }

  return reply.send({ errorMessage });
};

const createUser = async (
  request: FastifyRequest & {
    body: SignUpReqBody;
  },
  reply: FastifyReply,
): Promise<FastifyReply> => {
  const { success, status, errorMessage, payload } =
    await CustomerService.createUser(request.body);

  reply.header("Content-Type", "application/json").status(status);

  if (success) {
    return reply.send({ payload });
  }

  return reply.send({ errorMessage });
};

const CustomerController = {
  getUser,
  createUser,
};

export default CustomerController;
