import { Base } from "../../../src/base/BasePlugin.js";
import Colors from "../../../src/api/Colors.js";

class Welcomer extends Base {
  constructor() {
    super({
      name: "Welcomer",
      version: [1, 0, 0],
      srvVersion: [1, 19, 50],
    });
  }

  onEnable() {
    this.api.getLogger().info("The plugin had been enabled");
  }

  /**
   *
   * @param {import('bedrock-protocol').Client} player
   */
  onPlayerJoin(player) {
    this.api.getServer().broadcast(Colors.yellow(`${player.username} joined`));
  }

  /**
   *
   * @param {import('bedrock-protocol').Client} player
   */
  onPlayerLeave(player) {
    this.api
      .getServer()
      .broadcast(player, Colors.yellow(`${player.username} left`));
    this.api.getLogger().info(Colors.yellow(`${player.username} left`, true));
  }
}

export default Welcomer;
