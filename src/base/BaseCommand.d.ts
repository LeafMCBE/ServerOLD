import Server from "../Server";
import { Logger } from "../console/Logger";

interface Options {
  name: string;
  aliases: string[];
}

export declare class Command {
  public readonly options: Options;
  public readonly api: {
    getLogger: () => Logger;
    getServer: () => Server;
  };

  constructor(options: Options);

  public run(args: string[]): void;
}
