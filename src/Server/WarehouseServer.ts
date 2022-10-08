import mongoose from "mongoose";

import fastify from "fastify";
import fs from "fs";

import type IPosition from "../Robot/IPosition";

import type IWarehouseServer from "./IWarehouseServer";

import type ICell from "src/Cell/ICell";

import type IRobot from "../Robot/IRobot";
import Robot from "../Robot/Robot.js";

import CustomerModel from "../Schemas/customerSchema.js";

import { PORT, DB_URI, ERRORS } from "../constants.js";
import type ICustomer from "src/Customer/ICustomer";

export default class WarehouseServer implements IWarehouseServer {
  private server;
  private robot: IRobot;

  constructor() {
    this.robot = new Robot();
    this.server = fastify();

    this.initGetRequests();

    this.server.listen({ port: PORT }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log(`Server listening at ${address}`);
    });
  }

  async signUp(name: string, email: string, password: string) {
    try {
      await mongoose.connect(DB_URI);

      if (await CustomerModel.findOne({ email })) {
        throw new Error("user already exists. Sign up not possible");
      }

      const newCustomer = new CustomerModel({ name, email, password });

      await newCustomer.save();
      await mongoose.disconnect();

      console.log("New customer is saved");

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  async logIn(email: string, password: string): Promise<boolean> {
    try {
      await mongoose.connect(DB_URI);

      const customer: ICustomer | null = await CustomerModel.findOne({ email });

      await mongoose.disconnect();

      if (!customer) {
        throw new Error("User not found");
      }

      if (customer.password !== password) {
        throw new Error("Wrong password");
      }

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }

    // return mongoose.model('Animal').find({ type: this.type }
  }

  rentCells(quantityOfCells: number): void {
    throw new Error("Method not implemented.");
  }

  getFromCells(cellsIds: number[]): void {
    throw new Error("Method not implemented.");
  }

  putInCells(quantityOfCells: number): boolean {
    throw new Error("Method not implemented.");
  }

  getAllCells(): ICell[] {
    throw new Error("Method not implemented.");
  }

  getRobotPosition(): IPosition {
    return this.robot.getCurrentPosition();
  }

  private initGetRequests() {
    this.server.get("/ping", async (req) => {
      return req;
    });

    this.server.get("/", async () => {
      return "This is the main page\n";
    });

    this.server.get("/bg.png", (req, reply) => {
      fs.readFile("./BG-3.jpg", (err, fileBuffer) => {
        reply.type("image/jpeg");
        reply.send(err || fileBuffer);
      });
    });

    this.server.get("/manager", async () => {
      return "This should return a login page for the manager\n";
    });
  }

  // private initPostRequests() {
  //   this.server.post("signUp", () => {
  //     return "This should return a login page for the manager\n";
  //   });
  // }
}
