import { Command } from "../base/BaseCommand.js";

class Shutdown extends Command {
  constructor() {
    super({
      name: "shutdown",
      aliases: ["close", "exit"],
      args: {
        min: 0,
        max: 0,
      },
    });
  }

  run() {
    this.api.getLogger().info("Shut downing the server in few seconds...");
    this.api.getServer().broadcast("Shut downing the server in few seconds...");
    setTimeout(() => {
      this.api.getServer().clients.forEach((pl) => {
        pl.kick("Server Closed");
      });
      this.api.getServer().srv.close("Server Closed");
      process.exit(0);
    }, 2000);
  }

  runAsPlayer() {
    this.api.getLogger().info("Shut downing the server in few seconds...");
    this.api.getServer().broadcast("Shut downing the server in few seconds...");
    setTimeout(() => {
      this.api.getServer().srv.close("Server Closed");
      process.exit(0);
    }, 2000);
  }
}

export default Shutdown;
