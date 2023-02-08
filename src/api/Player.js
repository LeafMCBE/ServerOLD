import srv from "../../start";

class Player {
  /**
   *
   * @param {import('bedrock-protocol').Client} client
   */
  constructor(client) {
    this.client = client;
  }

  /**
   *
   * @param {string} text
   */
  send(text) {
    this.client.queue("text", {
      type: "chat",
      needs_transation: false,
      source_name: "",
      xuid: "",
      platform_chat_id: "",
      message: text,
    });

    srv.logger.chat.info(text);
  }

  /**
   *
   * @param {string | undefined} reason
   */
  kick(reason) {
    this.client.disconnect(reason || `Kicked for ${reason}`);
  }
}

export default Player;
