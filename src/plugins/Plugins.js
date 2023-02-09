import { mkdirSync, statSync } from "fs";
import glob from "glob";
import { join } from "path";
import { promisify } from "util";
const PG = promisify(glob);

export class Plugins {
  validate() {
    if (!statSync("./leaf/plugins").isDirectory()) {
      this.createDir();
    }
  }

  async load() {
    this.validate();
    let _ = [];

    const files = await PG("./leaf/plugins/**/*.js");
    for (const file of files) {
      const url = `file://${process.cwd().replace(/\\/g, "/")}`;
      const f = (await import(join(url, file.substring(1)))).default;
      _.push(new f());
    }

    return _;
  }

  createDir() {
    mkdirSync("./leaf/plugins");
  }
}
