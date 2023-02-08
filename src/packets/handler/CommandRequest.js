class CommandRequest {
  /**
   *
   * @param {string} name
   * @param {import('../../api/Player').default} player
   */
  validate(name, player) {
    if (!name) {
      player.send("There is command name.");
    }
  }

  handle() {}
}

export default CommandRequest;
