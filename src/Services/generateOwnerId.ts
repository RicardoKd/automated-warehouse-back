import { Types } from "mongoose";
import { RESERVED_DEFAULT_OWNER_ID } from "../constants.js";

const generateOwnerId = (): Types.ObjectId => {
  let newOwnerId = new Types.ObjectId();

  while (newOwnerId.toString() === RESERVED_DEFAULT_OWNER_ID) {
    newOwnerId = new Types.ObjectId();
  }

  return newOwnerId;
};

export default generateOwnerId;
