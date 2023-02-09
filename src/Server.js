import Protocol from "bedrock-protocol";
import ResourcePackClientResponse from "./packets/handler/ResourcePackClientResponse.js";

import { Logger } from "./api/Logger.js";
import { config } from "../leaf/config.js";
import { Plugins } from "./plugins/Plugins.js";
import Colors from "./api/Colors.js";

class Server {
  config = config;
  logger = {
    srv: new Logger({ name: "Server", debug: this.config.debug }),
    plugin: new Logger({ name: "Plugins", debug: this.config.debug }),
    chat: new Logger({ name: "Chat", debug: this.config.debug }),
  };
  plugins = new Plugins();
  srv;

  constructor() {
    (async () => {
      this.logger.srv.info("Starting Server...");
      try {
        this.srv = Protocol.createServer(this.config);
        this.logger.srv.info(`Listening to ${config.host}:${config.port}`);
        for (let plugin of await this.plugins.load()) {
          this.logger.plugin.info(
            `Loading ${plugin.options.name}:${plugin.options.version.join(".")}`
          );
          if (plugin.onEnable) plugin.onEnable();
        }

        this.srv.on("connect", async (client) => {
          client.on("join", async () => {
            client.ip = client.connection.address;
            client.username = client.getUserData().displayName;

            this.logger.srv.info(`${client.username}[${client.ip}] connected`);

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

            try {
              for (let plugin of await this.plugins.load()) {
                if (plugin.onPlayerPreJoin) plugin.onPlayerPreJoin(client);
              }
            } catch (e) {
              if (this.config.notCrashOnPluginError) {
                this.logger.warn(
                  `Error from Plugin in Having all rps. Not exiting due to configure.`
                );
              } else {
                this.logger.error(`Error from Plugin`);
                throw e;
              }
            }

            client.on("packet", (packet) => {
              try {
                this.packet(packet, client);
              } catch (e) {
                this.logger.error("Packet Error:");
                throw e;
              }
            });
          });

          client.on("spawn", async () => {
            try {
              for (let plugin of await this.plugins.load()) {
                if (plugin.onPlayerJoin) plugin.onPlayerJoin(client);
              }
            } catch (e) {
              if (this.config.notCrashOnPluginError) {
                this.logger.warn(
                  `Error from Plugin in Having all rps. Not exiting due to configure.`
                );
              } else {
                this.logger.error(`Error from Plugin`);
                throw e;
              }
            }
          });
        });
      } catch (e) {
        this.logger.srv.error(`500 Internal Server Error:`);
        throw e;
      }
    })();
  }

  broadcast(client, message) {
    client.queue("text", {
      type: "chat",
      needs_transation: false,
      source_name: "",
      xuid: "",
      platform_chat_id: "",
      message: message,
    });
    this.logger.chat.info(Colors.colorize(message));
  }

  async packet(packet, client) {
    switch (packet.data.name) {
      case "resource_pack_client_response":
        new ResourcePackClientResponse().handle(this, client, packet);
        break;
      case "text":
        client.queue("text", {
          type: "chat",
          needs_transation: false,
          source_name: "",
          xuid: "",
          platform_chat_id: "",
          message: `<${client.username}> ${packet.data.params.message}`,
        });
        this.logger.chat.info(
          Colors.colorize(`<${client.username}> ${packet.data.params.message}`)
        );
        break;
    }
  }
}

export default Server;
