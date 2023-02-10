import { Command } from "../base/BaseCommand.js";

class Say extends Command {
  constructor() {
    super({
      name: "say",
      aliases: ["broadcast"],
    });
  }

  run(args) {
    if (!args)
      return this.api.getLogger().error("There is message to say/broadcast.");
    this.api.getServer().broadcast(args.join(" "));
  }
}

export default Say;
