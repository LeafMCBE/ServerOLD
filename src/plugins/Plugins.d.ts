import { Base } from "./BasePlugin";

export declare class Plugins {
  all: BasePlugin[];

  public validate(): void;
  public async load(): Base[];
  private createDir(): void;
}
