import chalk from "chalk";

export class Logger {
  constructor(options) {
    this.options = options;
  }

  warn(text) {
    this.write("warn", text);
  }

  error(text) {
    this.write("error", text);
  }

  debug(text) {
    if (this.options.debug) this.write("debug", text);
  }

  info(text) {
    this.write("info", text);
  }

  write(level, text) {
    console.log(
      `[${this.getColorizeLevel(level)}] [${this.options.name}] ${text}`
    );
  }

  getColorizeLevel(level) {
    switch (level) {
      case "info":
        return chalk.blue("INFO");
      case "error":
        return chalk.red("ERROR");
      case "warn":
        return chalk.yellow("WARN");
      case "debug":
        return "DEBUG";
    }
  }
}
