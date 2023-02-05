import { Base } from "../../src/plugins/BasePlugin.js";
import chalk from "chalk";

class Welcomer extends Base {
  constructor() {
    super({
      name: "Welcomer",
      version: [1, 0, 0],
      srvVersion: [1, 19, 50],
    });
  }

  /**
   *
   * @param {import('bedrock-protocol').Client} player
   */
  onPlayerJoin(player) {
    player.queue("text", {
      type: "chat",
      needs_transation: false,
      source_name: "",
      xuid: "",
      platform_chat_id: "",
      message: `§e${player.username} joined`,
    });
    console.log(
      `[${chalk.blue("INFO")}] [Welcomer] ${chalk.yellow(
        `${player.username} joined`
      )}`
    );
  }
}

export default Welcomer;
