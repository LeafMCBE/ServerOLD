import chalk from "chalk";

const Colors = {
  /**
   *
   * @param {string} text
   * @param {boolean} console
   * @returns {string}
   */
  red: (text, console) => {
    if (console) {
      return chalk.redBright(text);
    } else {
      return `§c${text}`;
    }
  },

  /**
   *
   * @param {string} text
   * @param {boolean} console
   * @returns {string}
   */
  darkRed(text, console) {
    if (console) {
      return chalk.red(text);
    } else {
      return `§4${text}`;
    }
  },

  /**
   *
   * @param {string} text
   * @param {boolean} console
   * @returns {string}
   */
  green(text, console) {
    if (console) {
      return chalk.greenBright(text);
    } else {
      return `§a${text}`;
    }
  },

  /**
   *
   * @param {string} text
   * @param {boolean} console
   * @returns {string}
   */
  darkGreen(text, console) {
    if (console) {
      return chalk.green(text);
    } else {
      return `§2${text}`;
    }
  },

  /**
   *
   * @param {string} text
   * @param {boolean} console
   * @returns {string}
   */
  blue(text, console) {
    if (console) {
      return chalk.blueBright(text);
    } else {
      return `§9${text}`;
    }
  },

  /**
   *
   * @param {string} text
   * @param {boolean} console
   * @returns {string}
   */
  darkBlue(text, console) {
    if (console) {
      return chalk.blue(text);
    } else {
      return `§1${text}`;
    }
  },

  /**
   *
   * @param {string} text
   * @param {boolean} console
   * @returns {string}
   */
  yellow(text, console) {
    if (console) {
      return chalk.yellowBright(text);
    } else {
      return `§e${text}`;
    }
  },

  /**
   *
   * @param {string} text
   * @param {boolean} console
   * @returns {string}
   */
  darkYellow(text, console) {
    if (console) {
      return chalk.yellow(text);
    } else {
      return `§6${text}`;
    }
  },

  /**
   *
   * @param {string} text
   * @param {boolean} console
   * @returns {string}
   */
  aqua(text, console) {
    if (console) {
      return chalk.cyanBright(text);
    } else {
      return `§b${text}`;
    }
  },

  /**
   *
   * @param {string} text
   * @param {boolean} console
   * @returns {string}
   */
  darkAqua(text, console) {
    if (console) {
      return chalk.cyan(text);
    } else {
      return `§3${text}`;
    }
  },

  /**
   *
   * @param {string} text
   * @param {boolean} console
   * @returns {string}
   */
  purple(text, console) {
    if (console) {
      return chalk.magentaBright(text);
    } else {
      return `§d${text}`;
    }
  },

  /**
   *
   * @param {string} text
   * @param {boolean} console
   * @returns {string}
   */
  darkPurple(text, console) {
    if (console) {
      return chalk.magenta(text);
    } else {
      return `§5${text}`;
    }
  },

  /**
   *
   * @param {string} text
   * @param {boolean} console
   * @returns {string}
   */
  gray(text, console) {
    if (console) {
      return chalk.gray(text);
    } else {
      return `§7${text}`;
    }
  },

  /**
   *
   * @param {string} text
   * @param {boolean} console
   * @returns {string}
   */
  black(text, console) {
    if (console) {
      return chalk.black(text);
    } else {
      return `§0${text}`;
    }
  },

  /**
   *
   * @param {string} text
   * @param {boolean} console
   * @returns {string}
   */
  white(text, console) {
    if (console) {
      return text;
    } else {
      return `§f${text}`;
    }
  },

  /**
   * @param {string} text
   * @returns {string}
   */
  colorize(text) {
    const ar = text.split(" ");

    ar.forEach((text, index) => {
      colors.forEach((c) => {
        if (text.startsWith(c.mc)) ar[index] = c.method(text.substring(2));
      });
    });

    return ar.join(" ");
  },
};

const colors = [
  { mc: "§0", method: (t) => chalk.black(t) },
  { mc: "§1", method: (t) => chalk.blue(t) },
  { mc: "§2", method: (t) => chalk.green(t) },
  { mc: "§3", method: (t) => chalk.cyan(t) },
  { mc: "§4", method: (t) => chalk.red(t) },
  { mc: "§5", method: (t) => chalk.purple(t) },
  { mc: "§6", method: (t) => chalk.yellow(t) },
  { mc: "§7", method: (t) => chalk.gray(t) },
  { mc: "§8", method: (t) => chalk.grey(t) },
  { mc: "§9", method: (t) => chalk.blueBright(t) },
  { mc: "§a", method: (t) => chalk.greenBright(t) },
  { mc: "§b", method: (t) => chalk.cyanBright(t) },
  { mc: "§c", method: (t) => chalk.redBright(t) },
  { mc: "§d", method: (t) => chalk.purpleBright(t) },
  { mc: "§e", method: (t) => chalk.yellowBright(t) },
  { mc: "§f", method: (t) => chalk.white(t) },
];

export default Colors;
