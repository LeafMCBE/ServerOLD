import { Server, Client, Version } from "bedrock-protocol";
import { Logger } from "./console/Logger";
import { Plugins } from "./plugins/Plugins";
import CCS from "./console/ConsoleCommandSender";
import Player from "./api/Player";

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
