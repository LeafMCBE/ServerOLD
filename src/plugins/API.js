import { Logger } from "../api/Logger.js";
import srv from "../../start.js";

export default (options) => {
  return {
    getLogger: () =>
      new Logger({ name: options.name, debug: srv.config.debug, plugin: true }),
    getServer: () => srv,
  };
};