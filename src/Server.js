import Protocol from "bedrock-protocol";
import ResourcePackClientResponse from "./packets/handler/ResourcePackClientResponse.js";
import fs from "fs";
import YML from "yaml";

import { Logger } from "./console/Logger.js";
import { Plugins } from "./plugins/Plugins.js";
import Colors from "./api/Colors.js";
import CCS from "./console/ConsoleCommandSender.js";
import Player from "./api/Player.js";
import Events from "./api/Events.js";
import Ban from "./api/Ban.js";
import Interact from "./packets/handler/Interact.js";
import ContainerClose from "./packets/ContainerClose.js";
const config = fs.readFileSync("./leaf/config.yml", "utf-8");

if (YML.parse(config).LeafMCBE.doNotCrashOnError) {
  process.on("uncaughtException", (e) => console.error(e));
  process.on("uncaughtExceptionMonitor", (e) => console.error(e));
  process.on("unhandledRejection", (e) => console.error(e));
}

class Server {
  clients = [];
  banned = new Ban();
  config = YML.parse(config);
  logger = {
    srv: new Logger({ name: "Server", debug: this.config.LeafMCBE.debug }),
    plugin: new Logger({ name: "Plugins", debug: this.config.LeafMCBE.debug }),
    chat: new Logger({ name: "Chat", debug: this.config.LeafMCBE.debug }),
  };
  console = new CCS();
  events = new Events();
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
            const v = await this.banned.check(pl);
            if (!v) this.clients.push(pl);

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
                if (plugin.onPlayerPreJoin)
                  plugin.onPlayerPreJoin(new Player(client));
              }
            } catch (e) {
              this.logger.error(`Error from Plugin`);
              throw e;
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
            this.events.emit("playerJoin", new Player(client));
            try {
              for (let plugin of await this.plugins.load()) {
                if (plugin.onPlayerJoin)
                  plugin.onPlayerJoin(new Player(client));
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
      case "command_request":
        var cmdName = packet.data.params.command;
        var _ = cmdName.split(" ");
        var arg = [];
        if (_.length > 1) {
          _.filter((_v, i) => i !== 0).forEach((v) => arg.push(v));
        }
        var args = arg.join(" ").match(/(?:[^\s"]+|"[^"]*")+/g);

        this.console.commands.forEach((cmd) => {
          if (
            cmdName.startsWith(`/${cmd.options.name.toLowerCase()}`) ||
            cmd.options.aliases?.includes(cmdName.replace("/", ""))
          ) {
            if (args.length < cmd.options.args.min)
              return new Player(client).send(
                `Minimum argument is ${cmd.options.args.min} but got ${
                  args.length
                }
Usage: /${
                  cmd.options.aliases
                    ? `[${cmd.options.name}|${cmd.options.aliases.join("|")}]`
                    : `${cmd.options.name}`
                } ${cmd.options.arguments.map(
                  (arg) => `
${arg.optional ? `[${arg.name}: ${arg.type}]` : `<${arg.name}: ${arg.type}>`}`
                )}                 
                `
              );

            if (args.length > cmd.options.args.mix)
              return new Player(client).send(
                `Maximum arguments is ${cmd.options.args.min} but got ${
                  args.length
                }
Usage: /${
                  cmd.options.aliases
                    ? `[${cmd.options.name}|${cmd.options.aliases.join("|")}]`
                    : `${cmd.options.name}`
                } ${cmd.options.arguments.map(
                  (arg) => `
${arg.optional ? `[${arg.name}: ${arg.type}]` : `<${arg.name}: ${arg.type}>`}`
                )}`
              );

            cmd.runAsPlayer(
              new Player(client),
              String(cmdName).split(" ").slice(1)
            );
          }
        });
        break;
      case "disconnect":
        this.events.emit("playerLeft", new Player(client));
        try {
          for (let plugin of await this.plugins.load()) {
            if (plugin.onPlayerLeave) plugin.onPlayerLeave(new Player(client));
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
        break;
      case "interact":
        Interact(packet, client);
        break;
      case "container_close":
        ContainerClose(client);
        break;
    }
  }
}

export default Server;
