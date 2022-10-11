import type IWarehouseServer from "./Server/IWarehouseServer";
import WarehouseServer from "./Server/WarehouseServer.js";

const srv: IWarehouseServer = new WarehouseServer();

srv.signUp("Babushka", "babuska@gmail.com", "babysiya").then((data) => {
  console.log("data=" + data);
});

// srv.rentCells(4, "633ed2b731c57889c7d60157").then((data) => console.log("data=" + data));
