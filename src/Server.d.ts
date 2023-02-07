import { Server, Client } from "bedrock-protocol";
import { Configure } from "../leaf/config";
import { Logger } from "./api/Logger";
import { Plugins } from "./plugins/Plugins";

export default class {
  public readonly config: Configure;
  public readonly logger: Logger;
  public readonly srv: Server;
  public readonly plugins: Plugins;

  constructor();

  public broadcast(client: Client, message: string): void;
}
