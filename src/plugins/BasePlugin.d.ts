import { Client } from "bedrock-protocol";

export interface BaseOptions {
  name: string;
  version: [number, number, number];
  srvVersion: [number, number, number];
}

export declare class Base {
  public readonly options: BaseOptions;

  constructor(options: BaseOptions): void;

  onEnable(): void;
  onDisable(): void;
  onPlayerJoin(player: Client): void;
  onPlayerHavingAllRps(): void;
  onPlayerRefusedRps(): void;
  onPlayerInstalledRps(): void;
}
