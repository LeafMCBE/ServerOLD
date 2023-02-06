import { Logger } from "../api/Logger";
import Server from "../Server";
import { BaseOptions } from "./BasePlugin";

declare function API(options: BaseOptions): {
  getLogger: () => Logger;
  getServer: () => Server;
};

export default API;
