import type IPosition from "./Types/IPosition";

const ROBOT_BASE_POSITION: IPosition = {
  row: 0,
  column: 0,
};

const WAREHOUSE_SIZE = {
  ROWS: 50,
  COLUMNS: 50,
};

const ROBOT_SPEED_MS_PER_M = 1000;

const ROBOT_SPEED_TO_LOAD_UNLOAD_CELL = 5000;

const PORT = 8080;

const DB_URI = "mongodb://127.0.0.1:27017/local";

const ERRORS = {
  SIGN_UP_FAILED: { TEXT: "CAN'T SIGN UP", CODE: 1 },
};

export {
  ROBOT_BASE_POSITION,
  WAREHOUSE_SIZE,
  ROBOT_SPEED_MS_PER_M,
  ROBOT_SPEED_TO_LOAD_UNLOAD_CELL,
  PORT,
  DB_URI,
  ERRORS,
};
