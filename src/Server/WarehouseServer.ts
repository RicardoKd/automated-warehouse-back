import mongoose, { Types } from "mongoose";

import fastify from "fastify";
import cors from "@fastify/cors";

import type Position from "../ts/types/Position";

import type IWarehouseServer from "./IWarehouseServer";

import type ICell from "src/ts/Interfaces/ICell";

import Robot from "../Robot/Robot.js";

import CustomerModel from "../Schemas/customerSchema.js";
import CellModel from "../Schemas/cellSchema.js";

import { PORT, DB_URI, RESERVED_DEFAULT_OWNER_ID } from "../constants.js";
import type ICustomer from "src/ts/Interfaces/ICustomer";

// import cellRoutes from "../routes/cellRoutes.js";
import customerRoutes from "../routes/customerRoutes.js";
import generalRoutes from "../routes/generalRoutes.js";
import robotRoutes from "../routes/robotRoutes.js";

export default class WarehouseServer implements IWarehouseServer {
  private server;

  // TODO: Queue for commands for the robot
  // private robotTasks: IQueue;

  // TODO: Method for fastify server startup ???

  // TODO: How to store error messages and codes ???

  constructor() {
    this.server = fastify();

    this.server.decorate("robot", new Robot());

    this.server.register(generalRoutes);
    this.server.register(customerRoutes);
    this.server.register(robotRoutes);
    this.server.register(cors, {
      credentials: true,
      origin: "*",
    });

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

      const newCustomerId = this.generateOwnerId();

      const newCustomer = new CustomerModel({
        _id: newCustomerId,
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
    rentEndDate: Date,
    ownerId: Types.ObjectId | string,
  ): Promise<boolean> {
    try {
      if (!this.checkCustomerPay()) {
        console.log("Can`t pay!");

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
        await CellModel.findOneAndUpdate(
          { id: freeCells[i]?.id },
          {
            ownerId,
            rentEndDate,
          },
        );
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
        await this.server.robot.getOneCellContent(cellId);
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
    ownerId: Types.ObjectId | string,
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
        await this.server.robot.putInCell(rentedCells[i]?.id as number);
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
    customerId: Types.ObjectId | string,
  ): Promise<ICell[] | null> {
    filter.ownerId = customerId;

    return await this.getCellsInfoOrNull(filter);
  }

  getRobotPosition(): Position {
    return this.server.robot.getCurrentPosition();
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
