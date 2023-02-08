import { Client } from "bedrock-protocol";

declare class Player {
  public readonly client: Client;
  constructor(client: Client);

  public readonly kick(reason: string): void;
  public readonly send(text: string): void;
}

export default Player;