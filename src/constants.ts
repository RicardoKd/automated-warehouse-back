import type Position from "./ts/types/Position";

const ROBOT_BASE_POSITION: Position = {
  row: 0,
  column: 0,
};

const RESERVED_COLUMN_FOR_ROBOT_MOVEMENT = 1;

const WAREHOUSE_SIZE = Object.freeze({
  ROWS: 15,
  COLUMNS: 15 + RESERVED_COLUMN_FOR_ROBOT_MOVEMENT,
});

const ROBOT_SPEED_MS_PER_M = 1000;

const ROBOT_SPEED_TO_LOAD_UNLOAD_CELL = 5000;

const PORT = 8080;

const DB_URI = "mongodb://127.0.0.1:27017/local";

const MAX_TIMESTAMP = 8640000000000000;

const RESERVED_DEFAULT_OWNER_ID = "633ed2b731c57889c7d60156";

const ROOT_ROUTES = Object.freeze({
  CUSTOMER: "/customer",
  CELL: "/cells",
  ROBOT: "/robot",
});

const CUSTOMER_ROUTES = Object.freeze({
  LOG_IN: ROOT_ROUTES.CUSTOMER + "/logIn",
  SIGN_UP: ROOT_ROUTES.CUSTOMER + "/signUp",
});

const CELL_ROUTES = Object.freeze({
  GET:
    String(ROOT_ROUTES.CELL) + ":id:ownerId:description:isOccupied:rentEndDate",
  GET_PHYSICAL_CELL: ROOT_ROUTES.CELL + "/getPhysicalCell",
  PUT_PHYSICAL_CELL: ROOT_ROUTES.CELL + "/putPhysicalCell",
  RENT: ROOT_ROUTES.CELL + "/rent",
});

const ROBOT_ROUTES = Object.freeze({
  POSITION: ROOT_ROUTES.ROBOT + "/position",
});

const CUSTOMER_REQUEST_OPTIONS = Object.freeze({
  LOG_IN: {
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
  SIGN_UP: {
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
});

const CELL_REQUEST_OPTIONS = Object.freeze({
  GET_PHYSICAL_CELL: {
    schema: {
      body: {
        type: "object",
        required: ["cellsIds", "ownerId"],
        properties: {
          cellsIds: { type: "array" },
          ownerId: { type: "string" },
        },
      },
    },
  },
  PUT_PHYSICAL_CELL: {
    schema: {
      body: {
        type: "object",
        required: ["ownerId", "cellsDescriptions", "quantityOfCellsToBeUsed"],
        properties: {
          ownerId: { type: "string" },
          cellsDescriptions: { type: "array" },
          quantityOfCellsToBeUsed: { type: "number" },
        },
      },
    },
  },
  RENT: {
    schema: {
      body: {
        type: "object",
        required: ["quantityOfCellsToBeUsed", "rentEndDate", "ownerId"],
        properties: {
          quantityOfCellsToBeUsed: { type: "number" },
          rentEndDate: { type: "string" },
          ownerId: { type: "string" },
        },
      },
    },
  },
});

export {
  ROBOT_BASE_POSITION,
  WAREHOUSE_SIZE,
  ROBOT_SPEED_MS_PER_M,
  ROBOT_SPEED_TO_LOAD_UNLOAD_CELL,
  PORT,
  DB_URI,
  MAX_TIMESTAMP,
  RESERVED_DEFAULT_OWNER_ID,
  CUSTOMER_ROUTES,
  CELL_ROUTES,
  ROBOT_ROUTES,
  CUSTOMER_REQUEST_OPTIONS,
  CELL_REQUEST_OPTIONS,
};
