import type IWarehouseServer from "./Server/IWarehouseServer";
import WarehouseServer from "./Server/WarehouseServer.js";

const srv: IWarehouseServer = new WarehouseServer();

srv.signUp("buffalo", "buffalo@gmail.com", "buff").then((data) => {
  console.log("data=" + data);
});
