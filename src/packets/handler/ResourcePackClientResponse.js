import { Client } from "bedrock-protocol";

export default class ResourcePackClientResponse {
  /**
   *
   * @param {import('../../Server').default} server
   * @param {Client} client
   * @param {*} packet
   */
  async handle(server, client, packet) {
    switch (packet.data.params.response_status) {
      case "refused":
        server.logger.debug(
          `${client.username} refused to install rps, kicking...`
        );
        try {
          for (let plugin of await server.plugins.load()) {
            if (plugin.onPlayerRefusedRps) plugin.onPlayerRefusedRps();
          }
        } catch (e) {
          if (server.config.notCrashOnPluginError) {
            server.logger.warn(
              `Error from Plugin in Having all rps. Not exiting due to configure.`
            );
          } else {
            server.logger.error(`Error from Plugin`);
            throw e;
          }
        }
        client.disconnect(`Refused to install RPS`);
        break;
      case "have_all_packs":
        server.logger.debug(`${client.username} have all the rps.`);
        try {
          for (let plugin of await server.plugins.load()) {
            if (plugin.onPlayerHavingAllRps) plugin.onPlayerHavingAllRps();
          }
        } catch (e) {
          if (server.config.notCrashOnPluginError) {
            server.logger.warn(
              `Error from Plugin in Having all rps. Not exiting due to configure.`
            );
          } else {
            server.logger.error(`Error from Plugin`);
            throw e;
          }
        }
        break;
      case "completed":
        client.queue("start_game", await this.get("start_game"));
        client.queue("player_list", await this.get("player_list"));
        client.queue("item_component", { entries: [] });
        client.queue(
          "set_spawn_position",
          await this.get("set_spawn_position")
        );
        client.queue("set_time", { time: 5433771 });
        client.queue("set_difficulty", { difficulty: 1 });
        client.queue("set_commands_enabled", { enabled: true });

        client.queue(
          "biome_definition_list",
          await this.get("biome_definition_list")
        );
        client.queue(
          "available_entity_identifiers",
          await this.get("available_entity_identifiers")
        );
        client.queue("update_attributes", await this.get("update_attributes"));
        client.queue("creative_content", await this.get("creative_content"));
        client.queue("inventory_content", await this.get("inventory_content"));
        client.queue("player_hotbar", {
          selected_slot: 1,
          window_id: "inventory",
          select_slot: true,
        });
        client.queue("crafting_data", await this.get("crafting_data"));
        client.queue(
          "available_commands",
          await this.get("available_commands")
        );
        client.queue("chunk_radius_update", { chunk_radius: 1 });
        client.queue(
          "game_rules_changed",
          await this.get("game_rules_changed")
        );
        client.queue("respawn", await this.get("respawn"));

        try {
          for (let plugin of await server.plugins.load()) {
            if (plugin.onPlayerInstalledRps) plugin.onPlayerInstalledRps();
          }
        } catch (e) {
          if (server.config.notCrashOnPluginError) {
            server.logger.warn(
              `Error from Plugin in Having all rps. Not exiting due to configure.`
            );
          } else {
            server.logger.error(`Error from Plugin`);
            throw e;
          }
        }

        setTimeout(async () => {
          // Allow the client to spawn
          client.write("play_status", { status: "player_spawn" });
          try {
            for (let plugin of await server.plugins.load()) {
              if (plugin.onPlayerJoin) plugin.onPlayerJoin(client);
            }
          } catch (e) {
            if (server.config.notCrashOnPluginError) {
              server.logger.warn(
                `Error from Plugin in Having all rps. Not exiting due to configure.`
              );
            } else {
              server.logger.error(`Error from Plugin`);
              throw e;
            }
          }
        }, 3000);
        break;
    }
  }

  /**
   *
   * @param {string} name
   */
  async get(name) {
    return (await import(`../${name}.json`, { assert: { type: "json" } }))
      .default;
  }
}
