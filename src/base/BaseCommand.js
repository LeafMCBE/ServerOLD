import API from "../../typings/console/API.js";

export class Command {
  constructor(options) {
    this.options = options;
    this.api = API();
  }
}
