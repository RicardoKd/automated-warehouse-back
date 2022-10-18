import mongoose, { Types } from "mongoose";

import fastify from "fastify";
import fs from "fs";

import type IPosition from "../Types/IPosition";

import type IWarehouseServer from "./IWarehouseServer";

import type ICell from "src/Cell/ICell";

import type IRobot from "../Robot/IRobot";
import Robot from "../Robot/Robot.js";

import CustomerModel from "../Schemas/customerSchema.js";
import CellModel from "../Schemas/cellSchema.js";

import { PORT, DB_URI, RESERVED_DEFAULT_OWNER_ID } from "../constants.js";
import type ICustomer from "src/Customer/ICustomer";

export default class WarehouseServer implements IWarehouseServer {
  private server;
  private robot: IRobot;

  // TODO: Queue for commands for the robot
  // private robotTasks: IQueue;

  // TODO: Method for fastify server startup ???
  // TODO: How to use db roles for security ???

  constructor() {
    this.robot = new Robot();
    this.server = fastify();

    this.server.listen({ port: PORT }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log(`Server listening at ${address}`);
    });

    this.initGetRequests();
    this.initPostRequests();
  }

  async signUp(
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> {
    try {
      await mongoose.connect(DB_URI);

      if (await CustomerModel.findOne({ email })) {
        // res.status(400).send("User already registered.");
        throw new Error("user already exists. Sign up not possible");
      }

      const newCustomer = new CustomerModel({
        _id: this.generateOwnerId(),
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
      // res.status(500).send("Something went wrong");

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
    rentEndDate: Date,
    ownerId: Types.ObjectId,
  ): Promise<boolean> {
    try {
      if (!this.checkCustomerPay()) {
        return false;
      }

      await mongoose.connect(DB_URI);

      const freeCells: ICell[] | null = await CellModel.find({
        ownerId: RESERVED_DEFAULT_OWNER_ID,
      }).lean();

      if (!freeCells || freeCells.length < quantityOfCells) {
        throw new Error(
          `There are not enough free cells for your order. There are only ${freeCells} free cells`,
        );
      }

      for (let i = 0; i < quantityOfCells; i++) {
        await CellModel.findByIdAndUpdate(freeCells[i]?.id, {
          ownerId,
          rentEndDate,
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

  async getCellsInfoOrNull(filter: object): Promise<ICell[] | null> {
    try {
      await mongoose.connect(DB_URI);

      const allCells: ICell[] = await CellModel.find(filter).lean();

      await mongoose.disconnect();

      return allCells;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async getCustomersCellsInfoOrNull(
    filter: ICell,
    customerId: Types.ObjectId,
  ): Promise<ICell[] | null> {
    // (filter as { ownerId: Types.ObjectId }).ownerId = customerId;

    filter.ownerId = customerId;

    return await this.getCellsInfoOrNull(filter);
  }

  getRobotPosition(): IPosition {
    return this.robot.getCurrentPosition();
  }

  private initGetRequests() {
    this.server.get("/robot-position", () => {
      return this.getRobotPosition();
    });

    this.server.get("/all-cells-info", async () => {
      return await this.getCellsInfoOrNull({});
    });

    this.server.get("/cells-info/:", async () => {
      return await this.getCellsInfoOrNull({});
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
    const opts = {
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
    };

    this.server.post<{ Body: { email: string; password: string } }>(
      "/signIn",
      opts,
      async (request) => {
        // (this as ICustomerServer).logIn(request.body.email, request.body.password);

        const { email, password } = request.body;

        return { email, password };
      },
    );

    //signUp, logIn, rentCells, getFromCells, putInCells
  }

  private checkCustomerPay(): boolean {
    /**
     * This method emulates the amount of money on customer's account.
     * It randoly determines if there are enough money.
     */
    return Boolean(Math.round(Math.random()));
  }

  private generateOwnerId(): Types.ObjectId {
    let newOwnerId = new Types.ObjectId();

    while (newOwnerId.toString() === RESERVED_DEFAULT_OWNER_ID) {
      newOwnerId = new Types.ObjectId();
    }

    return newOwnerId;
  }
}
