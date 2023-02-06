import { Base } from "../../src/plugins/BasePlugin.js";
import Colors from "../../src/api/Colors.js";

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
    this.api
      .getServer()
      .broadcast(player, Colors.yellow(`${player.username} joined`));
    this.api.getLogger().info(Colors.yellow(`${player.username} joined`, true));
  }
}

export default Welcomer;
