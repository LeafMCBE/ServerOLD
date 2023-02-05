import Protocol from "bedrock-protocol";
import ResourcePackClientResponse from "./packets/handler/ResourcePackClientResponse.js";

import { Logger } from "./api/Logger.js";
import { config } from "../leaf/config.js";
import { Plugins } from "./plugins/Plugins.js";

class Server {
  config = config;
  logger = new Logger({ name: "Server", debug: this.config.debug });
  plugins = new Plugins();
  srv;

  constructor() {
    (async () => {
      this.logger.info("Starting Server...");
      try {
        this.srv = Protocol.createServer(this.config);
        this.logger.info(`Listening to ${config.host}:${config.port}`);
        for (let plugin of await this.plugins.load()) {
          this.logger.info(
            `Loading Plugin - ${
              plugin.options.name
            }:${plugin.options.version.join(".")}`
          );
          if (plugin.onEnable) plugin.onEnable();
        }

        this.srv.on("connect", async (client) => {
          client.on("join", () => {
            client.username = client.getUserData().displayName;

            client.write("resource_packs_info", {
              must_accept: false,
              has_scripts: false,
              behaviour_packs: [],
              texture_packs: [],
            });

            // ResourcePackStack is sent by the server to send the order in which resource packs and behaviour packs
            // should be applied (and downloaded) by the client.
            client.write("resource_pack_stack", {
              must_accept: false,
              behavior_packs: [],
              resource_packs: [],
              game_version: "",
              experiments: [],
              experiments_previously_used: false,
            });

            client.on("packet", (packet) => {
              try {
                this.packet(packet, client);
              } catch (e) {
                this.logger.error("Packet Error:");
                throw e;
              }
            });
          });
        });
      } catch (e) {
        this.logger.error(`500 Internal Server Error:`);
        throw e;
      }
    })();
  }

  packet(packet, client) {
    switch (packet.data.name) {
      case "resource_pack_client_response":
        new ResourcePackClientResponse().handle(this, client, packet);
        break;
      case "text":
        client.queue("text", {
          type: "chat",
          needs_transation: false,
          source_name: client.username,
          xuid: "",
          platform_chat_id: "",
          message: `${packet.data.params.message}`,
        });
        this.logger.info(`<${client.username}> ${packet.data.params.message}`);
        break;
    }
  }
}

export default Server;
