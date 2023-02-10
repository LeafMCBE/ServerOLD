import { Logger } from "../console/Logger";
import Server from "../Server";

declare function API(): {
  getLogger: () => Logger;
  getServer: () => Server;
};

export default API;
