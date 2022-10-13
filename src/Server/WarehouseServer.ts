import mongoose from "mongoose";
import { Types } from "mongoose";

import fastify from "fastify";
import fs from "fs";

import type IPosition from "../Robot/IPosition";

import type IWarehouseServer from "./IWarehouseServer";

import type ICell from "src/Cell/ICell";

import type IRobot from "../Robot/IRobot";
import Robot from "../Robot/Robot.js";

import CustomerModel from "../Schemas/customerSchema.js";
import CellModel from "../Schemas/cellSchema.js";

import { PORT, DB_URI } from "../constants.js";
import type ICustomer from "src/Customer/ICustomer";

export default class WarehouseServer implements IWarehouseServer {
  private server;
  private robot: IRobot;

  // TODO: Queue for commands for the robot
  // private robotTasks: IQueue;

  constructor() {
    this.robot = new Robot();
    this.server = fastify();

    // TODO: write get requests
    this.initGetRequests();

    // TODO: write post requests
    this.initPostRequests();

    this.server.listen({ port: PORT }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log(`Server listening at ${address}`);
    });
  }

  async signUp(
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> {
    try {
      await mongoose.connect(DB_URI);

      if (await CustomerModel.findOne({ email })) {
        throw new Error("user already exists. Sign up not possible");
      }

      const newCustomer = new CustomerModel({
        _id: new Types.ObjectId(),
        name,
        email,
        password,
      });

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
  }

  async rentCells(
    quantityOfCells: number,
    ownerId: Types.ObjectId,
  ): Promise<boolean> {
    try {
      if (!this.checkCustomerPay()) {
        return false;
      }

      await mongoose.connect(DB_URI);

      const freeCells: ICell[] | null = await CellModel.find({
        ownerId: -1,
      }).lean();

      if (!freeCells || freeCells.length < quantityOfCells) {
        throw new Error(
          `There are not enough free cells for your order. There are only ${freeCells} free cells`,
        );
      }

      for (let i = 0; i < quantityOfCells; i++) {
        await CellModel.findByIdAndUpdate(freeCells[i]?.id, {
          ownerId,
        });
      }

      await mongoose.disconnect();

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  async getCellContent(
    cellsIds: number[],
    customerId: Types.ObjectId,
  ): Promise<boolean> {
    try {
      await mongoose.connect(DB_URI);

      cellsIds.forEach(async (cellId) => {
        await this.robot.getOneCellContent(cellId);
        const cell: ICell | null = await CellModel.findOneAndUpdate(
          { id: cellId, ownerId: customerId },
          { description: "None", isOccupied: false },
        ).lean(); // is lean() needed here ???

        if (!cell) {
          throw new Error(`Cell not found. Invalid cellId: ${cellId}`);
        }
      });

      await mongoose.disconnect();

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  async putContentInCells(
    quantityOfCellsToBeUsed: number,
    ownerId: Types.ObjectId,
    cellsDescriptions: string[],
  ): Promise<boolean> {
    try {
      if (quantityOfCellsToBeUsed !== cellsDescriptions.length) {
        throw new Error(
          `Descriptions must be provided for eaach cell. Not enough descriptions`,
        );
      }

      await mongoose.connect(DB_URI);

      const rentedCells: ICell[] | null = await CellModel.find({
        ownerId,
      }).lean();

      if (!rentedCells) {
        throw new Error(
          `You need ${quantityOfCellsToBeUsed} more cells to rent`,
        );
      }

      if (rentedCells.length < quantityOfCellsToBeUsed) {
        const a = quantityOfCellsToBeUsed - rentedCells.length;

        throw new Error(`You need ${a} more cells to rent`);
      }

      for (let i = 0; i < quantityOfCellsToBeUsed; i++) {
        await this.robot.putInCell(rentedCells[i]?.id as number);
        await CellModel.findByIdAndUpdate(rentedCells[i]?.id, {
          description: cellsDescriptions[i],
          isOccupied: true,
        });
      }

      await mongoose.disconnect();

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  async getInfoAboutAllCellsOrNull(): Promise<ICell[] | null> {
    try {
      await mongoose.connect(DB_URI);

      const allCells: ICell[] = await CellModel.find({}).lean();

      await mongoose.disconnect();

      return allCells;
    } catch (error) {
      console.error(error);

      return null;
    }
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

  private initPostRequests() {
    throw new Error("Method not implemented.");
    //signUp, logIn, rentCells, getFromCells, putInCells
  }

  private checkCustomerPay(): boolean {
    /**
     * This method emulates the amount of money on customer's account.
     * It randoly determines if there are enough money.
     */
    return Boolean(Math.round(Math.random()));
  }
}
