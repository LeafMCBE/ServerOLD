import { Command } from "../base/BaseCommand.js";

class Shutdown extends Command {
  constructor() {
    super({
      name: "shutdown",
      aliases: ["close", "exit"],
    });
  }

  run() {
    this.api.getLogger().info("Shut downing the server in few seconds...");
    setTimeout(() => {
      this.api.getServer().srv.close("Server Closed");
      process.exit(0);
    }, 2000);
  }
}

export default Shutdown;
