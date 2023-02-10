import { Server, Client, Version } from "bedrock-protocol";
import { Logger } from "./console/Logger";
import { Plugins } from "./plugins/Plugins";

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

  constructor();

  public broadcast(client: Client, message: string): void;
}
