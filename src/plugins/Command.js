import server from "../../start.js";

class Command {
  constructor(options) {
    this.options = options;
  }

  execute() {
    server.console.commands.push(this);
  }
}

export default Command;
