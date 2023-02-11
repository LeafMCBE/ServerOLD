import { Command } from "../base/BaseCommand.js";
import YML from "yaml";
import fs from "fs";

class Ban extends Command {
  constructor() {
    super({
      name: "ban",
      args: {
        min: 1,
        max: 2,
      },
      arguments: [
        {
          name: "player",
          type: "target",
          optional: false,
        },
        {
          name: "reason",
          type: "string",
          optional: true,
        },
      ],
    });
  }

  run(args) {
    const b = this.api.getServer().banned.get();

    if (b.includes(args[0]))
      return this.api.getLogger().info("This player already been banned.");

    if (
      this.api.getServer().clients.filter(async (pl) => pl.username === args[0])
    ) {
      this.api
        .getServer()
        .clients.find((pl) => pl.username === args[0])
        .kick("You were been banned by CONSOLE");

      const doc = new YML.Document();
      doc.contents = b.push(args[0]);
      fs.writeFileSync("./leaf/banned-player.yml", doc.toString());
    } else this.api.getLogger().info("Player not online.");
  }
}

export default Ban;
