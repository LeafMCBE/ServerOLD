import readline from "readline";
import fs from "fs";
import { Logger } from "./Logger.js";
import srv from "../../start.js";

export default class CCS {
  constructor() {
    /**
     * @type {import('../base/BaseCommand').Command[]}
     */
    this.commands = [];
  }

  async load() {
    const cmds = fs.readdirSync("./src/commands");
    for (let file of cmds) {
      const cmd = new (await import(`../commands/${file}`)).default();
      this.commands.push(cmd);
    }
  }

  async start() {
    this.load().then(() => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.on("line", (data) => {
        const _ = data.split(" ");
        /**
         * @type {string[]}
         */
        let args = [];
        if (_.length > 1) {
          _.filter((_v, i) => i !== 0).forEach((v) => args.push(v));
        }

        this.commands.forEach((cmd) => {
          if (
            _[0] === cmd.options.name.toLowerCase() ||
            cmd.options.aliases.includes(_[0].toLowerCase())
          ) {
            cmd.run(args);
          } else {
            new Logger({
              name: "Console",
              debug: srv.config.LeafMCBE.debug,
            }).info("Invaild Command");
          }
        });
      });
    });
  }
}
