import type ICustomerServer from "./ICustomerServer";
import type IManagerServer from "./IManagerServer";

export default interface IWarehouseServer extends ICustomerServer, IManagerServer {}
