import Server from "../Server";
import { Logger } from "../console/Logger";
import Player from "../api/Player";

interface Options {
  name: string;
  aliases: string[];
  args: {
    min: number;
    max: number;
  };
}

export declare class Command {
  public readonly options: Options;
  public readonly api: {
    getLogger: () => Logger;
    getServer: () => Server;
  };

  constructor(options: Options);

  public run(args: string[]): void;
  public runAsPlayer(player: Player, args: string[]): void;
}
