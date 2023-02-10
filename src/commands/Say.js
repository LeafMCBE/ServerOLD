import { Command } from "../base/BaseCommand.js";

class Say extends Command {
  constructor() {
    super({
      name: "say",
      aliases: ["broadcast"],
      args: {
        min: 1,
        max: 1,
      },
    });
  }

  run(args) {
    if (!args)
      return this.api.getLogger().error("There is message to say/broadcast.");
    this.api.getServer().broadcast(args.join(" "));
  }

  /**
   *
   * @param {import('../api/Player').default} player
   * @param {string[]} args
   */
  runAsPlayer(_player, args) {
    this.api.getServer().broadcast(args.join(" "));
  }
}

export default Say;
