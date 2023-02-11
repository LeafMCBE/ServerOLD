import { Logger } from "../../src/console/Logger";
import Server from "../../src/Server";

declare function API(): {
  getLogger: () => Logger;
  getServer: () => Server;
};

export default API;
