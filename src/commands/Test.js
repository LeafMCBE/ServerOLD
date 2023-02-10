import { Command } from "../base/BaseCommand.js";

class Test extends Command {
  constructor() {
    super({
      name: "test",
      aliases: ["tt"],
    });
  }

  run() {
    this.api.getLogger().info("Hello");
  }
}

export default Test;
