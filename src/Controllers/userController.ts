import type { FastifyReply, FastifyRequest } from "fastify";
import CustomerService from "../Services/CustomerService";

// login
const getUser = async (
  request: FastifyRequest & { body: { email: string; password: string } },
  reply: FastifyReply,
) => {
  const { success, status, errorMessage } = await CustomerService.getUser(
    request.body,
  );

  reply.header("Content-Type", "application/json").status(status);

  if (success) {
    console.log("New customer is saved");

    return reply.send({});
  }

  return reply.send({ errorMessage });
};

// signup
const createUser = async (
  request: FastifyRequest & {
    body: { name: string; email: string; password: string };
  },
  reply: FastifyReply,
) => {
  const { success, status, errorMessage } = await CustomerService.createUser(
    request.body,
  );

  reply.header("Content-Type", "application/json").status(status);

  if (success) {
    return reply.send({});
  } else {
    return reply.send({ errorMessage });
  }
};

const UserController = {
  getUser,
  createUser,
};

export default UserController;
