import { Client } from "bedrock-protocol";
import Server from "../Server";

export interface BaseOptions {
  name: string;
  version: [number, number, number];
  srvVersion: [number, number, number];
}

export declare class Base {
  public readonly api: {
    getLogger: () => Logger;
    getServer: () => Server;
  };
  public readonly options: BaseOptions;

  constructor(options: BaseOptions): void;

  onEnable(): void;
  onDisable(): void;
  onPlayerJoin(player: Client): void;
  onPlayerLeave(player: Client): void;
  onPlayerHavingAllRps(): void;
  onPlayerRefusedRps(): void;
  onPlayerInstalledRps(): void;
}
