import type { FastifyReply, FastifyRequest } from "fastify";
import CustomerService from "../Services/CustomerService/CustomerService.js";

// login
const getUser = async (
  request: FastifyRequest & { body: { email: string; password: string } },
  reply: FastifyReply,
) => {
  const { success, status, message } = await CustomerService.getUser(
    request.body,
  );

  reply.header("Content-Type", "application/json").status(status);

  if (success) {
    return reply.send({ message });
  }

  return reply.send({ message });
};

// signup
const createUser = async (
  request: FastifyRequest & {
    body: { name: string; email: string; password: string };
  },
  reply: FastifyReply,
) => {
  const { success, status, message } = await CustomerService.createUser(
    request.body,
  );

  reply.header("Content-Type", "application/json").status(status);

  if (success) {
    return reply.send({ message });
  }

  return reply.send({ message });
};

const CustomerController = {
  getUser,
  createUser,
};

export default CustomerController;
