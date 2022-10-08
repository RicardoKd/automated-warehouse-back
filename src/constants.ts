import type IPosition from "./Robot/IPosition";

const ROBOT_BASE_POSITION: IPosition = {
  row: 0,
  column: 0,
};

const PORT = 8080;

const DB_URI = "mongodb://127.0.0.1:27017/local";

const ERRORS = {
  SIGN_UP_FAILED: { TEXT: "CAN'T SIGN UP", CODE: 1 },
};

export { ROBOT_BASE_POSITION, PORT, DB_URI, ERRORS };
