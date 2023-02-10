import Protocol from "bedrock-protocol";
import ResourcePackClientResponse from "./packets/handler/ResourcePackClientResponse.js";
import fs from "fs";
import YML from "yaml";

import { Logger } from "./console/Logger.js";
import { Plugins } from "./plugins/Plugins.js";
import Colors from "./api/Colors.js";
import CCS from "./console/ConsoleCommandSender.js";
import Player from "./api/Player.js";
const config = fs.readFileSync("./leaf/config.yml", "utf-8");

class Server {
  /**
   * @type {import('./api/Player').default[]}
   */
  clients = [];
  config = YML.parse(config);
  logger = {
    srv: new Logger({ name: "Server", debug: this.config.LeafMCBE.debug }),
    plugin: new Logger({ name: "Plugins", debug: this.config.LeafMCBE.debug }),
    chat: new Logger({ name: "Chat", debug: this.config.LeafMCBE.debug }),
  };
  console = new CCS();
  plugins = new Plugins();
  srv;

  constructor() {
    (async () => {
      this.logger.srv.info("Starting Server...");
      try {
        this.srv = Protocol.createServer({
          host: this.config.Server.host,
          port: this.config.Server.port,
          motd: {
            motd: this.config.Server.motd,
          },
          version: String(this.config.Server.version),
        });
        this.logger.srv.info(
          `Listening to ${this.config.Server.host}:${this.config.Server.port}`
        );

        for (let plugin of await this.plugins.load()) {
          this.logger.plugin.info(
            `Loading ${plugin.options.name}:${plugin.options.version.join(".")}`
          );
          if (plugin.onEnable) plugin.onEnable();
        }

        this.logger.srv.debug("Loading Console Command Sender...");
        this.console.start();

        this.srv.on("connect", async (client) => {
          client.on("join", async () => {
            client.ip = client.connection.address;
            client.username = client.getUserData().displayName;

            const pl = new Player(client);
            this.clients.push(pl);

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
                this.logger.srv.warn(
                  `Error from Plugin in Having all rps. Not exiting due to configure.`
                );
              } else {
                this.logger.srv.error(`Error from Plugin`);
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

  broadcast(message) {
    this.clients.forEach((pl) => {
      pl.client.queue("text", {
        type: "chat",
        needs_transation: false,
        source_name: "",
        xuid: "",
        platform_chat_id: "",
        message: message,
      });
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
