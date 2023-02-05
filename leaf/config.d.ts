import { ServerOptions } from "bedrock-protocol";

export interface Configure extends ServerOptions {
  debug?: boolean;
  notCrashOnPluginError: boolean;
}

export const config: Configure;
