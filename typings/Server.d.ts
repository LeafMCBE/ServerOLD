import { Server, Client, Version } from "bedrock-protocol";
import { Logger } from "../src/console/Logger";
import { Plugins } from "../src/plugins/Plugins";
import CCS from "../src/console/ConsoleCommandSender";
import Player from "../src/api/Player";

interface Configure {
  Server: {
    host: string;
    port: number;
    motd: string;
    version: Version;
  };
  LeafMCBE: {
    debug: boolean;
    showDateOnLogging: boolean;
  };
}

export default class {
  public readonly config: Configure;
  public readonly logger: {
    srv: Logger;
    plugin: Logger;
    chat: Logger;
  };
  public readonly srv: Server;
  public readonly plugins: Plugins;
  public readonly console: CCS;
  public readonly clients: Player[];

  constructor();

  public broadcast(message: string): void;
}
